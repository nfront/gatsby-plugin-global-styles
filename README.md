# gatsby-plugin-global-styles

A Gatsby plugin for creating independent global CSS styles, and automatically placing them at the top of the `<head>` element.

The plugin does not rely on any other third party packages, however the `global-styles` helper modules have been split out to a separate package to keep it flexible and lean.

## Install

`npm install --save gatsby-plugin-global-styles global-styles`

## Why to use

It might be desirable to use more than one styling method for your Gatsby site.

`gatsby-plugin-global-styles` automatically combines your own global style sheets into one collective global style tag, and make sure that global style tag ends up where you want it to be in the `<head>` element.

By default, the global style tag created with this plugin end up at the top of `<head>`.To place it before / after `typography.js`, import it in `gatsby-config.js` after / before `typography.js`.

The plugin is particularly useful when utilizing several styling systems.

For example, your site might be using `styled-components`, `typography.js` and `Material-UI`. If you want to add your own **global** styling to this mix, it is important that the order of the `style` tags in the website's `<head>` element is correct (properties in lower `style` tags overwrite the same properties in `style` tags above it).

As inspiration, a global style could for instance include your own personal global style sheet and a style sheet such as `normalize`.

By using `gatsby-plugin-global-styles` and specifying the path to your `GlobalStyleComponent.js` file via the `pathToConfigModule` option (see below), the compilation and injection of your global styles is taken care of automatically by helper methods under the hood.

Lastly, it is also possible to pass in props, like a theme, to your global styles. See below for instructions.

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
import { createGlobalStyle } from 'gatsby-plugin-global-styles';
import reset from '../styles/reset';
import globalStyle from '../styles/globalStyle';

const GlobalStyleComponent = createGlobalStyle`
  ${reset}
  ${globalStyle}
`;

export default GlobalStyleComponent;
```

Here, `reset` and `globalStyle` are two JavaScript files that each contain their own global styles that we want to compile into one global style element.

As an example, in `src/styles/globalStyle`:

```javascript
import { css } from 'gatsby-plugin-global-styles';

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

To use `props`, like a theme, in a global style, specify `props.theme` and `props.other`, as shown above.

A theme can be any module exporting a normal object. Its propertis are then accessible inside any global styles file:

In './src/styles/theme':

```javascript
const theme = {
  fontFamily: [`"Roboto", "Helvetica", "Arial", "sans-serif"`].join(','),
  primaryColor: blue;
}

export default theme;
```

Or a `MUI theme` in './src/styles/theme':

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
import { css } from 'gatsby-plugin-global-styles';

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
    if (array[i].key === toTop) {
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