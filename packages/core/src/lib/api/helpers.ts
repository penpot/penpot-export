import {
  PenpotApiColor,
  PenpotApiComponent,
  PenpotApiObject,
  PenpotApiPage,
  PenpotApiTypography,
} from './types'

export function isComponent(object: PenpotApiObject) {
  return object.componentRoot === true
}

export const compareByName = (
  assetA: PenpotApiColor | PenpotApiTypography,
  assetB: PenpotApiColor | PenpotApiTypography,
) => (assetA.name > assetB.name ? 1 : -1)

export function getObjectShapesFromPage(
  object: PenpotApiObject,
  page: PenpotApiPage,
): PenpotApiComponent {
  const objects: Record<string, PenpotApiObject> = {}
  const shapes = object.shapes || []

  shapes?.forEach((shapeId) => {
    const object = page.objects[shapeId]

    if (object === undefined) {
      console.warn(`Component "%s" not found in page %s.`, shapeId, page.name)
      return
    }

    objects[object.id] = object
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
