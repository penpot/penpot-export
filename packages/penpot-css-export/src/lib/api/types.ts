export interface PenpotSettings {
  baseUrl: string
  accessToken: string
}

export interface FetcherOptions {
  command: string
  body: Record<string, string>
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

type PenpotAsset = {
  id: string
  name: string
  modifiedAt: string
  path: string
}

export interface PenpotColor extends PenpotAsset {
  color: string
  opacity: number
}

type CssTextProperty =
  | 'lineHeight'
  | 'fontStyle'
  | 'textTransform'
  | 'fontSize'
  | 'fontWeight'
  | 'letterSpacing'
  | 'fontFamily'

export type PenpotTypography = PenpotAsset & {
  fontId: string
  fontVariantId: string
} & Record<CssTextProperty, string>

export interface PenpotPage {
  id: string
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
    colors?: Record<string, PenpotColor>
    typographies?: Record<string, PenpotTypography>
    pagesIndex?: Record<string, PenpotPage>
  }
}

export interface PenpotApiErrorResponse {
  type: string
  code: string
}

export type PenpotComponent = PenpotObject & { objects: PenpotObject[] }
