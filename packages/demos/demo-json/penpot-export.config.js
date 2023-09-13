// @ts-check
require('dotenv').config({ path: '../.env' })

if (typeof process.env.PENPOT_ACCESS_TOKEN !== 'string') {
  throw new Error('Missing PENPOT_ACCESS_TOKEN environment variable')
}

/**
 * @type {import('@penpot-export/core').UserConfig}
 */
const config = {
  instance: process.env.PENPOT_BASE_URL || undefined,
  accessToken: process.env.PENPOT_ACCESS_TOKEN,
  files: [
    {
      fileId: '4a499800-872e-80e1-8002-fc0b585dc061',
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
