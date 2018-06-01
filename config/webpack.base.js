const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin")


function resolve (dir) {
    return path.join(__dirname, '..', dir)
  }
module.exports = function (env) {
    return {
        entry: './src/main.js',
        resolve: {
            extensions: ['.js', '.styl', '.css', '.json'],
            alias: {
                'src': path.resolve(__dirname, '../src'),
                'vue$': 'vue/dist/vue.esm.js',
                '@views': 'src/views/',
                '@components': 'src/components/',
                '@router': 'src/router/',
                '@store': 'src/store/',
                '@directives': 'src/directives',
                '@utils': 'src/utils',
                '@server': 'src/server',
                '@filters': 'src/filters',
            }
        },
        module: {
            rules: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')] 
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                          css: ExtractTextPlugin.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
                          })
                        }
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: [path.resolve(__dirname, '../index.html')]
                },
                {
                    test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                    loader: 'url-loader?limit=8192&name=[path][name].[ext]'
                },
            ]
        },
        devtool: 'cheap-module-eval-source-map',
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, '../index.html'),
                chunksSortMode: 'dependency',
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    PLATFORM: JSON.stringify(process.env.PLATFORM),
                    NODE_ENV: JSON.stringify(env)
                }
            })
        ]
    }
}