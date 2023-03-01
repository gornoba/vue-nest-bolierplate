const path = require('path');

module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'title',
    },
  },
  outputDir: path.join(__dirname, '..', './backend/front'),
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src/'));
  },
  css: {
    extract: {
      filename: `${'filname' + '-'}${require('./package.json').version}.min.css`,
    },
  },
  configureWebpack: {
    output: {
      filename: `${'filname' + '-'}${require('./package.json').version}.min.js`,
    },
    optimization: {
      splitChunks: false,
    },
  },
};
