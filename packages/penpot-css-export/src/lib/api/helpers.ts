import { PenpotComponent, PenpotObject, PenpotPage } from './types'

export function isComponent(object: PenpotObject) {
  return object.componentRoot === true
}

export function getObjectShapesFromPage(
  object: PenpotObject,
  page: PenpotPage,
): PenpotComponent {
  const objects: PenpotObject[] = []
  const shapes = object.shapes || []

  shapes?.forEach((shapeId) => {
    const object = page.objects[shapeId]

    if (object === undefined) {
      console.warn(`Component "%s" not found in page %s.`, shapeId, page.name)
      return
    }

    objects.push(object)
  })

  return { ...object, objects }
}

export function pickObjectProps(
  reference: Record<string, string>,
  desiredProps: string[],
) {
  const result: Record<string, string> = {}

  Object.keys(reference)
    .filter((key) => desiredProps.includes(key))
    .forEach((key) => {
      result[key] = reference[key]
    })

  return result
}
