import fs from 'node:fs'
import path from 'node:path'

import { textToCssCustomProperyName } from '../css/helpers'

import { camelToKebab } from '../string'
import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  isCssClassDefinition,
} from '../types'

const areCssCustomPropertiesDefinitions = (
  objects: Array<object>,
): objects is Array<CSSCustomPropertyDefinition> => {
  return !objects.every(isCssClassDefinition)
}

const serializeCssClass = (cssClassDefinition: CSSClassDefinition): string => {
  const cssValidProps = Object.keys(cssClassDefinition.cssProps).map(
    (key) => `  ${camelToKebab(key)}: ${cssClassDefinition.cssProps[key]};`,
  )

  return [`${cssClassDefinition.selector} {`, ...cssValidProps, '}'].join('\n')
}

const serializeCssCustomProperties = (
  cssCustomProperties: CSSCustomPropertyDefinition[],
): string => {
  const selector = ':root'
  const cssDeclarations = cssCustomProperties.map(
    ({ name, value }) => `  ${textToCssCustomProperyName(name)}: ${value};`,
  )

  return [`${selector} {`, ...cssDeclarations, '}'].join('\n')
}

const serializeCss = (
  cssDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
): string => {
  if (areCssCustomPropertiesDefinitions(cssDefinitions)) {
    return serializeCssCustomProperties(cssDefinitions)
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
