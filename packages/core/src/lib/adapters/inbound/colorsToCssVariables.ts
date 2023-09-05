import { textToCssCustomProperyName } from '../../css/helpers'

import { PenpotApiFile } from '../../api'
import { CSSClassDefinition } from '../../types'

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
  penpotFile: PenpotApiFile,
): CSSClassDefinition => {
  const colors = Object.values(penpotFile.data.colors ?? {})

  const cssPropsEntries = colors.map((color) => {
    const objectClassName = textToCssCustomProperyName(color.name)

    return [objectClassName, toRgbaCssValue(color.color, color.opacity)]
  })

  return {
    selector: ':root',
    cssProps: Object.fromEntries(cssPropsEntries),
  }
}
