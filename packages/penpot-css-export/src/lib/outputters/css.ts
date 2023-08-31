import fs from 'node:fs'
import path from 'node:path'
import { camelToKebab } from '../string'
import { CSSClassDefinition } from '../types'

const serializeCssClass = (cssClassDefinition: CSSClassDefinition): string => {
  const cssValidProps = Object.keys(cssClassDefinition.cssProps).map(
    (key) => `  ${camelToKebab(key)}: ${cssClassDefinition.cssProps[key]};`,
  )

  return [`${cssClassDefinition.selector} {`, ...cssValidProps, '}'].join('\n')
}

const serializeCss = (cssClassDefinitions: CSSClassDefinition[]): string => {
  return cssClassDefinitions.map(serializeCssClass).join('\n\n')
}

export function writeCssFile(
  outputPath: string,
  cssClassDefinitions: CSSClassDefinition[],
) {
  const css = serializeCss(cssClassDefinitions)
  const dirname = path.dirname(outputPath)

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }

  fs.writeFileSync(outputPath, css, 'utf-8')
}
