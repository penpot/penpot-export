import { ColorAssets, PageComponentAssets, TypographyAssets } from '../types'

import { PenpotExportInvalidAssetsError } from './errors'
import { OutputterFunction } from './types'

const serializeJson: OutputterFunction = ({
  colors,
  typographies,
  pageComponents,
}: ColorAssets | TypographyAssets | PageComponentAssets): string => {
  const assets = colors ?? typographies ?? pageComponents ?? null

  if (assets === null) throw new PenpotExportInvalidAssetsError()

  return JSON.stringify(assets, null, 2)
}

export default serializeJson
