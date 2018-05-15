var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: [
        './client/index'
    ],
    mode: "production",
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'client/index.html'},
            {from: 'client/index.js'}
        ], {
            ignore: [],
            copyUnmodified: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
            {
                test: /\.less/,
                loader: "style-loader!css-loader!less-loader",
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=images/[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug'
                ],
            },
            {
                test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
                loader: "url-loader?mimetype=application/font-woff",
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
                loader: "file-loader?name=name=fonts/[name].[ext]",
            },
        ]
    }
}
