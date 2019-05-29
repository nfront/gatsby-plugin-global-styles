[![Build Status](https://travis-ci.com/nfront/gatsby-plugin-global-styles.svg?branch=master)](https://travis-ci.com/nfront/gatsby-plugin-global-styles) [![Greenkeeper badge](https://badges.greenkeeper.io/nfront/gatsby-plugin-global-styles.svg)](https://greenkeeper.io/) [![Maintainability](https://api.codeclimate.com/v1/badges/e0d0c8874fbb4e304b03/maintainability)](https://codeclimate.com/github/nfront/gatsby-plugin-global-styles/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/e0d0c8874fbb4e304b03/test_coverage)](https://codeclimate.com/github/nfront/gatsby-plugin-global-styles/test_coverage) [![npm bundle size](https://badgen.net/bundlephobia/min/gatsby-plugin-global-styles)](https://bundlephobia.com/result?p=gatsby-plugin-global-styles) [![npm](https://img.shields.io/npm/v/gatsby-plugin-global-styles.svg)](https://www.npmjs.com/package/gatsby-plugin-global-styles)

[![Twitter URL](https://img.shields.io/twitter/url/https/github.com/nfront/gatsby-plugin-global-styles.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20this%20npm%20package:&url=https%3A%2F%2Fgithub.com%2Fnfront%2Fgatsby-plugin-global-styles) [![Twitter Follow](https://img.shields.io/twitter/follow/magnusriga.svg?label=Follow&style=social)](https://twitter.com/intent/follow?screen_name=magnusriga)

# gatsby-plugin-global-styles

A Gatsby plugin for creating independent global CSS styles, and automatically placing them at the top of the `<head>` element.

The plugin does not rely on any third party packages (except React), however the core [`global-styles`](https://github.com/nfront/global-styles) modules have been split out to a separate package to keep it flexible and lean.

## Install

`npm install --save gatsby-plugin-global-styles @nfront/global-styles`

or:

`yarn add gatsby-plugin-global-styles @nfront/global-styles`

## Why to use

`gatsby-plugin-global-styles` automatically combines your own global style sheets into one collective global `style` tag, and makes sure the global `style` tag ends up where you want it to be in the `<head>` element.

By default, the global `style` tag is placed at the top of `<head>`.

This package is particularly useful when utilizing several CSS styling systems.

For example, your site might be using `styled-components` and `Material-UI`. If you want to add your own **global** styling to this mix, it is important that the order of the `style` tags in the website's or app's `<head>` element is correct (properties in lower `style` tags overwrite the same properties in `style` tags above it).

By using `gatsby-plugin-global-styles` and specifying the path to your `GlobalStyleComponent.js` file via the `pathToConfigModule` option (see below), the compilation and injection of your global styles is taken care of automatically by helper methods under the hood.

Lastly, it is also possible to pass in props, like a theme, to your global style sheet. See below for instructions.

## How to use

In `gatsby-config.js`:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-global-styles`,
      options: {
        pathToConfigModule: `src/styles/GlobalStyleComponent`,
        props: {
          theme: `src/styles/theme`,
          other: {
            light: true
          }
        }
      },
    },
  ],
}
```

In `src/utils/GlobalStyleComponent`:

```javascript
import { createGlobalStyle } from '@nfront/global-styles';
import reset from '../styles/reset';
import globalStyle from '../styles/globalStyle';

const GlobalStyleComponent = createGlobalStyle`
  ${reset}
  ${globalStyle}
`;

export default GlobalStyleComponent;
```

Here, `reset` and `globalStyle` are two JavaScript files that each contain their own global styles that we want to compile into one global style element.

You can include just one file here, if you like. Alternatively, several files can be specified if you have several global style sheets you want to compile into one `style` tag.

As an example, in `src/styles/globalStyle`:

```javascript
import { css } from '@nfront/global-styles';

const globalStyles = css`
  .my-class2 {
    margin-bottom: 10rem;
  }

  html {
    background-color: blue;
  }
`;

export default globalStyles;
```

## Options

- `pathToConfigModule`: (string) The path to the file in which you export your global style component.
- `props.theme`: (string) The path to the theme that can be used in any of your global style sheet files. See below for format
- `props.other`: Other props you want to pass to the global styles. For example: light / dark

## How to use props (like theme) in a global style file

To use `props`, like a theme, in a global style, specify `props.theme` and `props.other` in `gatsby-config.js`, as shown above.

A theme can be any module exporting a normal object. Its propertis are then accessible inside any global styles file:

In `./src/styles/theme`:

```javascript
const theme = {
  fontFamily: [`"Roboto", "Helvetica", "Arial", "sans-serif"`].join(','),
  primaryColor: blue;
}

export default theme;
```

Or a `MUI theme` in `./src/styles/theme`:

```javascript
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';

const muiTheme = createMuiTheme({
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  palette: {
    primary: blue,
    secondary: orange,
    error: red,
    type: 'light',
    text: {
      primary: 'rgba(0, 0, 0, 0.8)',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: [`"Roboto", "Helvetica", "Arial", "sans-serif"`].join(','),
    h1: {
      fontSize: '2.25rem',
      fontFamily: [`"Roboto-Slab", "Roboto", "Helvetica", "Arial", sans-serif"`].join(','),
      color: 'rgba(0, 0, 0, 0.8)',
      lineHeight: 1.1,
      letterSpacing: 'normal',
    },
  },
});

export default muiTheme;
```

In `src/styles/globalStyle`:

```javascript
import { css } from '@nfront/global-styles';

const globalStyles = css`
  body {
    color: ${props => (props.light ? 'white' : 'black')};
    font-family: ${props => props.theme.typography.fontFamily};
  }
`;

export default globalStyles;
```

## How to reorder the style tag in the head element

If you are using the `typography.js` plugin and want your global `style` tag above the `typography.js` tag, just import this plugin **below** the `typography.js` plugin in `gatsby-config.js`.

The opposite can be achieved by reversing the order.

To manually control the order, sort the head tags as desired in `gatsby-ssr.js`:

```javascript
import GlobalStyleComponent from './src/styles/GlobalStyleComponent';

function promote(toTop, array) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] && array[i].key === toTop) {
      const a = array.splice(i, 1);
      array.unshift(a[0]);
      break;
    }
  }
}

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents();
  promote(GlobalStyleComponent.globalStyle.elementId, headComponents);
  promote('TypographyStyle', headComponents);

  replaceHeadComponents(headComponents);
};
```

## Full example

A full example, including `gatsby-plugin-global-styles`, `typography.js`, `Material-UI` and `styled-components` can be found in the starter: `gatsby-starter-global-styles`.

## Syntax highlighting

It is easy to add syntax highlighting. See the [styled-components docs](https://www.styled-components.com/docs/tooling#syntax-highlighting) for extensions that enable this in various IDEs.

For `Visual Studio Code`, the [Babel JavaScript](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel) plugin is one option that works well.