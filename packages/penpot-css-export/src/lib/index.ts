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
  config: Config,
  rootProjectPath: string,
) {
  const validatedConfig = validateAndNormalizePenpotExportConfig(config)
  const penpot = new Penpot({
    baseUrl: validatedConfig.instance,
    accessToken: validatedConfig.accessToken,
  })

  for (const colorsConfig of validatedConfig.colors) {
    const cssClassDefinition: CSSClassDefinition = {
      selector: ':root',
      cssProps: {},
    }

    const { colors } = await penpot.getFileColors({
      fileId: colorsConfig.fileId,
    })

    for (const color of colors) {
      const objectClassname = textToCssCustomProperyName(color.name)
      cssClassDefinition.cssProps[objectClassname] = color.color // FIXME Add opacity with rgba()
    }

    const cssPath = path.resolve(rootProjectPath, colorsConfig.output)

    writeCssFile(cssPath, [cssClassDefinition])

    console.log('✅ Colors: %s', colorsConfig.output)
  }

  for (const typographiesConfig of validatedConfig.typographies) {
    const cssClassDefinitions: CSSClassDefinition[] = []

    const { fileName, typographies } = await penpot.getFileTypographies({
      fileId: typographiesConfig.fileId,
    })

    for (const typography of typographies) {
      const cssProps = Penpot.getTypographyAssetCssProps(typography)
      const selector = textToCssClassSelector(`${fileName}--${typography.name}`)
      cssClassDefinitions.push({ selector, cssProps })
    }

    const cssPath = path.resolve(rootProjectPath, typographiesConfig.output)

    writeCssFile(cssPath, cssClassDefinitions)

    console.log('✅ Typographies: %s', typographiesConfig.output)
  }

  for (const page of validatedConfig.pages) {
    const cssClassDefinitions: CSSClassDefinition[] = []

    const { pageName, components } = await penpot.getPageComponents({
      fileId: page.fileId,
      pageId: page.pageId,
    })

    for (const component of components) {
      for (const object of component.objects) {
        if (object.type === 'text') {
          const cssProps = Penpot.getTextObjectCssProps(object)
          const selector = textToCssClassSelector(`${pageName}--${object.name}`)
          cssClassDefinitions.push({ selector, cssProps })
        }
      }
    }

    const cssPath = path.resolve(rootProjectPath, page.output)

    writeCssFile(cssPath, cssClassDefinitions)

    console.log('✅ Page components: %s', page.output)
  }
}
