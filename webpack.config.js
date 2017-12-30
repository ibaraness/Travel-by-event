var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry:{
		main:"./js/mainscript.js"
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "[name].js"
	},
	module:{
		rules: [
			{
				test:/\.html$/,
				loader:"html-loader"
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
            template: "index.html",
            inject: "body"
        })
	]		
};
