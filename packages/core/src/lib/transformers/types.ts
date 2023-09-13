import { ColorAssets, PageComponentAssets, TypographyAssets } from '../types'

export type TransformerFunction<
  T extends ColorAssets | TypographyAssets | PageComponentAssets,
> = (assets: T) => T
