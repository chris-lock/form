import autoPrefixer from 'autoprefixer';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import packageJson from './package.json';

export class Dir {
  static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  constructor(...extensions) {
    this.resolve = extensions.map((extensions) => `.${extensions}`);
    this.test = RegExp(`\\.(${extensions.map(Dir.escapeRegExp).join('|')})$`);
  }
}

export const paths = {
  dist: path.join(__dirname, 'dist'),
  node: path.join(__dirname, 'node_modules'),
  src: path.join(__dirname, 'src'),
};

export const dirs = {
  css: new Dir('less'),
  js: new Dir('js', 'jsx'),
  ts: new Dir('ts', 'tsx'),
};

export function loader(loader, options) {
  return {
    loader,
    options,
  };
}

export function outputFileFormat(extension) {
  return `[name].[hash].${extension}`;
}

export default {
  devtool: 'sourcemap',
  entry: path.join(paths.src, 'index.ts'),
  module: {
    rules: [
      {
        exclude: paths.node,
        test: dirs.ts.test,
        use: [
          loader('ts-loader'),
        ],
      },
      {
        exclude: paths.node,
        test: dirs.css.test,
        use: [
          loader('style-loader'),
          loader('css-loader', {
            camelCase: true,
            importLoaders: 2,
            localIdentName: '[folder]__[name]__[local]__[hash:base64:5]',
            modules: true,
          }),
          loader('postcss-loader', {
            ident: 'postcss',
            plugins: [
              autoPrefixer,
            ],
          }),
          loader('less-loader'),
        ],
      },
    ],
  },
  output: {
    chunkFilename: outputFileFormat('js'),
    filename: outputFileFormat('js'),
    library: packageJson.name,
    libraryTarget: 'umd',
    path: paths.dist,
    sourceMapFilename: outputFileFormat('map'),
  },
  plugins: [
    new CleanWebpackPlugin(paths.dist),
    new ForkTsCheckerWebpackPlugin({
      formatter: 'codeframe',
      workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
    }),
  ],
  resolve: {
    modules: [
      paths.node,
      paths.src,
    ],
    extensions: [
      ...dirs.js.resolve,
      ...dirs.ts.resolve,
    ],
  },
};
