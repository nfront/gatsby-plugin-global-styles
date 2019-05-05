import React from 'react';
import GlobalStyleComponent from './.cache/GlobalStyleComponent';
import GlobalStylePropsTheme from './.cache/GlobalStylePropsTheme';
import GlobalStylePropsOther from './.cache/GlobalStylePropsOther';

export const onRenderBody = ({ setHeadComponents }) => {
  if (process.env.BUILD_STAGE === `build-html`) {
    const { ReactStyleComponent } = GlobalStyleComponent.globalStyle;
    setHeadComponents([
      <ReactStyleComponent
        key={GlobalStyleComponent.globalStyle.elementId}
        theme={GlobalStylePropsTheme}
        {...GlobalStylePropsOther}
      />,
    ]);
  }
};

// Function to sort object in list to top of list.
function promote(toTop, array) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] && array[i].key === toTop) {
      const a = array.splice(i, 1); // removes the item
      array.unshift(a[0]); // adds it back to the beginning
      break;
    }
  }
  // Matching item wasn't found.
}

// Move GlobalStyleComponent styles to the top of the head section so they're loaded first
// and don't accidentally overwrite other styles.
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents();
  promote(GlobalStyleComponent.globalStyle.elementId, headComponents);
  replaceHeadComponents(headComponents);
};
