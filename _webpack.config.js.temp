const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "production",
    devtool: 'source-map',
    entry: './src/lib/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        library: 'TSVWidget',
        libraryTarget: 'umd',
        clean: true
    },
    devServer: {
        static: path.resolve(__dirname, 'build'),
        open: true,
        hot: true,
        host: "localhost",
        port: 8080
    },
    performance: {
        maxEntrypointSize: 2048000,
        maxAssetSize: 2048000
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({extractComments: false}),
            new CssMinimizerPlugin()
        ]
    },
    resolve: {
        extensions: ['.wasm', '.tsx', '.ts', '.js', '.json', '...']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /(node_modules|example)/,
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: ['to-string-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new NodePolyfillPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/index.css'
        }),
        new HTMLWebpackPlugin({
            template: path.resolve('./index.html')
        })
    ]
};
