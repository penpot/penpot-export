export interface PenpotClientSettings {
  baseUrl: string
  accessToken: string
}

export interface PenpotClientFetcherOptions {
  command: string
  body: Record<string, string>
}

export interface PenpotClientGetFileOptions {
  fileId: string
}

export interface PenpotApiObject {
  id: string
  name: string
  type: 'text'
  positionData: Record<string, string>[]
  componentRoot?: boolean
  shapes?: string[]
}

type PenpotApiAsset = {
  id: string
  name: string
  modifiedAt: string
  path: string
}

export interface PenpotApiColor extends PenpotApiAsset {
  color: string
  opacity: number
}

export type CssTextProperty =
  | 'lineHeight'
  | 'fontStyle'
  | 'textTransform'
  | 'fontSize'
  | 'fontWeight'
  | 'letterSpacing'
  | 'fontFamily'

export type PenpotApiTypography = PenpotApiAsset & {
  fontId: string
  fontVariantId: string
} & Record<CssTextProperty, string>

interface PenpotApiContainer {
  id: string
  name: string
  objects: Record<string, PenpotApiObject>
}
export type PenpotApiPage = PenpotApiContainer
export type PenpotApiComponent = PenpotApiContainer

export interface PenpotApiFile {
  id: string
  name: string
  revn: number
  modifiedAt: string
  data: {
    id: string
    version: number
    colors?: Record<string, PenpotApiColor>
    typographies?: Record<string, PenpotApiTypography>
    pagesIndex?: Record<string, PenpotApiPage>
  }
}

export interface PenpotApiErrorResponse {
  type: string
  code: string
}
