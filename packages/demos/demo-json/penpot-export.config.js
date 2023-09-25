// @ts-check
require('dotenv').config({ path: '../.env' })

if (typeof process.env.PENPOT_ACCESS_TOKEN !== 'string') {
  throw new Error('Missing PENPOT_ACCESS_TOKEN environment variable')
}

if (typeof process.env.PENPOT_FILE_ID !== 'string') {
  throw new Error('Missing PENPOT_FILE_ID environment variable')
}

/**
 * @type {import('@penpot-export/core').UserConfig}
 */
const config = {
  instance: process.env.PENPOT_BASE_URL || undefined,
  accessToken: process.env.PENPOT_ACCESS_TOKEN,
  files: [
    {
      fileId: process.env.PENPOT_FILE_ID,
      colors: [
        {
          format: 'json',
          output: './design-tokens/colors.tokens.json', // 👈 Path where your JSON file should be generated.
        },
      ],
      typographies: [
        {
          format: 'json',
          output: './design-tokens/typographies.tokens.json', // 👈 Path where your JSON file should be generated.
        },
      ],
    },
  ],
}

module.exports = config
