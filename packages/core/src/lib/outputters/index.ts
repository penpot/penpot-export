import fs from 'node:fs'
import path from 'node:path'

export function writeTextFile(outputPath: string, textContents: string) {
  const dirname = path.dirname(outputPath)

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }

  fs.writeFileSync(outputPath, textContents, 'utf-8')
}

export { default as cssOutputter } from './css'
export { default as scssOutputter } from './scss'
export { default as jsonOutputter } from './json'

export type { OutputterFunction } from './types'
