import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import baseConfig, {
  dirs,
  outputFileFormat,
} from './webpack.config.base.babel';

function updateCssRule(cssRule) {
  cssRule.use = cssRule.use.map((loader) => {
    if (loader.loader === 'style-loader') {
      return MiniCssExtractPlugin.loader;
    }

    return loader;
  });
}

function updateRules(rule) {
  if (rule.test === dirs.css.test) {
    updateCssRule(rule);
  }

  return rule;
}

export default {
  ...baseConfig,
  mode: 'production',
  module: {
    ...baseConfig.module,
    rules: baseConfig.module.rules.map(updateRules),
  },
  plugins: [
    ...baseConfig.plugins,
    new MiniCssExtractPlugin({
      chunkFilename: outputFileFormat('css'),
      filename: outputFileFormat('css'),
    }),
  ]
};
