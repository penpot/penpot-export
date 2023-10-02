# penpot-export

`penpot-export` is a tool designed to export your design tokens created in Penpot into ready-to-use code or parseable data files.

Currently, it is able to export page components as CSS and SCSS declarations, and typography and colors assets as CSS, SCSS or JSON (following the [Second Editor' Draft](https://second-editors-draft.tr.designtokens.org/format/) of the [W3C Design Tokens Community Group](https://github.com/design-tokens/community-group) format spec).


## 📦 Packages

[`@penpot-export/cli`](./packages/cli/) ([npm package](https://www.npmjs.com/package/@penpot-export/cli)) is a CLI tool to use `penpot-export` through the command line. It features a configuration file where you declare what will be exported, where in the file system and what format will use.

[`@penpot-export/core`](./packages/core/) ([npm package](https://www.npmjs.com/package/@penpot-export/core)) contains the core functionality to retrieve the Penpot data, transform it and output it to the filesystem.

[demos](./packages/demos/) is a demostrative private package that contains some examples of how to use `@penpot-export/cli`.


## 🧑‍💻 Usage

### ⬇️ Installation

The recommended way to install the `penpot-export` CLI is as a development dependency on a project:

```bash
# npm
npm install @penpot-export/cli --save-dev

# yarn
yarn add @penpot-export/cli --dev
```

### 🔧 Configuration

`penpot-export` uses the Penpot public API of [a Penpot instance of your choice](https://help.penpot.app/user-guide/introduction/quickstart/). Before you can use `penpot-export`, you'll need a way to authenticate to that API. [Generate an access token](https://help.penpot.app/technical-guide/integration/#access-tokens) and save that value in a safe place.

You'll also need the file ID of an existing Penpot file in that Penpot instance. Open the Penpot file in your browser and copy the URL. Then run:

```sh
penpot-export inspect <YOUR FILE URL HERE>
```

It'll output something similar to this:

```
The following details are the result of inspecting the provided URL:
    Penpot instance: https://design.penpot.app/
    Workspace id: f542b13d-6fc1-8116-8002-fc0aaa3627ae
    File id: 52961d58-0a92-80c2-8003-2fc8ab8b34dd
    Page id: 38f1e350-296d-80f1-8002-fd390f93b03d
```

Grab the file ID and the Penpot instance.

With this, set up a `penpot-export.config.js` file at the root of your project declaring how your Penpot designs will be exported.

<details>
<summary> Example config file</summary>

`penpot-export.config.js`:
```js
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
      fileId: '4a499800-872e-80e1-8002-fc0b585dc061',
      colors: [
        {
          format: 'scss',
          output: 'src/styles/colors.css', // 👈 Path where your colors SCSS file should be generated.
        },
      ],
      typographies: [
        {
          format: 'json',
          output: 'src/styles/typographies.css', // 👈 Path where your typographies JSON file should be generated.
        },
      ],
    },
    {
      fileId: 'abea3ef6-4c19-808a-8003-01370d9cb586',
      pages: [
        {
          pageId: '71b1702b-2eb1-81d6-8002-f82a5f182088',
          format: 'css',
          output: 'src/styles/ui.css', // 👈 Path where your page components CSS file should be generated.
        },
      ],
    },
  ],
}

module.exports = config
```
</details>

<details>
<summary>Configuration schema</summary>

Config schema:

property | type | notes
-------- | ---- | -----
`instance` | (optional) string | Defaults to https://design.penpot.app
`accessToken` | string | The access token used to authenticate to the instance above
`files` | FileConfig object | A list of files to export, each with its own configuration

FileConfig schema:

property | type | notes
-------- | ---- | -----
`fileId` | string | The UUID of the file where assets will be exported
`colors` | (optional) ColorsConfig | A list of outputs for color assets
`typographies` | (optional) TypographiesConfig | A list of outputs for typography assets
`pages` | (optional) PagesConfig | A list of outputs for page components

AssetConfig (ColorsConfig, TypographiesConfig, PagesConfig) schema:

property | type | notes
-------- | ---- | -----
`output` | string | Relative route where your file should be generated
`format` | `css`|`scss`|`json` | Desired format to be generated
`fileId` | string (only for PagesConfig) | The UUID of the page from where components will be exported

</details>

### ▶️ Usage

Once you've set up the `penpot-export.config.js` file, simply run the following command to generate your CSS files:

```bash
penpot-export
```

This will read your Penpot design file and generate the declared files.


## ⌨️ Development

### Using Yarn Workspaces

This project is written in TypeScript and utilizes [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to manage multiple packages within a single repository. This allows us to house the source code of the `penpot-export` modules and demos in separate packages, streamlining development and testing.

> **Why Yarn Workspaces?**

> _Your dependencies can be linked together, which means that your workspaces can depend on one another while always using the most up-to-date code available._ - [Reference](https://classic.yarnpkg.com/lang/en/docs/workspaces/#toc-why-would-you-want-to-do-this)

### Local Development

For the "demos" package to utilize the local version of the `penpot-export` command you're developing, it's essential first to compile the TypeScript code from the `penpot-export` package.

### Handy Commands

To facilitate the development process, we've set up the following commands that can be run at the repository's root:

- **yarn dev**: Runs the CLI tool in development mode. Ideal for making changes and seeing real-time results.
- **yarn build**: Compiles the TypeScript code in production mode. Ensure you run this command before testing the tool in the `demos` package.
- **yarn demo**: Runs the `penpot-export` command within the `demos` package per demo. It's handy for quickly testing implementations after making changes to the source code.

We recommend following this workflow: make changes to the code, run `yarn build`, and then `yarn demo` to test your changes.
