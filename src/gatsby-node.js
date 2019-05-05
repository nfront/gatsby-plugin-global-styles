import fs from 'fs';
import path from 'path';
import os from 'os';

// Write out the GlobalStyleComponent module to .cache.
// Happens before webpack starts compiling page.
// .cache is available when gatsby-browser.js and gatsby-ssr.js runs.

// eslint-disable-next-line import/prefer-default-export
export const onPreBootstrap = ({ store }, pluginOptions) => {
  const { program } = store.getState();

  const fixPath = module => {
    let newModule = module;
    if (os.platform() === `win32`) {
      newModule = module.split(`\\`).join(`\\\\`);
    }
    return newModule;
  };

  let module;
  if (pluginOptions.pathToConfigModule) {
    module = `import GlobalStyleComponent from "${
      path.isAbsolute(pluginOptions.pathToConfigModule)
        ? pluginOptions.pathToConfigModule
        : path.join(program.directory, pluginOptions.pathToConfigModule)
    }";
export default GlobalStyleComponent;
`;

    module = fixPath(module);
  } else {
    module = `import { createGlobalStyle } from '@nfront/global-styles';
const GlobalStyleComponent = createGlobalStyle\`\`;
export default GlobalStyleComponent;
`;
  }

  const dir = `${__dirname}/.cache`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(`${dir}/GlobalStyleComponent.js`, module);

  // Write Props.theme to cache.
  if (pluginOptions.props.theme) {
    module = `import theme from "${
      path.isAbsolute(pluginOptions.props.theme)
        ? pluginOptions.props.theme
        : path.join(program.directory, pluginOptions.props.theme)
    }";
export default theme;
`;

    module = fixPath(module);
  } else {
    module = `const defaultTheme = { typography: { fontFamily: 'Arial' } };
export default defaultTheme;
`;
  }

  fs.writeFileSync(`${dir}/GlobalStylePropsTheme.js`, module);

  // Write Props.other to cache.
  if (pluginOptions.props.other) {
    module = `const otherProps = ${JSON.stringify(pluginOptions.props.other)};
export default otherProps;
`;
  } else {
    module = `const emptyOtherProps = {};
export default emptyOtherProps;
`;
  }

  fs.writeFileSync(`${dir}/GlobalStylePropsOther.js`, module);
};
