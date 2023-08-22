export interface PenpotSettings {
  accessToken: string
}

export interface FetcherOptions {
  command: string
  body: Record<string, string>
}

export interface PenpotGetPageOptions {
  fileId: string
  pageId: string
}

export interface PenpotGetFileOptions {
  fileId: string
}

export interface PenpotObject {
  id: string
  name: string
  type: 'text'
  positionData: Record<string, string>[]
  componentRoot?: boolean
  shapes?: string[]
}

type CssTextProperty =
  | 'lineHeight'
  | 'fontStyle'
  | 'textTransform'
  | 'fontSize'
  | 'fontWeight'
  | 'letterSpacing'
  | 'fontFamily'

export type PenpotTypography = {
  id: string
  name: string
  modifiedAt: string
  path: string
  fontId: string
  fontVariantId: string
} & Record<CssTextProperty, string>

export interface PenpotPage {
  name: string
  objects: Record<string, PenpotObject>
}

export interface PenpotFile {
  id: string
  name: string
  revn: number
  modifiedAt: string
  data: {
    id: string
    version: number
    typographies: PenpotTypography[]
    pages: PenpotPage[]
  }
}

export interface PenpotApiErrorResponse {
  type: string
  code: string
}

export type PenpotComponent = PenpotObject & { objects: PenpotObject[] }
