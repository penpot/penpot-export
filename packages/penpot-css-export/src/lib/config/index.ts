import { Config, UserConfig, FileConfig, UserFileConfig } from '../types'

export { validateUserConfig } from './validator'

function normalizePenpotExportUserFileConfig(
  userConfig: UserFileConfig,
): FileConfig {
  return {
    fileId: userConfig.fileId,
    colors: 'colors' in userConfig ? userConfig.colors : [],
    typographies: 'typographies' in userConfig ? userConfig.typographies : [],
    pages: 'pages' in userConfig ? userConfig.pages : [],
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
