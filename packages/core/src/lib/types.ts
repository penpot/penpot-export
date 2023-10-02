export interface CSSClassDefinition {
  name: string
  cssProps: Record<string, string>
}

export interface CSSCustomPropertyDefinition {
  name: string
  value: string
}

export type FontFamily = string
export type FontWeights = string[]
export type FontsDetails = Record<FontFamily, FontWeights>

export interface FontsSummary {
  googleFonts: FontsDetails
  userCustomFonts: FontsDetails
}

interface BaseAssets {
  scope: string
  colors?: never
  typographies?: never
  typographiesSummary?: never
  pageComponents?: never
}
export interface ColorAssets extends Omit<BaseAssets, 'colors'> {
  colors: CSSCustomPropertyDefinition[]
}
export interface TypographyAssets
  extends Omit<BaseAssets, 'typographies' | 'typographiesSummary'> {
  typographies: CSSClassDefinition[]
  typographiesSummary: FontsSummary
}
export interface PageComponentAssets
  extends Omit<BaseAssets, 'pageComponents'> {
  pageComponents: CSSClassDefinition[]
}

export type PenpotExportAssets =
  | ColorAssets
  | TypographyAssets
  | PageComponentAssets

export { UserConfig, UserFileConfig } from './config'
