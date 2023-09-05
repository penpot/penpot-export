import fs from 'node:fs'
import path from 'node:path'
import { CSSClassDefinition, CSSCustomPropertyDefinition } from '../types'

const serializeJson = (
  cssClassDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
): string => {
  return JSON.stringify(cssClassDefinitions, null, 2)
}

export function writeJsonFile(
  outputPath: string,
  cssClassDefinitions: CSSClassDefinition[] | CSSCustomPropertyDefinition[],
) {
  const json = serializeJson(cssClassDefinitions)
  const dirname = path.dirname(outputPath)

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }

  fs.writeFileSync(outputPath, json, 'utf-8')
}
