import type {
  PenpotApiPage,
  PenpotApiTypography,
  PenpotApiColor,
} from './api/types'

export type { UserConfig } from './config/types'

export interface CSSClassDefinition {
  selector: string
  cssProps: Record<string, string>
}
