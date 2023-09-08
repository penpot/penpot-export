import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  FontsSummary,
  isCssClassDefinition,
} from '../../types'

import { camelToKebab } from '../css/syntax'

import { describeFontsRequirements } from '../fileHeader'
import { OutputterFunction } from '../types'

import { textToScssVariableName } from './syntax'

const areCssCustomPropertiesDefinitions = (
  objects: Array<object>,
): objects is Array<CSSCustomPropertyDefinition> => {
  return !objects.every(isCssClassDefinition)
}

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

const composeFileBody = (
  cssDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
) => {
  if (areCssCustomPropertiesDefinitions(cssDefinitions)) {
    const cssDeclarations = cssDefinitions.map((customPropertyDefinition) =>
      serializeScssVariable(customPropertyDefinition),
    )
    return cssDeclarations.join('\n')
  } else {
    return cssDefinitions.map(serializeScssMap).join('\n\n')
  }
}

const serializeScss: OutputterFunction = (
  cssDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
  fontsSummary?: FontsSummary,
): string => {
  const body: string = composeFileBody(cssDefinitions)

  if (fontsSummary === undefined) return body

  const header: string = composeFileHeader(fontsSummary)
  return header + '\n\n' + body
}

export default serializeScss
