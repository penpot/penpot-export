// @ts-check
require('dotenv').config()

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
      fileId: 'abea3ef6-4c19-808a-8003-01370d9cb586',
      pages: [
        {
          pageId: '71b1702b-2eb1-81d6-8002-f82a5f182088',
          output: 'src/styles/ui.css', // 👈 Path where your CSS file should be generated.
        },
      ],
    },
    {
      fileId: '4a499800-872e-80e1-8002-fc0b585dc061',
      colors: [
        {
          output: 'src/styles/colors.css', // 👈 Path where your CSS file should be generated.
        },
      ],
      typographies: [
        {
          output: 'src/styles/typographies.css', // 👈 Path where your CSS file should be generated.
        },
      ],
    },
  ],
}

module.exports = config
