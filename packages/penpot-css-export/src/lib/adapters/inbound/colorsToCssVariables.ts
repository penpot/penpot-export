import { textToCssCustomProperyName } from '../../css/helpers'

import { CSSClassDefinition, PenpotExportFile } from '../../types'

export const adaptColorsToCssVariables = (
  penpotFile: PenpotExportFile,
): CSSClassDefinition => {
  const { colors } = penpotFile

  const cssPropsEntries = Object.values(colors).map((color) => {
    const objectClassName = textToCssCustomProperyName(color.name)

    return [
      objectClassName,
      color.color, // FIXME Add opacity with rgba()
    ]
  })

  return {
    selector: ':root',
    cssProps: Object.fromEntries(cssPropsEntries),
  }
}
