# penpot-export

## Description

`penpot-export` is an npm tool designed to export your design components created in Penpot directly to CSS files. With a simple `pce` command, you can convert your designs into ready-to-use CSS classes.

## Installation

To install `penpot-export`, simply run:

```bash
# npm
npm install penpot-export --save-dev

# yarn
yarn add penpot-export
```

## Configuration

Before you can use `penpot-export`, you need to set up a [`penpot-export.config.js`](./packages/demo/penpot-export.config.js) file at the root of your project. This file defines how your Penpot designs will be exported.

Configuration example:

```js
require('dotenv').config()

/**
 * @type {import('penpot-export').UserConfig}
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
```

## Usage

Once you've set up the `penpot-export.config.js` file, simply run the following command to generate your CSS files:

```bash
pce
```

This will read your Penpot designs and generate CSS files in the places specified in your configuration file.

## Development

### Using Yarn Workspaces

This project utilizes [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to manage multiple packages within a single repository. This allows us to house the module's source code and a demo in separate packages, streamlining development and testing.

> **Why Yarn Workspaces?**

> _Your dependencies can be linked together, which means that your workspaces can depend on one another while always using the most up-to-date code available._ - [Reference](https://classic.yarnpkg.com/lang/en/docs/workspaces/#toc-why-would-you-want-to-do-this)

### Package Structure

- [**packages/penpot-export**](./packages/penpot-export/): This package contains the CLI tool written in TypeScript. This is where the primary tool code resides.
- [**packages/demo**](./packages/demo/): This package serves as a demonstration environment. You can run the `pce` command within this package to test out implementations in development.

### Local Development

For the "demo" package to utilize the local version of the `pce` command you're developing, it's essential first to compile the TypeScript code from the "penpot-export" package.

### Handy Commands

To facilitate the development process, we've set up the following commands that can be run at the repository's root:

- **yarn dev**: Runs the CLI tool in development mode. Ideal for making changes and seeing real-time results.
- **yarn build**: Compiles the TypeScript code in production mode. Ensure you run this command before testing the tool in the "demo" package.
- **yarn demo**: Runs the `pce` command within the "demo" package. It's handy for quickly testing implementations after making changes to the source code.

We recommend following this workflow: make changes to the code, run `yarn build`, and then `yarn demo` to test your changes.
