import fetch, { RequestInit } from 'node-fetch'
import {
  getObjectShapesFromPage,
  isComponent,
  pickObjectProps,
} from './helpers'
import type {
  PenpotComponent,
  PenpotObject,
  PenpotPage,
  PenpotSettings,
  FetcherOptions,
  PenpotGetPageOptions,
  PenpotApiErrorResponse,
  PenpotTypography,
  PenpotGetFileOptions,
  PenpotFile,
  PenpotColor,
} from './types'

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

  constructor(settings: PenpotSettings) {
    this.instanceBaseUrl = settings.baseUrl
    this.accessToken = settings.accessToken
  }

  private async fetcher<ResultType>(
    options: FetcherOptions,
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

  async getPageComponents(
    options: PenpotGetPageOptions,
  ): Promise<{ pageName: string; components: PenpotComponent[] }> {
    const page = await this.fetcher<PenpotPage>({
      command: 'get-page',
      body: {
        fileId: options.fileId,
        pageId: options.pageId,
      },
    })
    const components = Object.values(page.objects)
      .filter(isComponent)
      .map((object) => getObjectShapesFromPage(object, page))

    return { pageName: page.name, components }
  }

  static extractObjectCssProps(object: PenpotObject) {
    let { textDecoration, ...styles } = object.positionData[0]
    const isTextObject = object.type === 'text'

    if (isTextObject) {
      if (!textDecoration.startsWith('none')) {
        styles = { ...styles, textDecoration }
      }
    }

    return styles
  }

  static getTextObjectCssProps(object: PenpotObject) {
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

  async getFile(options: PenpotGetFileOptions): Promise<{
    fileName: string
    colors: PenpotColor[]
    typographies: PenpotTypography[]
  }> {
    const file = await this.fetcher<PenpotFile>({
      command: 'get-file',
      body: {
        id: options.fileId,
      },
    })
    const colors = file.data.colors ? Object.values(file.data.colors) : []
    const typographies = file.data.typographies
      ? Object.values(file.data.typographies)
      : []

    return { fileName: file.name, colors, typographies }
  }

  static getTypographyAssetCssProps(typography: PenpotTypography) {
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
