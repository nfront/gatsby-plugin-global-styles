"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onPreBootstrap = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Write out the GlobalStyleComponent module to .cache.
// Happens before webpack starts compiling page.
// .cache is available when gatsby-browser.js and gatsby-ssr.js runs.
// eslint-disable-next-line import/prefer-default-export
const onPreBootstrap = ({
  store
}, pluginOptions) => {
  const {
    program
  } = store.getState();
  let module;

  if (pluginOptions.pathToConfigModule) {
    module = `import GlobalStyleComponent from "${_path.default.isAbsolute(pluginOptions.pathToConfigModule) ? pluginOptions.pathToConfigModule : _path.default.join(program.directory, pluginOptions.pathToConfigModule)}";
export default GlobalStyleComponent;
`;

    if (_os.default.platform() === `win32`) {
      module = module.split(`\\`).join(`\\\\`);
    }
  } else {
    module = `import createGlobalStyle from 'gatsby-plugin-global-styles';
const GlobalStyleComponent = createGlobalStyle\`\`;
export default GlobalStyleComponent;
`;
  }

  const dir = `${__dirname}/.cache`;

  if (!_fs.default.existsSync(dir)) {
    _fs.default.mkdirSync(dir);
  }

  _fs.default.writeFileSync(`${dir}/GlobalStyleComponent.js`, module); // Write Props.theme to cache.


  if (pluginOptions.props.theme) {
    module = `import theme from "${_path.default.isAbsolute(pluginOptions.props.theme) ? pluginOptions.props.theme : _path.default.join(program.directory, pluginOptions.props.theme)}";
export default theme;
`;

    if (_os.default.platform() === `win32`) {
      module = module.split(`\\`).join(`\\\\`);
    }
  } else {
    module = `const defaultTheme = { typography: { fontFamily: 'Arial' } };
export default defaultTheme;
`;
  }

  _fs.default.writeFileSync(`${dir}/GlobalStylePropsTheme.js`, module); // Write Props.other to cache.


  if (pluginOptions.props.other) {
    module = `const otherProps = ${JSON.stringify(pluginOptions.props.other)};
export default otherProps;
`;
  } else {
    module = `const emptyOtherProps = {};
export default emptyOtherProps;
`;
  }

  _fs.default.writeFileSync(`${dir}/GlobalStylePropsOther.js`, module);
};

exports.onPreBootstrap = onPreBootstrap;