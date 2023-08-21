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

export interface PenpotObject {
  id: string
  name: string
  type: 'text'
  positionData: Record<string, string>[]
  componentRoot?: boolean
  shapes?: string[]
}

export interface PenpotPage {
  name: string
  objects: Record<string, PenpotObject>
}

export type PenpotComponent = PenpotObject & { objects: PenpotObject[] }
