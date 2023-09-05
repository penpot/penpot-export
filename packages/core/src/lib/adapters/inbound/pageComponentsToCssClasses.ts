import {
  getObjectShapesFromPage,
  isComponent,
  pickObjectProps,
} from '../../api/helpers'
import { textToCssClassSelector } from '../../css/helpers'

import { PenpotApiFile, PenpotApiObject } from '../../api'
import { CSSClassDefinition } from '../../types'

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
  penpotFile: PenpotApiFile,
  options: { pageId: string },
): CSSClassDefinition[] => {
  const pages = penpotFile.data.pagesIndex ?? {}
  const page = pages[options.pageId]
  const pageObjects = Object.values(page.objects)
  const components = pageObjects
    .filter(isComponent)
    .map((object) => getObjectShapesFromPage(object, page))

  const cssClassDefinitions = []
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
