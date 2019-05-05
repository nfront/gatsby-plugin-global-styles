import { onClientEntry } from '../gatsby-browser';
import GSCMock from '../.cache/GlobalStyleComponent';
import themeMock from '../.cache/GlobalStylePropsTheme';
import otherMock from '../.cache/GlobalStylePropsOther';

jest.mock(
  `../.cache/GlobalStyleComponent`,
  () => {
    return {
      globalStyle: {
        renderStyles: jest.fn(),
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

describe(`onClientEntry`, () => {
  beforeEach(() => {
    process.env.BUILD_STAGE = `develop`;
  });

  afterAll(() => {
    delete process.env.BUILD_STAGE;
  });

  beforeEach(() => {
    // Completely restes mock back to initial value, including all information
    // stored in mockFn.mock.calls and mockFn.mock.instances arrays,
    // as well as any mocked return values or implementations.
    // Replaces mockFn.mock (not just mockFn.mock.calls and mockFn.mock.instances)
    jest.resetAllMocks();
  });

  it(`should inject CSS rules`, () => {
    // onClientEntry comes from a different copy of gatsby-browser,
    // compared to the other tests. This is due to jest.resetModules().
    onClientEntry();

    expect(GSCMock.globalStyle.renderStyles).toHaveBeenCalledWith(
      expect.objectContaining({ theme: themeMock, ...otherMock })
    );
  });

  it('should not run if BUILD_STAGE is not develop', () => {
    process.env.BUILD_STAGE = `build-html`;
    onClientEntry();
    expect(GSCMock.globalStyle.renderStyles).not.toHaveBeenCalled();
  });
});
