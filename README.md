# penpot-css-export

## Description

`penpot-css-export` is an npm tool designed to export your design components created in Penpot directly to CSS files. With a simple `pce` command, you can convert your designs into ready-to-use CSS classes.

## Installation

To install `penpot-css-export`, simply run:

```bash
# npm
npm install penpot-css-export --save-dev

# yarn
yarn add penpot-css-export
```

## Configuration

Before you can use `penpot-css-export`, you need to set up a [`penpot-css-export.config.js`](./packages/demo/penpot-css-export.config.js) file at the root of your project. This file defines how your Penpot designs will be exported.

Configuration example:

```js
require('dotenv').config()

/**
 * @type {import('penpot-css-export').Config}
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
```

## Usage

Once you've set up the `penpot-css-export.config.js` file, simply run the following command to generate your CSS files:

```bash
pce
```

This will read your Penpot designs and generate CSS files in the directory specified in your configuration file.

Based in the example a css file like this will be generated:

```css
.variables--body {
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  direction: ltr;
  font-family: 'Source Code Pro';
}

.variables--h5 {
  font-style: normal;
  font-size: 18px;
  font-weight: 800;
  direction: ltr;
  font-family: 'Source Code Pro';
}

.variables--h4 {
  font-style: normal;
  font-size: 24px;
  font-weight: 800;
  direction: ltr;
  font-family: 'Source Code Pro';
}

.variables--h3 {
  font-style: normal;
  font-size: 36px;
  font-weight: 800;
  direction: ltr;
  font-family: 'Source Code Pro';
}

.variables--h2 {
  font-style: normal;
  font-size: 48px;
  font-weight: 800;
  direction: ltr;
  font-family: 'Source Code Pro';
}

.variables--h1 {
  font-style: normal;
  font-size: 72px;
  font-weight: 900;
  direction: ltr;
  font-family: 'Source Code Pro';
}
```

## Development

### Using Yarn Workspaces

This project utilizes Yarn Workspaces to manage multiple packages within a single repository. This allows us to house the module's source code and a demo in separate packages, streamlining development and testing.

### Package Structure

- [**packages/penpot-css-export**](./packages/penpot-css-export/): This package contains the CLI tool written in TypeScript. This is where the primary tool code resides.
- [**packages/demo**](./packages/demo/): This package serves as a demonstration environment. You can run the `pce` command within this package to test out implementations in development.

### Local Development

For the "demo" package to utilize the local version of the `pce` command you're developing, it's essential first to compile the TypeScript code from the "penpot-css-export" package.

### Handy Commands

To facilitate the development process, we've set up the following commands that can be run at the repository's root:

- **yarn dev**: Runs the CLI tool in development mode. Ideal for making changes and seeing real-time results.
- **yarn build**: Compiles the TypeScript code in production mode. Ensure you run this command before testing the tool in the "demo" package.
- **yarn demo**: Runs the `pce` command within the "demo" package. It's handy for quickly testing implementations after making changes to the source code.

We recommend following this workflow: make changes to the code, run `yarn build`, and then `yarn demo` to test your changes.
