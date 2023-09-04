import type {
  PenpotApiPage,
  PenpotApiTypography,
  PenpotApiColor,
} from './api/types'

export type { UserConfig } from './config/types'

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
