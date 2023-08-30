import Penpot from '../lib/api'
import { validateAndNormalizePenpotExportConfig } from './config'
import { CSSClassDefinition, Config } from './types'
import {
  textToCssClassSelector,
  textToCssCustomProperyName,
  writeCssFile,
} from './css'
import path from 'path'

export async function generateCssFromConfig(
  userConfig: object,
  rootProjectPath: string,
) {
  const config = validateAndNormalizePenpotExportConfig(userConfig)
  const penpot = new Penpot({
    baseUrl: config.instance,
    accessToken: config.accessToken,
  })

  for (const fileConfig of config.files) {
    const penpotFile = await penpot.getFile({
      fileId: fileConfig.fileId,
    })

    console.log('🖼️ Processing Penpot file: %s', penpotFile.fileName)

    for (const colorsConfig of fileConfig.colors) {
      const cssClassDefinition: CSSClassDefinition = {
        selector: ':root',
        cssProps: {},
      }

      const { colors } = penpotFile

      for (const color of colors) {
        const objectClassname = textToCssCustomProperyName(color.name)
        cssClassDefinition.cssProps[objectClassname] = color.color // FIXME Add opacity with rgba()
      }

      const cssPath = path.resolve(rootProjectPath, colorsConfig.output)

      writeCssFile(cssPath, [cssClassDefinition])

      console.log('✅ Colors: %s', colorsConfig.output)
    }

    for (const typographiesConfig of fileConfig.typographies) {
      const cssClassDefinitions: CSSClassDefinition[] = []

      const { fileName, typographies } = penpotFile

      for (const typography of typographies) {
        const cssProps = Penpot.getTypographyAssetCssProps(typography)
        const selector = textToCssClassSelector(
          `${fileName}--${typography.name}`,
        )
        cssClassDefinitions.push({ selector, cssProps })
      }

      const cssPath = path.resolve(rootProjectPath, typographiesConfig.output)

      writeCssFile(cssPath, cssClassDefinitions)

      console.log('✅ Typographies: %s', typographiesConfig.output)
    }

    for (const pagesConfig of fileConfig.pages) {
      const cssClassDefinitions: CSSClassDefinition[] = []

      const { pageName, components } = await penpot.getPageComponents({
        fileId: fileConfig.fileId,
        pageId: pagesConfig.pageId,
      })

      for (const component of components) {
        for (const object of component.objects) {
          if (object.type === 'text') {
            const cssProps = Penpot.getTextObjectCssProps(object)
            const selector = textToCssClassSelector(
              `${pageName}--${object.name}`,
            )
            cssClassDefinitions.push({ selector, cssProps })
          }
        }
      }

      const cssPath = path.resolve(rootProjectPath, pagesConfig.output)

      writeCssFile(cssPath, cssClassDefinitions)

      console.log('✅ Page components: %s', pagesConfig.output)
    }
  }
}
