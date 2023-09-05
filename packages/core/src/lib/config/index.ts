import { UserConfig, UserFileConfig, Config, FileConfig } from './types'

export { validateUserConfig } from './types'
export type * from './types'

function normalizePenpotExportUserFileConfig(
  userConfig: UserFileConfig,
): FileConfig {
  return {
    fileId: userConfig.fileId,
    colors: userConfig.colors !== undefined ? userConfig.colors : [],
    typographies:
      userConfig.typographies !== undefined ? userConfig.typographies : [],
    pages: userConfig.pages !== undefined ? userConfig.pages : [],
  }
}

export function normalizePenpotExportUserConfig(
  userConfig: UserConfig,
): Config {
  const instance = userConfig.instance ?? 'https://design.penpot.app'

  return {
    instance: instance.endsWith('/') ? instance.slice(0, -1) : instance,
    accessToken: userConfig.accessToken,
    files: userConfig.files.map(normalizePenpotExportUserFileConfig),
  }
}
