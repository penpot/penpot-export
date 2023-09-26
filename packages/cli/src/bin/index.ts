#! /usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import penpotExport from '@penpot-export/core'

import { parsePenpotUrl } from '../penpot'

const [, , command, ...params] = process.argv

switch (command) {
  case 'inspect': {
    const [url] = params

    if (!url) {
      throw new Error(
        'penpot-export: Missing URL to inspect. Provide an URL to the inspect command.',
      )
    }

    try {
      const parsed = parsePenpotUrl(url)
      console.log(
        [
          'The following details are the result of inspecting the provided URL:',
          `Penpot instance: ${parsed.instance}`,
          `Workspace id: ${parsed.workspaceId}`,
          `File id: ${parsed.fileId}`,
          `Page id: ${parsed.pageId}`,
        ].join('\n\t'),
      )
    } catch (e) {
      if (e instanceof TypeError) {
        throw new Error(
          `penpot-export: URL inspection failed with the following error: ${e.message}.`,
        )
      } else {
        throw new Error(
          'penpot-export: URL inspection failed with an unknown error.',
        )
      }
    }

    break
  }
  default: {
    const rootProjectPath = fs.realpathSync(process.cwd())
    const configFilePath = path.resolve(
      rootProjectPath,
      'penpot-export.config.js',
    )
    const exists = fs.existsSync(configFilePath)

    if (!exists) {
      throw new Error(
        'penpot-export: Config file not found. Check if file penpot-export.config.js exists at root.',
      )
    }

    const config = require(configFilePath)

    penpotExport(config, rootProjectPath)
  }
}
