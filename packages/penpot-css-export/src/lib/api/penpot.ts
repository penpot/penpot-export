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
  private accessToken: string

  constructor(settings: PenpotSettings) {
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
      `https://design.penpot.app/api/rpc/command/${command}`,
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
}
