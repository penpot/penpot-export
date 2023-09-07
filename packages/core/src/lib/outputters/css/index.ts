import fs from 'node:fs'
import path from 'node:path'

import {
  camelToKebab,
  textToCssClassSelector,
  textToCssCustomPropertyName,
} from './syntax'

import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  isCssClassDefinition,
} from '../../types'

const areCssCustomPropertiesDefinitions = (
  objects: Array<object>,
): objects is Array<CSSCustomPropertyDefinition> => {
  return !objects.every(isCssClassDefinition)
}

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

const serializeCss = (
  cssDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
): string => {
  if (areCssCustomPropertiesDefinitions(cssDefinitions)) {
    const pad = 2
    const cssDeclarations = cssDefinitions.map((customPropertyDefinition) =>
      serializeCssCustomProperty(customPropertyDefinition, pad),
    )
    return [`:root {`, ...cssDeclarations, '}'].join('\n')
  } else {
    return cssDefinitions.map(serializeCssClass).join('\n\n')
  }
}

export function writeCssFile(
  outputPath: string,
  cssDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
) {
  const css = serializeCss(cssDefinitions)
  const dirname = path.dirname(outputPath)

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }

  fs.writeFileSync(outputPath, css, 'utf-8')
}
