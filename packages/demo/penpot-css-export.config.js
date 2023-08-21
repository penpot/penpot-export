require('dotenv').config()

/**
 * @type {import('./cli').PenpotExportConfig}
 */
const config = {
  accessToken: process.env.PENPOT_ACCESS_TOKEN,
  pages: [
    {
      output: 'src/styles/ui.css', // 👈🏻 Path where your css should be generated.
      fileId: '71b1702b-2eb1-81d6-8002-f82a5f182087',
      pageId: '71b1702b-2eb1-81d6-8002-f82a5f182088',
    },
  ],
}

module.exports = config
