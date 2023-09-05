import fetch, { RequestInit } from 'node-fetch'
import type {
  PenpotApiErrorResponse,
  PenpotApiFile,
  PenpotClientFetcherOptions,
  PenpotClientGetFileOptions,
  PenpotClientSettings,
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

  async getFile(options: PenpotClientGetFileOptions): Promise<PenpotApiFile> {
    const file = await this.fetcher<PenpotApiFile>({
      command: 'get-file',
      body: {
        id: options.fileId,
      },
    })

    return file
  }
}
