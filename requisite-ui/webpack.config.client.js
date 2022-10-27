require('dotenv').config();
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

webpackConfig.mode = 'development';
webpackConfig.devServer = {
    compress: true,
    port: process.env.PORT,
    host: '0.0.0.0',
    allowedHosts: 'all',
    historyApiFallback: true
};
webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(
    /HttpClientExtensions\.ts$/,
    require.resolve('./mock/HttpClientExtensionsMock.ts')
));
webpackConfig.plugins.push(new webpack.NormalModuleReplacementPlugin(
    /MockAdapterExtensions/,
    function(resource) {
        resource.request = resource.request.replace('./', '../../mock/');
    }
));
module.exports = webpackConfig;
