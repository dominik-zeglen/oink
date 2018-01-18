const webpack = require('webpack');
const path = require('path');
const extractTextPluginModule = require('extract-text-webpack-plugin');
const bundleTrackerPluginModule = require('webpack-bundle-tracker');
const autoprefixer = require('autoprefixer');

const resolve = path.resolve.bind(path, __dirname);
const extractTextPlugin = new extractTextPluginModule('[name].css');
const occurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();
const fontLoaderPath = 'file-loader?name=./fonts/[name].[ext]';
const imageLoaderPath = 'file-loader?name=./images/[name].[ext]';
const uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin();
const bundleTrackerPlugin = new bundleTrackerPluginModule({
  filename: 'webpack-bundle.json'
});

module.exports = (env) => {
  const plugins = [
    bundleTrackerPlugin,
    extractTextPlugin,
    occurrenceOrderPlugin,
  ];
  if(env !== 'dev') {
    plugins.push(uglifyJsPlugin);
  }
  return [
    {
      entry: {
        front: './src/public/js/app.js'
      },
      output: {
        path: resolve('./dist/public/front/'),
        filename: '[name].js',
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.scss$/,
            loader: extractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    'sourceMap': true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    'sourceMap': true,
                    'plugins': () => {
                      return [autoprefixer];
                    }
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    'sourceMap': true
                  }
                }
              ]
            })
          },
          {
            test: /\.(eot|otf|ttf|woff|woff2)(\?v=[0-9.]+)?$/,
            loader: fontLoaderPath
          },
          {
            test: /\.(png|svg|jpg)(\?v=[0-9.]+)?$/,
            loader: imageLoaderPath
          }
        ]
      },
      plugins: plugins,
      devtool: env === 'dev' ? '#source-map' : false,
      watch: env === 'dev'
    },
    {
      entry: {
        oink: './src/oink/js/oink.js'
      },
      output: {
        path: resolve('./dist/public/oink/'),
        filename: '[name].js',
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.scss$/,
            loader: extractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    'sourceMap': true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    'sourceMap': true,
                    'plugins': () => {
                      return [autoprefixer];
                    }
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    'sourceMap': true
                  }
                }
              ]
            })
          },
          {
            test: /\.(eot|otf|ttf|woff|woff2)(\?v=[0-9.]+)?$/,
            loader: fontLoaderPath
          },
          {
            test: /\.(png|svg|jpg)(\?v=[0-9.]+)?$/,
            loader: imageLoaderPath
          }
        ]
      },
      plugins: plugins,
      devtool: env === 'dev' ? '#source-map' : false,
      watch: env === 'dev'
    }
  ];
};
