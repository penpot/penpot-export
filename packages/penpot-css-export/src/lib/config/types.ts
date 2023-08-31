export interface PagesConfig {
  output: string
  pageId: string
}

export interface TypographiesConfig {
  output: string
}

export interface ColorsConfig {
  output: string
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
