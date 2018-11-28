import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import baseConfig, {
  paths,
} from './webpack.config.base.babel';

export default {
  ...baseConfig,
  devServer: {
    compress: true,
    contentBase: paths.build,
    historyApiFallback: true,
    open: true,
    port: 3000,
    progress: true,
    watchContentBase: true,
  },
  mode: 'development',
  plugins: [
    ...baseConfig.plugins,
    new HtmlWebpackPlugin({
      title: baseConfig.output.library,
    }),
    new webpack.SourceMapDevToolPlugin(),
  ],
};
