const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const base = require('./webpack.base');

const extractStylus = new ExtractTextPlugin({
    filename: "stylus.[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
const extractCss = new ExtractTextPlugin({
    filename: "css.[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
const moduleCss = new ExtractTextPlugin({
    allChunks: true,
    filename: "module.[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = function (env) {
    return merge.strategy({
        plugins: 'prepend',
    })(base(env), {
        devtool: '#source-map',
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'build.[hash].js',
        },
        module: {
            rules: [{
                    test: /\.styl$/,
                    use: extractStylus.extract({
                        use: [{
                                loader: "css-loader",
                                options: {
                                    minimize: true,
                                    sourceMap: true,
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true,
                                    plugins: () => [autoprefixer]
                                }
                            },
                            {
                                loader: "stylus-loader",
                                options: {
                                    outputStyle: 'expanded',
                                    sourceMap: true,
                                    sourceMapContents: true,
                                    paths: 'src/resource/'
                                }
                            }
                        ],
                    })
                },
                {
                    test: /\.css$/,
                    use: extractCss.extract({
                        use: [{
                            loader: "css-loader",
                            options: {
                                minimize: true,
                                sourceMap: true,
                            }
                        }],
                    }),
                    exclude: /\.m\.css$/
                },
                {
                    test: /\.m\.css$/,
                    use: moduleCss.extract({
                        use: [{
                            loader: "css-loader",
                            options: {
                                minimize: true,
                                sourceMap: true,
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
                            }
                        }],
                    })
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin([
                process.env.PLATFORM,
            ], {
                root: path.resolve(__dirname, '../'),
                verbose: false,
                watch: true
            }),
            extractStylus,
            extractCss,
            moduleCss,
            new CopyWebpackPlugin([ {
                from: path.resolve(__dirname, '../src/resource/images/favicon.ico'),
                to: './src/resource/images/favicon.ico'
            }]),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        ]
    })
}