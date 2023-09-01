import { textToCssCustomProperyName } from '../../css/helpers'

import { CSSClassDefinition, PenpotExportFile } from '../../types'

const toRgbaCssValue = (hex: string, alpha: number = 1) => {
  const channels = hex.match(/\w{2}/g)
  if (channels === null || channels.length !== 3)
    throw new Error(
      'Invalid RGB value provided: requires 8-bit hexadecimal value per channel',
    )

  const [r, g, b] = channels.map((channelHex) => parseInt(channelHex, 16))
  return `rgba(${[r, g, b, alpha].join(', ')})`
}

export const adaptColorsToCssVariables = (
  penpotFile: PenpotExportFile,
): CSSClassDefinition => {
  const { colors } = penpotFile

  const cssPropsEntries = Object.values(colors).map((color) => {
    const objectClassName = textToCssCustomProperyName(color.name)

    return [objectClassName, toRgbaCssValue(color.color, color.opacity)]
  })

  return {
    selector: ':root',
    cssProps: Object.fromEntries(cssPropsEntries),
  }
}
