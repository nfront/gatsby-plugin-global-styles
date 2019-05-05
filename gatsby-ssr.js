"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onPreRenderHTML = exports.onRenderBody = void 0;

var _react = _interopRequireDefault(require("react"));

var _GlobalStyleComponent = _interopRequireDefault(require("./.cache/GlobalStyleComponent"));

var _GlobalStylePropsTheme = _interopRequireDefault(require("./.cache/GlobalStylePropsTheme"));

var _GlobalStylePropsOther = _interopRequireDefault(require("./.cache/GlobalStylePropsOther"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const onRenderBody = ({
  setHeadComponents
}) => {
  if (process.env.BUILD_STAGE === `build-html`) {
    const {
      ReactStyleComponent
    } = _GlobalStyleComponent.default.globalStyle;
    setHeadComponents([_react.default.createElement(ReactStyleComponent, _extends({
      key: _GlobalStyleComponent.default.globalStyle.elementId,
      theme: _GlobalStylePropsTheme.default
    }, _GlobalStylePropsOther.default))]);
  }
}; // Function to sort object in list to top of list.


exports.onRenderBody = onRenderBody;

function promote(toTop, array) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].key === toTop) {
      const a = array.splice(i, 1); // removes the item

      array.unshift(a[0]); // adds it back to the beginning

      break;
    }
  } // Matching item wasn't found.

} // Move GlobalStyleComponent styles to the top of the head section so they're loaded first
// and don't accidentally overwrite other styles.


const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents
}) => {
  const headComponents = getHeadComponents();
  promote(_GlobalStyleComponent.default.globalStyle.elementId, headComponents);
  replaceHeadComponents(headComponents);
};

exports.onPreRenderHTML = onPreRenderHTML;