// const path = require('path');
//
// module.exports = {
//     entry: './src/index.js',
//     output: {
//         filename: 'custom-select.js',
//         path: path.resolve(__dirname, 'dist'),
//         publicPath: '/',
//         library: 'CustomSelect',
//         libraryTarget: 'umd',
//         clean: true
//     },
//     module: {
//         rules: [
//             { test: /\.css$/i, use: ['style-loader', 'css-loader'] }
//         ]
//     },
//     devServer: {
//         // static: path.join(__dirname, 'public'),
//         static: [
//             {
//                 directory: path.join(__dirname, 'public'),
//             },
//             {
//                 directory: path.join(__dirname, 'dist'),
//             },
//         ],
//         port: 3000,
//         open: true,
//         hot: true
//     },
//     devtool: 'source-map'
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env) => {
    const mode = env.mode;
    const isProd = env.mode === "production";

    return {
        mode,
        entry: './src/index.js',
        output: {
            filename: 'custom-select.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            // library: {
            //     name: 'CustomSelect',
            //     type: 'umd'
            // },
            // globalObject: 'this',
            library: 'CustomSelect',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this',
            clean: true
        },
        optimization: {
            minimize: isProd,
            minimizer: [
                `...`,
                new CssMinimizerPlugin(),
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'public', 'index.html'),
                inject: 'body'
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(woff2?|ttf|otf|eot)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }
                },
                { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, 'css-loader'] }
            ]
        },
        devServer: {
            port: 3000,
            open: true,
            hot: true
        },
        // devtool: 'source-map'
    }
};
