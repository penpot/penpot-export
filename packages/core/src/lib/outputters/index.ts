import fs from 'node:fs'
import path from 'node:path'

import { OutputterFunction } from './types'

export { default as cssOutputter } from './css'
export { default as scssOutputter } from './scss'
export { default as jsonOutputter } from './json'

export function writeTextFile(
  outputPath: string,
  outputter: OutputterFunction,
  ...outputterParams: Parameters<OutputterFunction>
) {
  const textContents = outputter(...outputterParams)
  const dirname = path.dirname(outputPath)

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }

  fs.writeFileSync(outputPath, textContents, 'utf-8')
}
