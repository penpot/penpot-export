import path from 'node:path'

import { adaptTypographiesToCssClassDefinitions } from './adapters/inbound/typographiesToCssClasses'
import { summarizeTypographies } from './adapters/inbound/typographiesToFontSummary'
import { adaptColorsToCssVariables } from './adapters/inbound/colorsToCssVariables'
import { adaptPageComponentsToCssClassDefinitions } from './adapters/inbound/pageComponentsToCssClasses'

import { Penpot } from './api/penpot'

import {
  parseUserConfig,
  normalizePenpotExportUserConfig,
  AssetConfig,
} from './config'
import {
  writeTextFile,
  cssOutputter,
  scssOutputter,
  jsonOutputter,
  OutputterFunction,
} from './outputters'
import {
  CSSClassDefinition,
  CSSCustomPropertyDefinition,
  FontsSummary,
} from './types'

const processOutput = ({
  outputFormat = 'css',
  outputPath,
  content,
  metadata,
}: {
  outputFormat: AssetConfig['format']
  outputPath: string
  content: CSSClassDefinition[] | CSSCustomPropertyDefinition[]
  metadata?: FontsSummary
}) => {
  const outputter: OutputterFunction | null =
    outputFormat === 'css'
      ? cssOutputter
      : outputFormat === 'scss'
      ? scssOutputter
      : outputFormat === 'json'
      ? jsonOutputter
      : null

  if (outputter === null)
    throw new Error(
      'Unable to process output format. This is an error in penpot-export code, please contact their authors.',
    )

  const textContents = outputter(content, metadata)
  return writeTextFile(outputPath, textContents)
}

export type * from './types'

export default async function penpotExport(
  userConfig: object,
  rootProjectPath: string,
) {
  const parsedUserConfig = parseUserConfig(userConfig)

  const config = normalizePenpotExportUserConfig(parsedUserConfig)
  const penpot = new Penpot({
    baseUrl: config.instance,
    accessToken: config.accessToken,
  })

  for (const fileConfig of config.files) {
    const penpotFile = await penpot.getFile({
      fileId: fileConfig.fileId,
    })

    console.log('🎨 Processing Penpot file: %s', penpotFile.name)

    for (const colorsConfig of fileConfig.colors) {
      processOutput({
        outputFormat: colorsConfig.format,
        outputPath: path.resolve(rootProjectPath, colorsConfig.output),
        content: adaptColorsToCssVariables(penpotFile),
      })

      console.log('✅ Colors: %s', colorsConfig.output)
    }

    for (const typographiesConfig of fileConfig.typographies) {
      processOutput({
        outputFormat: typographiesConfig.format,
        outputPath: path.resolve(rootProjectPath, typographiesConfig.output),
        content: adaptTypographiesToCssClassDefinitions(penpotFile),
        metadata: summarizeTypographies(penpotFile),
      })

      console.log('✅ Typographies: %s', typographiesConfig.output)
    }

    for (const pagesConfig of fileConfig.pages) {
      processOutput({
        outputFormat: pagesConfig.format,
        outputPath: path.resolve(rootProjectPath, pagesConfig.output),
        content: adaptPageComponentsToCssClassDefinitions(penpotFile, {
          pageId: pagesConfig.pageId,
        }),
      })

      console.log('✅ Page components: %s', pagesConfig.output)
    }
  }
}
