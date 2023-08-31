import Penpot from '../lib/api'
import { validateUserConfig, normalizePenpotExportUserConfig } from './config'
import { CSSClassDefinition } from './types'
import {
  textToCssClassSelector,
  textToCssCustomProperyName,
  writeCssFile,
} from './css'
import path from 'path'
import { getObjectShapesFromPage, isComponent } from './api/helpers'

export async function generateCssFromConfig(
  userConfig: object,
  rootProjectPath: string,
) {
  if (!validateUserConfig(userConfig))
    throw new Error(
      'Error validating user config. This is probably an error in penpot-css-export code.',
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
      const cssClassDefinition: CSSClassDefinition = {
        selector: ':root',
        cssProps: {},
      }

      const { colors } = penpotFile

      for (const colorId in colors) {
        const color = colors[colorId]
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

      for (const typographyId in typographies) {
        const typography = typographies[typographyId]
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

      const page = penpotFile.pages[pagesConfig.pageId]

      const components = Object.values(page.objects)
        .filter(isComponent)
        .map((object) => getObjectShapesFromPage(object, page))

      for (const component of components) {
        for (const objectId in component.objects) {
          const object = component.objects[objectId]
          if (object.type === 'text') {
            const cssProps = Penpot.getTextObjectCssProps(object)
            const selector = textToCssClassSelector(
              `${page.name}--${object.name}`,
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
