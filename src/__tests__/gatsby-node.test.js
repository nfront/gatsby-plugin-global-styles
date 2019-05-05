import path from 'path';
import rimraf from 'rimraf';
import os from 'os';
import * as gatsbyNode from '../gatsby-node';

const onPreBootstrapMock = jest.spyOn(gatsbyNode, 'onPreBootstrap');

const rootDir = path.join(__dirname, '../..');
const store = { store: { getState: () => ({ program: { directory: rootDir } }) } };

jest.mock('os', () => {
  return {
    platform: jest.fn(() => 'win32'),
  };
});

let options;
let emptyOptions;

describe('gatsby-node.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    options = {
      pathToConfigModule: `src/styles/GlobalStyleComponent`,
      props: {
        theme: `src/styles/theme`,
        other: {
          light: true,
        },
      },
    };

    emptyOptions = {
      pathToConfigModule: ``,
      props: {},
    };
  });

  afterAll(done => {
    rimraf(path.join(rootDir, `/src/.cache`), () => {
      done();
    });
  });

  it('Can create cache when none exist', done => {
    const dir = path.join(rootDir, `/src/.cache`);
    rimraf(dir, () => {
      onPreBootstrapMock(store, emptyOptions);
      expect(onPreBootstrapMock).toHaveBeenCalledWith(store, emptyOptions);
      done();
    });
  });

  it('can create cache when options are passed in', () => {
    onPreBootstrapMock(store, options);
    expect(onPreBootstrapMock).toHaveBeenCalledWith(store, options);
  });

  it('options can use absolute paths', () => {
    const configDir = path.join(rootDir, `src/styles/GlobalStyleComponent`);
    const themeDir = path.join(rootDir, `src/styles/theme`);
    options.pathToConfigModule = configDir;
    options.props.theme = themeDir;
    onPreBootstrapMock(store, options);
    expect(onPreBootstrapMock).toHaveBeenCalledWith(store, options);
  });

  it('can run on different platforms', () => {
    os.platform.mockReturnValue('linux');
    onPreBootstrapMock(store, options);
    expect(onPreBootstrapMock).toHaveBeenCalledWith(store, options);
  });

  it('can create cache when no options are passed in', () => {
    onPreBootstrapMock(store, emptyOptions);
    expect(onPreBootstrapMock).toHaveBeenCalledWith(store, emptyOptions);
  });
});
