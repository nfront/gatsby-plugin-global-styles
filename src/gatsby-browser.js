// Hot reload gatsby-plugin-global-styles in development

import GlobalStyleComponent from './.cache/GlobalStyleComponent';
import GlobalStylePropsTheme from './.cache/GlobalStylePropsTheme';
import GlobalStylePropsOther from './.cache/GlobalStylePropsOther';

// eslint-disable-next-line import/prefer-default-export
export const onClientEntry = () => {
  if (process.env.BUILD_STAGE === `develop`) {
    GlobalStyleComponent.globalStyle.renderStyles({
      theme: GlobalStylePropsTheme,
      ...GlobalStylePropsOther,
    });
  }
};
