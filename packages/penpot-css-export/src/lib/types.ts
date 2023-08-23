export interface PagesConfig {
  output: string
  fileId: string
  pageId: string
}

export interface TypographiesConfig {
  output: string
  fileId: string
}

export interface ColorsConfig {
  output: string
  fileId: string
}

export interface Config {
  accessToken: string
  colors: ColorsConfig[]
  typographies: TypographiesConfig[]
  pages: PagesConfig[]
}

export interface CSSClassDefinition {
  selector: string
  cssProps: Record<string, string>
}
