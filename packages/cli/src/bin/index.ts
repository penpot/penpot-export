#! /usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import penpotExport from '@penpot-export/core'

const rootProjectPath = fs.realpathSync(process.cwd())
const configFilePath = path.resolve(rootProjectPath, 'penpot-export.config.js')
const exists = fs.existsSync(configFilePath)

if (!exists) {
  throw new Error(
    'penpot-export: Config file not found. Check if file penpot-export.config.js exists at root.',
  )
}

const config = require(configFilePath)

penpotExport(config, rootProjectPath)
