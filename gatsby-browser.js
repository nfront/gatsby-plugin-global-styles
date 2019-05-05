"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onClientEntry = void 0;

var _GlobalStyleComponent = _interopRequireDefault(require("./.cache/GlobalStyleComponent"));

var _GlobalStylePropsTheme = _interopRequireDefault(require("./.cache/GlobalStylePropsTheme"));

var _GlobalStylePropsOther = _interopRequireDefault(require("./.cache/GlobalStylePropsOther"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Hot reload gatsby-plugin-global-styles in development
// eslint-disable-next-line import/prefer-default-export
const onClientEntry = () => {
  if (process.env.BUILD_STAGE === `develop`) {
    _GlobalStyleComponent.default.globalStyle.renderStyles({
      theme: _GlobalStylePropsTheme.default,
      ..._GlobalStylePropsOther.default
    });
  }
};

exports.onClientEntry = onClientEntry;