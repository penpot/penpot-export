import Penpot from '../lib/api'
import { textToValidClassname } from './string'
import { validateAndNormalizePenpotExportConfig } from './config'
import { CSSClassDefinition, Config } from './types'
import { writeCssFile } from './css'
import path from 'path'

export async function generateCssFromConfig(
  config: Config,
  rootProjectPath: string,
) {
  const validatedConfig = validateAndNormalizePenpotExportConfig(config)
  const penpot = new Penpot({ accessToken: config.accessToken })

  for (const page of validatedConfig.pages) {
    const cssClassDefinitions: CSSClassDefinition[] = []

    const { pageName, components } = await penpot.getPageComponents({
      fileId: page.fileId,
      pageId: page.pageId,
    })
    const pageClassname = textToValidClassname(pageName)

    for (const component of components) {
      for (const object of component.objects) {
        if (object.type === 'text') {
          const cssProps = Penpot.getTextObjectCssProps(object)
          const objectClassname = textToValidClassname(object.name)
          const className = `${pageClassname}--${objectClassname}`
          cssClassDefinitions.push({ className, cssProps })
        }
      }
    }

    const cssPath = path.resolve(rootProjectPath, page.output)

    writeCssFile(cssPath, cssClassDefinitions)

    console.log('✅ %s', page.output)
  }
}
