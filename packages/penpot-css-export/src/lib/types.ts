import type {
  PenpotApiPage,
  PenpotApiTypography,
  PenpotApiColor,
} from './api/types'
import type {
  ColorsConfig,
  PagesConfig,
  TypographiesConfig,
} from './config/types'

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

export interface PenpotExportFile {
  fileName: string
  colors: Record<string, PenpotApiColor>
  typographies: Record<string, PenpotApiTypography>
  pages: Record<string, PenpotApiPage>
}

export interface CSSClassDefinition {
  selector: string
  cssProps: Record<string, string>
}
