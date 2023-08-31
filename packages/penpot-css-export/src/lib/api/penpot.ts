import fetch, { RequestInit } from 'node-fetch'
import { pickObjectProps } from './helpers'
import type {
  PenpotApiErrorResponse,
  PenpotApiFile,
  PenpotApiObject,
  PenpotApiTypography,
  PenpotClientFetcherOptions,
  PenpotClientGetFileOptions,
  PenpotClientSettings,
} from './types'
import { PenpotExportFile } from '../types'

class PenpotApiError extends Error {
  constructor(parsedError: PenpotApiErrorResponse) {
    super(
      `Penpot API call failed: error type "${parsedError.type}" with code "${parsedError.code}".`,
    )
  }
}

class PenpotApiUnknownError extends Error {
  constructor() {
    super('Unknown Penpot API error.')
  }
}

export class Penpot {
  private instanceBaseUrl: string
  private accessToken: string

  constructor(settings: PenpotClientSettings) {
    this.instanceBaseUrl = settings.baseUrl
    this.accessToken = settings.accessToken
  }

  private async fetcher<ResultType>(
    options: PenpotClientFetcherOptions,
  ): Promise<ResultType> {
    const { command, body } = options
    const config: RequestInit = {
      headers: {
        accept: 'application/json',
        authorization: `Token ${this.accessToken}`,
        'content-type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(body),
    }

    const response = await fetch(
      `${this.instanceBaseUrl}/api/rpc/command/${command}`,
      config,
    )

    if (!response.ok) {
      const error = await response
        .clone()
        .json()
        .then((parsedError) => new PenpotApiError(parsedError))
        .catch(() => new PenpotApiUnknownError())

      throw error
    }

    const json = await response.json()

    return json as ResultType
  }

  static extractObjectCssProps(object: PenpotApiObject) {
    let { textDecoration, ...styles } = object.positionData[0]
    const isTextObject = object.type === 'text'

    if (isTextObject) {
      if (!textDecoration.startsWith('none')) {
        styles = { ...styles, textDecoration }
      }
    }

    return styles
  }

  static getTextObjectCssProps(object: PenpotApiObject) {
    const textCssProps = [
      'fontStyle',
      'fontSize',
      'fontWeight',
      'direction',
      'fontFamily',
    ]
    const objectCssProps = Penpot.extractObjectCssProps(object)

    return pickObjectProps(objectCssProps, textCssProps)
  }

  async getFile(
    options: PenpotClientGetFileOptions,
  ): Promise<PenpotExportFile> {
    const file = await this.fetcher<PenpotApiFile>({
      command: 'get-file',
      body: {
        id: options.fileId,
      },
    })

    return {
      fileName: file.name,
      colors: file.data.colors ?? {},
      typographies: file.data.typographies ?? {},
      pages: file.data.pagesIndex ?? {},
    }
  }

  static getTypographyAssetCssProps(typography: PenpotApiTypography) {
    const textCssProps = [
      'lineHeight',
      'fontStyle',
      'textTransform',
      'fontWeight',
      'direction',
    ]

    return {
      ...pickObjectProps(typography, textCssProps),
      fontSize: `${typography.fontSize}px`,
      letterSpacing: `${typography.letterSpacing}px`,
      fontFamily: `"${typography.fontFamily}"`,
    }
  }
}
