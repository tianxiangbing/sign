var path = require("path");
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
console.log("+++++++++++" + process.env.NODE_ENV + "***********")
var TEST = process.env.NODE_ENV == "test" || process.env.NODE_ENV == "dev";
console.log(TEST)
var filename = TEST ? "[name]" : "[chunkhash:8].[name]";
console.log(filename)
var extractCSS = new ExtractTextPlugin('stylesheets/' + filename + '.css');
//var ignoreFiles = new webpack.IgnorePlugin(new RegExp("^(jquery|react|react-dom)$"));

//动态创建html
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlPlugin = new HtmlWebpackPlugin({
    title: "签到",
    filename: '../index.html',
    template: "template.html"
});
var modulesDirectories = ["web_modules", "node_modules", "bower_components", "app/devconfig", "app/cyconfig"];
if (process.env.NODE_ENV == "test") {
    modulesDirectories = ["web_modules", "node_modules", "bower_components", "app/config", "app/cyconfig"];
}
var config = {
    entry: {
        app: ["./app/app.jsx"],
        vendor: ["react", "react-dom", 'whatwg-fetch', 'react-router']
    },
    output: {
        path: path.resolve(__dirname, "caiyun/build"),
        //publicPath: "/data/assets/build/",
        publicPath: "build/",
        filename: filename + ".js"
    },
    resolve: {
        modulesDirectories: modulesDirectories,
        extensions: ['', '.js', '.jsx', 'css']
    },
    module: {
        loaders: [{
            jsx: /\.(js|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.scss$/,
            exclude: /(node_modules|bower_components)/,
            loader: extractCSS.extract('style-loader', 'css?-url!sass?includePaths[]=' + path.resolve(__dirname, 'app/scss'))
        }, {
            test: /\.(eot|woff|ttf|svg)/,
            loader: 'file-loader?name=[name].[ext]'
        }, {
            test: /\.css$/,
            loader: extractCSS.extract('style-loader', 'css?-url!sass?includePaths[]=' + path.resolve(__dirname, 'app/scss'))
        }, {
            test: /\.html$/,
            loader: "html-loader"
        }, {
            test: /\.png$/,
            loader: "file-loader?name=[hash:8].[name].[ext]"
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        extractCSS,
        //ignoreFiles
        new webpack.optimize.CommonsChunkPlugin("vendor", "[chunkhash:8].base.js"), htmlPlugin
    ],
    externals: {
        'react/addons': 'commonjs react/addons'
    }
};
if (process.env.NODE_ENV == "test" || process.env.NODE_ENV == "dev") {
    config.devtool = "source-map";
    config.output.publicPath = "/";
}
if (process.env.NODE_ENV == "production") {
    config.resolve.modulesDirectories = ["web_modules", "node_modules", "bower_components", "app/devconfig", "app/msconfig"];
    config.output.path = path.resolve(__dirname, "masheng/build")
}
if (process.env.NODE_ENV == "uban") {
    config.resolve.modulesDirectories = ["web_modules", "node_modules", "bower_components", "app/devconfig", "app/msconfig"];
    config.output.path = path.resolve(__dirname, "uban/build")
}
console.log(config)
module.exports = config