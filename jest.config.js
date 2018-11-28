module.exports = {
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
  ],
  testRegex: '__tests__.*\\.tsx?$',
  transform: {
    '^.+tsx?$': 'ts-jest',
  },
  verbose: false,
};


Easy to implement
Require little boilerplate when setting up
Configurable
Ideally / eventually editable in a UI
Easy to extend
Add steps
Reorder steps
Refactor
Navigable with browser back and next
Shouldn’t interfere with any existing router
Can handle a logic tree
If answer A, show step 2A. If answer B, show step 2B.
Able to save progress
DRY
