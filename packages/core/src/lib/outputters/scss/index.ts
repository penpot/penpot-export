import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  ColorAssets,
  FontsSummary,
  PageComponentAssets,
  TypographyAssets,
} from '../../types'

import { camelToKebab } from '../css/syntax'

import { PenpotExportInvalidAssetsError } from '../errors'
import { describeFontsRequirements } from '../fileHeader'
import { OutputterFunction } from '../types'

import { textToScssVariableName } from './syntax'

/**
 * From: https://sass-lang.com/documentation/values/maps/
 * Most of the time, it’s a good idea to use quoted strings rather than unquoted strings for map keys. This is because
 * some values, such as color names, may look like unquoted strings but actually be other types. To avoid confusing
 * problems down the line, just use quotes!
 */
const serializeScssMap = (cssCustomProperty: CSSClassDefinition) => {
  const mapName = textToScssVariableName(cssCustomProperty.name)
  const mapPairs = Object.entries(cssCustomProperty.cssProps).map(
    ([key, value]) => `  "${camelToKebab(key)}": ${value},`,
  )
  return [`${mapName}: (`, ...mapPairs, `);`].join('\n')
}

const serializeScssVariable = (
  cssCustomProperty: CSSCustomPropertyDefinition,
): string => {
  const { name, value } = cssCustomProperty

  const property = textToScssVariableName(name)
  return `${property}: ${value};`
}

const composeFileHeader = (fontsSummary: FontsSummary) => {
  const message = describeFontsRequirements(fontsSummary)

  return message.map((line) => '// ' + line).join('\n')
}

const serializeScss: OutputterFunction = ({
  colors,
  typographies,
  typographiesSummary,
  pageComponents,
}: ColorAssets | TypographyAssets | PageComponentAssets): string => {
  if (colors) {
    return colors.map(serializeScssVariable).join('\n')
  } else if (typographies) {
    const body = typographies.map(serializeScssMap).join('\n\n')
    const header: string = composeFileHeader(typographiesSummary)

    return header + '\n\n' + body
  } else if (pageComponents) {
    return pageComponents.map(serializeScssMap).join('\n\n')
  }

  throw new PenpotExportInvalidAssetsError()
}

export default serializeScss
