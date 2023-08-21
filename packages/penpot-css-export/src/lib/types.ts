export interface PagesConfig {
  output: string
  fileId: string
  pageId: string
}

export interface Config {
  accessToken: string
  pages: PagesConfig[]
}

export interface CSSClassDefinition {
  className: string
  cssProps: Record<string, string>
}
