import path from 'node:path'
import Penpot from '../lib/api'
import { validateUserConfig, normalizePenpotExportUserConfig } from './config'
import { writeCssFile } from './outputters/css'
import { adaptTypographiesToCssClassDefinitions } from './adapters/inbound/typographyToCssClasses'
import { adaptColorsToCssVariables } from './adapters/inbound/colorsToCssVariables'
import { adaptPageComponentsToCssClassDefinitions } from './adapters/inbound/pageComponentsToCssClasses'

export async function generateCssFromConfig(
  userConfig: object,
  rootProjectPath: string,
) {
  if (!validateUserConfig(userConfig))
    throw new Error(
      'Error validating user config. This is probably an error in penpot-export code.',
    )

  const config = normalizePenpotExportUserConfig(userConfig)
  const penpot = new Penpot({
    baseUrl: config.instance,
    accessToken: config.accessToken,
  })

  for (const fileConfig of config.files) {
    const penpotFile = await penpot.getFile({
      fileId: fileConfig.fileId,
    })

    console.log('🎨 Processing Penpot file: %s', penpotFile.fileName)

    for (const colorsConfig of fileConfig.colors) {
      const cssPath = path.resolve(rootProjectPath, colorsConfig.output)
      const cssClassDefinition = adaptColorsToCssVariables(penpotFile)

      writeCssFile(cssPath, [cssClassDefinition])

      console.log('✅ Colors: %s', colorsConfig.output)
    }

    for (const typographiesConfig of fileConfig.typographies) {
      const cssPath = path.resolve(rootProjectPath, typographiesConfig.output)
      const cssClassDefinitions =
        adaptTypographiesToCssClassDefinitions(penpotFile)

      writeCssFile(cssPath, cssClassDefinitions)

      console.log('✅ Typographies: %s', typographiesConfig.output)
    }

    for (const pagesConfig of fileConfig.pages) {
      const cssClassDefinitions = adaptPageComponentsToCssClassDefinitions(
        penpotFile,
        { pageId: pagesConfig.pageId },
      )

      const cssPath = path.resolve(rootProjectPath, pagesConfig.output)

      writeCssFile(cssPath, cssClassDefinitions)

      console.log('✅ Page components: %s', pagesConfig.output)
    }
  }
}
