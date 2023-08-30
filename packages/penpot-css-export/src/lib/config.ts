import { Config, PagesConfig, FileConfig } from './types'

const createBaseFileConfig = (): FileConfig => ({
  fileId: '',
  colors: [],
  typographies: [],
  pages: [],
})

const createBasePagesConfig = (): PagesConfig => ({
  output: '',
  pageId: '',
})

class FileIdConfigError extends Error {
  constructor() {
    super(`Missing or invalid .fileId in penpot export config.`)
  }
}

class OutputPathConfigError extends Error {
  constructor(index: number) {
    super(`Missing or invalid .path in penpot export config at index ${index}.`)
  }
}

class PageIdConfigError extends Error {
  constructor(index: number) {
    super(
      `Missing or invalid .pageId in penpot export config at index ${index}.`,
    )
  }
}

function validateAndNormalizePenpotExportFileConfig(
  userConfig: object,
): FileConfig {
  const normalizedConfig = createBaseFileConfig()

  if ('fileId' in userConfig && typeof userConfig.fileId === 'string') {
    normalizedConfig.fileId = userConfig.fileId
  } else throw new FileIdConfigError()

  if ('colors' in userConfig && Array.isArray(userConfig.colors)) {
    normalizedConfig.colors = userConfig.colors.map(
      (colorsConfig: object, index) => {
        if (
          'output' in colorsConfig &&
          typeof colorsConfig.output === 'string'
        ) {
          return {
            output: colorsConfig.output,
          }
        } else throw new OutputPathConfigError(index)
      },
    )
  }

  if ('typographies' in userConfig && Array.isArray(userConfig.typographies)) {
    normalizedConfig.typographies = userConfig.typographies.map(
      (typographiesConfig: object, index) => {
        if (
          'output' in typographiesConfig &&
          typeof typographiesConfig.output === 'string'
        ) {
          return {
            output: typographiesConfig.output,
          }
        } else throw new OutputPathConfigError(index)
      },
    )
  }

  if ('pages' in userConfig && Array.isArray(userConfig.pages)) {
    normalizedConfig.pages = userConfig.pages.map(
      (pageConfig: object, index) => {
        const normalizedPageConfig = createBasePagesConfig()

        if ('output' in pageConfig && typeof pageConfig.output === 'string') {
          normalizedPageConfig.output = pageConfig.output
        } else throw new OutputPathConfigError(index)

        if ('pageId' in pageConfig && typeof pageConfig.pageId === 'string') {
          normalizedPageConfig.pageId = pageConfig.pageId
        } else throw new PageIdConfigError(index)

        return normalizedPageConfig
      },
    )
  }

  return normalizedConfig
}

const createBaseConfig = (): Config => ({
  instance: 'https://design.penpot.app',
  accessToken: '',
  files: [],
})

class AccessTokenConfigError extends Error {
  constructor() {
    super('Missing or invalid .accessToken in penpot export config.')
  }
}

class InvalidInstanceUrlConfigError extends Error {
  constructor() {
    super('Invalid .instance URL in penpot export config.')
  }
}

class FilesConfigError extends Error {
  constructor() {
    super('Missing or invalid .files in penpot export config.')
  }
}

export function validateAndNormalizePenpotExportConfig(
  userConfig: object,
): Config {
  let normalizedConfig: Config = createBaseConfig()

  if (
    'accessToken' in userConfig &&
    typeof userConfig.accessToken === 'string'
  ) {
    normalizedConfig.accessToken = userConfig.accessToken
  } else throw new AccessTokenConfigError()

  if ('instance' in userConfig) {
    if (typeof userConfig.instance === 'string') {
      try {
        new URL(userConfig.instance)
      } catch (error) {
        if (error instanceof TypeError)
          throw new InvalidInstanceUrlConfigError()
        throw error
      }

      normalizedConfig.instance = userConfig.instance.endsWith('/')
        ? userConfig.instance.slice(0, -1)
        : userConfig.instance
    } else throw new InvalidInstanceUrlConfigError()
  }

  if (
    'files' in userConfig &&
    Array.isArray(userConfig.files) &&
    userConfig.files.length > 0
  ) {
    normalizedConfig.files = userConfig.files.map(
      validateAndNormalizePenpotExportFileConfig,
    )
  } else throw new FilesConfigError()

  return normalizedConfig
}
