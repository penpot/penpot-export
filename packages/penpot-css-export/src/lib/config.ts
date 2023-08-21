import { Config, PagesConfig } from './types'

const CONFIG: Config = {
  accessToken: '',
  pages: [],
}

const PAGES_CONFIG: PagesConfig = {
  output: '',
  fileId: '',
  pageId: '',
}

class MissingAccessTokenError extends Error {
  constructor() {
    super('Missing or empty .accessToken in penpot export config.')
  }
}

class MissingOutputPathError extends Error {
  constructor(index: number) {
    super(`Missing or empty .path in penpot export config at index ${index}.`)
  }
}

class MissingFileIdError extends Error {
  constructor(index: number) {
    super(`Missing or empty .fileId in penpot export config at index ${index}.`)
  }
}

class MissingPageIdError extends Error {
  constructor(index: number) {
    super(`Missing or empty .pageId in penpot export config at index ${index}.`)
  }
}

export function validateAndNormalizePenpotExportConfig(config: Config): Config {
  if (!config.accessToken) {
    throw new MissingAccessTokenError()
  }

  let normalizedConfig: Config = { ...CONFIG, ...config, pages: [] }

  for (const [index, page] of config.pages.entries()) {
    if (!page.output) {
      throw new MissingOutputPathError(index)
    }

    if (!page.fileId) {
      throw new MissingFileIdError(index)
    }

    if (!page.pageId) {
      throw new MissingPageIdError(index)
    }

    normalizedConfig.pages.push({
      ...PAGES_CONFIG,
      ...page,
    })
  }

  return normalizedConfig
}
