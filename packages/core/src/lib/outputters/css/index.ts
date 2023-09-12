import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  ColorAssets,
  FontsSummary,
  PageComponentAssets,
  TypographyAssets,
} from '../../types'

import { PenpotExportInvalidAssetsError } from '../errors'
import { describeFontsRequirements } from '../fileHeader'
import { OutputterFunction } from '../types'

import {
  camelToKebab,
  textToCssClassSelector,
  textToCssCustomPropertyName,
} from './syntax'

const serializeCssClass = (cssClassDefinition: CSSClassDefinition): string => {
  const selector = textToCssClassSelector(
    `${cssClassDefinition.scope}--${cssClassDefinition.name}`,
  )
  const cssValidProps = Object.keys(cssClassDefinition.cssProps).map(
    (key) => `  ${camelToKebab(key)}: ${cssClassDefinition.cssProps[key]};`,
  )

  return [`${selector} {`, ...cssValidProps, '}'].join('\n')
}

const serializeCssCustomProperty = (
  cssCustomProperty: CSSCustomPropertyDefinition,
  pad: number,
): string => {
  const { name, value } = cssCustomProperty
  const key = textToCssCustomPropertyName(name)
  const padding = ' '.repeat(pad)

  return `${padding}${key}: ${value};`
}

const serializeCssCustomPropertiesRoot = (
  cssDefinitions: CSSCustomPropertyDefinition[],
) => {
  const pad = 2
  const cssDeclarations = cssDefinitions.map((customPropertyDefinition) =>
    serializeCssCustomProperty(customPropertyDefinition, pad),
  )
  return [`:root {`, ...cssDeclarations, '}'].join('\n')
}

const composeFileHeader = (fontsSummary: FontsSummary) => {
  const message = describeFontsRequirements(fontsSummary)

  return ['/*', ...message.map((line) => ' * ' + line), '*/'].join('\n')
}

const serializeCss: OutputterFunction = ({
  colors,
  typographies,
  typographiesSummary,
  pageComponents,
}: ColorAssets | TypographyAssets | PageComponentAssets): string => {
  if (colors) {
    return serializeCssCustomPropertiesRoot(colors)
  } else if (typographies) {
    const body = typographies.map(serializeCssClass).join('\n\n')
    const header: string = composeFileHeader(typographiesSummary)

    return header + '\n\n' + body
  } else if (pageComponents) {
    return pageComponents.map(serializeCssClass).join('\n\n')
  }

  throw new PenpotExportInvalidAssetsError()
}

export default serializeCss
