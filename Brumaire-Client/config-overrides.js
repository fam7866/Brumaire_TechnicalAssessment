// const { override, , addWebpackModuleRule, addBabelPlugin } = require('customize-cra');
const { override,addDecoratorsLegacy, addBabelPlugin, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  // Add Babel plugin for nullish coalescing
  addBabelPlugin('@babel/plugin-proposal-nullish-coalescing-operator'),
  addDecoratorsLegacy(),
  // Add Webpack module rule to handle .mjs files
  addWebpackModuleRule({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
    use: [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-nullish-coalescing-operator']
      }
    }]
  })
);

