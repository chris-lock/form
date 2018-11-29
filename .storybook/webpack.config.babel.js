import webpack from 'webpack';
import baseConfig from '../webpack.config.base.babel';
import {
  dirs,
} from '../webpack.config.base.babel';

export default (storybookBaseConfig, env, storybookConfig) => {
  storybookConfig.module.rules.push(
    ...baseConfig.module.rules
  );
  storybookConfig.plugins.push(
    ...baseConfig.plugins,
    new webpack.SourceMapDevToolPlugin()
  );
  storybookConfig.resolve.extensions.push(
    ...dirs.ts.resolve
  );

  return storybookConfig;
};
