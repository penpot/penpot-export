import fs from 'fs'
import { camelToKebab } from './string'
import { CSSClassDefinition } from './types'

export function cssClassDefinitionToCSS(cssClassDefinition: CSSClassDefinition): string {
  const cssValidProps = Object.keys(cssClassDefinition.cssProps).map(
    (key) => `  ${camelToKebab(key)}: ${cssClassDefinition.cssProps[key]};`
  )

  return [`.${cssClassDefinition.className} {`, ...cssValidProps, '}'].join('\n')
}

export function writeCssFile(path: string, cssClassDefinitions: CSSClassDefinition[]) {
  const css = cssClassDefinitions.map(cssClassDefinitionToCSS).join('\n\n')
  const pathDirs = path.trim().split('/')
  const dirname = pathDirs.slice(0, pathDirs.length - 1).join('/')

  if (!fs.existsSync(dirname)) {
    console.log('generando...')
    fs.mkdirSync(dirname, { recursive: true })
  }

  fs.writeFileSync(path, css, 'utf-8')
}
