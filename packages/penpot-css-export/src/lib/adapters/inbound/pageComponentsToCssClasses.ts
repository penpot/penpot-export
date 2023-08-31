import {
  getObjectShapesFromPage,
  isComponent,
  pickObjectProps,
} from '../../api/helpers'
import { textToCssClassSelector } from '../../css/helpers'

import { PenpotApiObject } from '../../api'
import { CSSClassDefinition, PenpotExportFile } from '../../types'

const extractObjectCssProps = (object: PenpotApiObject) => {
  let { textDecoration, ...styles } = object.positionData[0]
  const isTextObject = object.type === 'text'

  if (isTextObject) {
    if (!textDecoration.startsWith('none')) {
      styles = { ...styles, textDecoration }
    }
  }

  return styles
}

const getTextObjectCssProps = (object: PenpotApiObject) => {
  const textCssProps = [
    'fontStyle',
    'fontSize',
    'fontWeight',
    'direction',
    'fontFamily',
  ]
  const objectCssProps = extractObjectCssProps(object)

  return pickObjectProps(objectCssProps, textCssProps)
}

export const adaptPageComponentsToCssClassDefinitions = (
  penpotFile: PenpotExportFile,
  options: { pageId: string },
): CSSClassDefinition[] => {
  const cssClassDefinitions = []

  const page = penpotFile.pages[options.pageId]

  const components = Object.values(page.objects)
    .filter(isComponent)
    .map((object) => getObjectShapesFromPage(object, page))

  for (const component of components) {
    for (const objectId in component.objects) {
      const object = component.objects[objectId]
      if (object.type === 'text') {
        const cssProps = getTextObjectCssProps(object)
        const selector = textToCssClassSelector(`${page.name}--${object.name}`)
        cssClassDefinitions.push({ selector, cssProps })
      }
    }
  }

  return cssClassDefinitions
}
