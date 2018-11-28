module.exports = {
  '*.ts{,x}': [
    'npm run tslint:format',
    'git add',
  ],
};
