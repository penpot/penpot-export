import path from 'node:path'

import {
  default as PenpotApiClient,
  adaptColors,
  adaptTypographies,
  adaptPageComponents,
} from './api'
import {
  parseUserConfig,
  normalizePenpotExportUserConfig,
  AssetConfig,
} from './config'
import { PenpotExportInternalError } from './errors'
import {
  writeTextFile,
  cssOutputter,
  scssOutputter,
  jsonOutputter,
  OutputterFunction,
} from './outputters'
import {
  scopeTypographiesClassNames,
  scopePageComponentsClassNames,
  TransformerFunction,
} from './transformers'
import { PenpotExportAssets } from './types'

function processOutput<T extends PenpotExportAssets>({
  outputFormat,
  outputPath,
  assets,
  transform,
}: {
  outputFormat: AssetConfig['format']
  outputPath: string
  assets: T
  transform?: TransformerFunction<T>
}) {
  const outputter: OutputterFunction | null =
    outputFormat === 'css'
      ? cssOutputter
      : outputFormat === 'scss'
      ? scssOutputter
      : outputFormat === 'json'
      ? jsonOutputter
      : null

  if (outputter === null)
    throw new PenpotExportInternalError('Unable to process output format')

  const transformedAssets = transform !== undefined ? transform(assets) : assets
  const textContents = outputter(transformedAssets)
  return writeTextFile(outputPath, textContents)
}

export default async function penpotExport(
  userConfig: object,
  rootProjectPath: string,
) {
  const parsedUserConfig = parseUserConfig(userConfig)

  const config = normalizePenpotExportUserConfig(parsedUserConfig)
  const penpot = new PenpotApiClient({
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
        assets: adaptColors(penpotFile),
      })

      console.log('✅ Colors: %s', colorsConfig.output)
    }

    for (const typographiesConfig of fileConfig.typographies) {
      processOutput({
        outputFormat: typographiesConfig.format,
        outputPath: path.resolve(rootProjectPath, typographiesConfig.output),
        assets: adaptTypographies(penpotFile),
        transform:
          typographiesConfig.format === 'css'
            ? scopeTypographiesClassNames
            : undefined,
      })

      console.log('✅ Typographies: %s', typographiesConfig.output)
    }

    for (const pagesConfig of fileConfig.pages) {
      processOutput({
        outputFormat: pagesConfig.format,
        outputPath: path.resolve(rootProjectPath, pagesConfig.output),
        assets: adaptPageComponents(penpotFile, {
          pageId: pagesConfig.pageId,
        }),
        transform:
          pagesConfig.format === 'css'
            ? scopePageComponentsClassNames
            : undefined,
      })

      console.log('✅ Page components: %s', pagesConfig.output)
    }
  }
}

export type * from './types'
