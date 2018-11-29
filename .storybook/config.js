import {
  configure,
} from '@storybook/react';

/*
 * Ideally we would use `paths.src` and `dirs.stories` from `webpack.config.base.babel`, but this
 * won’t transpile correctly without string literals.
 */
const requireContext = require.context(
  '../src',
  true,
  /\.(stories\.ts|stories\.tsx)$/
);

function loadStories() {
  requireContext.keys().forEach(requireContext);
}

configure(loadStories, module);
