const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        app: './index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'app-[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@ee-fe/react-track': path.join(__dirname, '..', 'src')
        },
        modules: [
            path.resolve(__dirname, '..', 'node_modules'),
            __dirname
        ]
    },
    plugins: [new HtmlWebpackPlugin()],
    devServer: {
        contentBase: '.',
        historyApiFallback: true,
        port: 3000,
        compress: false,
        inline: false,
        hot: false,
        host: 'localhost',
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m'
            }
        }
    }
};
