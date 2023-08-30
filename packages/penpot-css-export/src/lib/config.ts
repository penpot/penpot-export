import { Config, PagesConfig } from './types'

const BASE_CONFIG: Omit<Config, 'pages' | 'typographies' | 'colors'> = {
  instance: 'https://design.penpot.app',
  accessToken: '',
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

class InvalidInstanceUrlError extends Error {
  constructor() {
    super('Invalid .instance URL in penpot export config.')
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

  let normalizedConfig: Config = {
    ...BASE_CONFIG,
    ...config,
    pages: [],
    typographies: [],
    colors: [],
  }

  if (config.instance != null) {
    try {
      new URL(config.instance)
    } catch (error) {
      if (error instanceof TypeError) {
        throw new InvalidInstanceUrlError()
      }

      throw error
    }

    normalizedConfig.instance = config.instance.endsWith('/')
      ? config.instance.slice(0, -1)
      : config.instance
  }

  for (const [index, colorsConfig] of config.colors.entries()) {
    const { output, fileId } = colorsConfig

    if (!output) {
      throw new MissingOutputPathError(index)
    }

    if (!fileId) {
      throw new MissingFileIdError(index)
    }

    normalizedConfig.colors.push({
      output,
      fileId,
    })
  }

  for (const [index, typographiesConfig] of config.typographies.entries()) {
    const { output, fileId } = typographiesConfig

    if (!output) {
      throw new MissingOutputPathError(index)
    }

    if (!fileId) {
      throw new MissingFileIdError(index)
    }

    normalizedConfig.typographies.push({
      output,
      fileId,
    })
  }

  for (const [index, pageConfig] of config.pages.entries()) {
    if (!pageConfig.output) {
      throw new MissingOutputPathError(index)
    }

    if (!pageConfig.fileId) {
      throw new MissingFileIdError(index)
    }

    if (!pageConfig.pageId) {
      throw new MissingPageIdError(index)
    }

    normalizedConfig.pages.push({
      ...PAGES_CONFIG,
      ...pageConfig,
    })
  }

  return normalizedConfig
}
