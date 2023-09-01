import { PagesConfig, ColorsConfig, TypographiesConfig } from '../types'

class FileIdConfigError extends Error {
  constructor() {
    super(`Missing or invalid .fileId in penpot export config.`)
  }
}

class AssetListConfigError extends Error {
  constructor(assetType: 'colors' | 'typographies' | 'pages') {
    super(`Invalid .${assetType} list in penpot export config.`)
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

export type UserFileConfig = {
  fileId: string
} & (
  | { colors: ColorsConfig[] }
  | { typographies: TypographiesConfig[] }
  | { pages: PagesConfig[] }
)

export interface UserConfig {
  instance?: string
  accessToken: string
  files: UserFileConfig[]
}

function validateUserColorsConfig(
  colorsConfig: object,
  index: number,
): colorsConfig is ColorsConfig {
  if (!('output' in colorsConfig) || typeof colorsConfig.output !== 'string')
    throw new OutputPathConfigError(index)

  return true
}

function validateUserTypographiesConfig(
  typographiesConfig: object,
  index: number,
): typographiesConfig is TypographiesConfig {
  if (
    !('output' in typographiesConfig) ||
    typeof typographiesConfig.output !== 'string'
  )
    throw new OutputPathConfigError(index)

  return true
}

function validateUserPagesConfig(
  pagesConfig: object,
  index: number,
): pagesConfig is PagesConfig {
  if (!('output' in pagesConfig) || typeof pagesConfig.output !== 'string')
    throw new OutputPathConfigError(index)

  if (!('pageId' in pagesConfig) || typeof pagesConfig.pageId !== 'string')
    throw new PageIdConfigError(index)

  return true
}

function validateUserFileConfig(
  userConfig: object,
): userConfig is UserFileConfig {
  if (!('fileId' in userConfig) || typeof userConfig.fileId !== 'string')
    throw new FileIdConfigError()

  if ('colors' in userConfig) {
    if (!Array.isArray(userConfig.colors))
      throw new AssetListConfigError('colors')
    userConfig.colors.every(validateUserColorsConfig)
  }

  if ('typographies' in userConfig) {
    if (!Array.isArray(userConfig.typographies))
      throw new AssetListConfigError('typographies')
    userConfig.typographies.every(validateUserTypographiesConfig)
  }

  if ('pages' in userConfig) {
    if (!Array.isArray(userConfig.pages))
      throw new AssetListConfigError('pages')
    userConfig.pages.every(validateUserPagesConfig)
  }

  return true
}

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

export function validateUserConfig(
  userConfig: object,
): userConfig is UserConfig {
  if (
    !('accessToken' in userConfig) ||
    typeof userConfig.accessToken !== 'string'
  )
    throw new AccessTokenConfigError()

  if ('instance' in userConfig && userConfig.instance !== undefined) {
    if (typeof userConfig.instance !== 'string')
      throw new InvalidInstanceUrlConfigError()

    try {
      new URL(userConfig.instance)
    } catch (error) {
      if (error instanceof TypeError) throw new InvalidInstanceUrlConfigError()
      throw error
    }
  }

  if (
    !('files' in userConfig) ||
    !Array.isArray(userConfig.files) ||
    userConfig.files.length === 0
  )
    throw new FilesConfigError()

  userConfig.files.every(validateUserFileConfig)

  return true
}
