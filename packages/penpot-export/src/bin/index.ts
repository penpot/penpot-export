#! /usr/bin/env node

import fs from 'fs'
import path from 'path'
import { generateCssFromConfig } from '../lib'

const rootProjectPath = fs.realpathSync(process.cwd())
const configFilePath = path.resolve(rootProjectPath, 'penpot-export.config.js')
const exists = fs.existsSync(configFilePath)

if (!exists) {
  throw new Error(
    'penpot-export: Config file not found. Check if file penpot-export.config.js exists at root.',
  )
}

const config = require(configFilePath)

generateCssFromConfig(config, rootProjectPath)
