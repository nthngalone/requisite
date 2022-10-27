const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'production',
    entry: { 'requisite-ui': './src/main.ts' },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [/*{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread']
                }
            }
        }, */{
            test: /\.vue$/,
            exclude: /node_modules/,
            use: [{ loader: 'vue-loader' }]
        }, {
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'ts-loader',
            options: {
                appendTsSuffixTo: [/\.vue$/]
            }
        }, {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ]
        }, {
            test: /.(gif|png|jp(e*)g)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8000, // convert images < 8kb to base64 strings
                    name: 'images/[name].[ext]'
                }
            }]
        }, {
            test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            use: [{
                loader: 'file-loader',
                options: { name: '[name].[ext]' }
            }]
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            chunks: ['requisite-ui']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.LoaderOptionsPlugin({ options: { postcss: () => [autoprefixer] } }),
        new webpack.EnvironmentPlugin({
            'BASE_URL': '/'
        })
    ],
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};
