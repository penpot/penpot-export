import path from 'node:path'

import { adaptTypographiesToCssClassDefinitions } from './adapters/inbound/typographiesToCssClasses'
import { adaptColorsToCssVariables } from './adapters/inbound/colorsToCssVariables'
import { adaptPageComponentsToCssClassDefinitions } from './adapters/inbound/pageComponentsToCssClasses'

import { Penpot } from './api/penpot'

import {
  parseUserConfig,
  normalizePenpotExportUserConfig,
  AssetConfig,
} from './config'
import { writeJsonFile, writeCssFile, writeScssFile } from './outputters'
import { CSSClassDefinition, CSSCustomPropertyDefinition } from './types'

const processOutput = ({
  outputFormat = 'css',
  outputPath,
  content,
}: {
  outputFormat: AssetConfig['format']
  outputPath: string
  content: CSSClassDefinition[] | CSSCustomPropertyDefinition[]
}) => {
  if (outputFormat === 'css') {
    return writeCssFile(outputPath, content)
  }
  if (outputFormat === 'scss') {
    return writeScssFile(outputPath, content)
  }
  if (outputFormat === 'json') {
    return writeJsonFile(outputPath, content)
  }
  throw new Error(
    'Unable to process output format. This is an error in penpot-export code, please contact their authors.',
  )
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
