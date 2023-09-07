import { parseUserConfig } from './userConfig'

// Types
export interface AssetConfig {
  output: string
  format: 'css' | 'scss' | 'json'
}

export interface ColorsConfig extends AssetConfig {}
export interface TypographiesConfig extends AssetConfig {}
export interface PagesConfig extends AssetConfig {
  pageId: string
}

export interface FileConfig {
  fileId: string
  colors: ColorsConfig[]
  typographies: TypographiesConfig[]
  pages: PagesConfig[]
}

export interface Config {
  instance: string
  accessToken: string
  files: FileConfig[]
}

// Types for user config
export type UserConfig = ReturnType<typeof parseUserConfig>
export type UserFileConfig = UserConfig['files'][0]
