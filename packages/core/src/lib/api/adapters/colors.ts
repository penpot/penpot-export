import { CSSCustomPropertyDefinition, ColorAssets } from '../../types'

import { PenpotApiFile } from '../types'

const toHexQuartet = (hexTriplet: string, alpha: number = 1) => {
  const alphaChannel = Math.trunc(alpha * 0x100) - 1
  if (alphaChannel < 0 || alphaChannel > 0xff)
    throw new Error(
      'Invalid alpha (opacity) number: requires a decimal value between 0 and 1.0',
    )

  const rgbChannels = hexTriplet.match(/\w{2}/g)
  if (rgbChannels === null || rgbChannels.length !== 3)
    throw new Error(
      'Invalid RGB value provided: requires 8-bit hexadecimal value per channel',
    )

  const [RR, GG, BB] = rgbChannels
  const AA = alphaChannel.toString(16).padStart(2, '0')

  return ('#' + RR + GG + BB + AA).toLowerCase()
}

const adaptColorsToCssVariables = (penpotFile: PenpotApiFile): ColorAssets => {
  const fileName = penpotFile.name
  const colors = Object.values(penpotFile.data.colors ?? {})

  const cssPropsEntries = colors.map<CSSCustomPropertyDefinition>((color) => {
    return {
      name: color.name,
      value: toHexQuartet(color.color, color.opacity),
    }
  })

  return {
    scope: fileName,
    colors: cssPropsEntries,
  }
}

export default adaptColorsToCssVariables
