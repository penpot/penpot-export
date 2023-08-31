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

export type UserFileConfig = {
  fileId: string
} & (
  | { colors: ColorsConfig[] }
  | { typographies: TypographiesConfig[] }
  | { pages: PagesConfig[] }
)

export interface UserConfig {
  instance?: string
  accessToken: string
  files: UserFileConfig[]
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

export interface CSSClassDefinition {
  selector: string
  cssProps: Record<string, string>
}
