import React from 'react';
import { onPreRenderHTML, onRenderBody } from '../gatsby-ssr';

jest.mock(
  `../.cache/GlobalStyleComponent`,
  () => {
    return {
      globalStyle: {
        ReactStyleComponent: () => <style />,
        elementId: 'GlobalStyle',
      },
    };
  },
  { virtual: true }
);

jest.mock(
  `../.cache/GlobalStylePropsTheme`,
  () => {
    return { typography: { fontFamily: 'Roboto' } };
  },
  { virtual: true }
);

jest.mock(
  `../.cache/GlobalStylePropsOther`,
  () => {
    return { light: true };
  },
  { virtual: true }
);

// Clone and merge array of multiple arrays into one flat array (flattens array)
const clone = arr => [...arr];

describe(`onRenderBody`, () => {
  const setup = (options = {}, env = `build-html`) => {
    process.env.BUILD_STAGE = env;
    const api = {
      setHeadComponents: jest.fn(),
    };
    onRenderBody(api, options);
    return api;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    delete process.env.BUILD_STAGE;
  });

  it(`invokes setHeadComponents with array containing GlobalStyleComponent`, () => {
    const api = setup();

    expect(api.setHeadComponents).toHaveBeenCalledWith([
      expect.objectContaining({ key: expect.stringContaining('GlobalStyle') }),
    ]);
  });

  it(`only invokes setHeadComponents if BUILD_STAGE is build-html`, () => {
    const api = setup({}, `develop`);

    expect(api.setHeadComponents).not.toHaveBeenCalled();
  });
});

describe(`onPreRenderHTML`, () => {
  const setup = (components = []) => {
    const api = {
      getHeadComponents: jest.fn(() => components),
      replaceHeadComponents: jest.fn(),
    };
    onPreRenderHTML(api);
    return api;
  };

  it(`reorders GlobalStyle first`, () => {
    const spies = setup([
      {
        key: `link-1234`,
      },
      {
        key: `link-preload`,
      },
      {
        key: `GlobalStyle`,
      },
    ]);

    expect(spies.replaceHeadComponents).toHaveBeenCalledTimes(1);
    expect(spies.replaceHeadComponents).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          key: `GlobalStyle`,
        },
      ])
    );
  });

  it(`leaves non-GlobalStyle head components as-is`, () => {
    const components = [
      {
        key: `link-1234`,
      },
      {
        key: `link-preload`,
      },
      {
        key: `_____01234_____`,
      },
    ];

    const spies = setup(clone(components));

    // Check that it did not reorder when GlobalStyle was not in list
    // Component list Clone which we ran reorder on, should be identical to original component list
    expect(spies.replaceHeadComponents).toHaveBeenCalledWith(components);
  });

  it(`does not fail when head components include null`, () => {
    const components = [
      {
        key: `link-1234`,
      },
      {
        key: `link-preload`,
      },
      {
        key: `_____01234_____`,
      },
      null,
    ];

    const spies = setup(clone(components));

    expect(spies.replaceHeadComponents).toHaveBeenCalledWith(components);
    expect(spies.replaceHeadComponents).toHaveReturned();
  });
});

/*
describe(`onRenderBody`, () => {

  it(`injects theme if theme is passed`);
  it(`uses default theme if no theme is passed.`);
  it(`injects other props if any are passed`);
});
*/
