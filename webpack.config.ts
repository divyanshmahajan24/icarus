/**
 * This file handle the renderer part of the electron app
 */

import * as CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const __DEV__ = process.env.NODE_ENV !== 'production';

const srcPath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './dist');

const mainFile = ['./renderer/index.tsx'];

const config: webpack.Configuration = {
  mode: __DEV__ ? 'development' : 'production',
  target: 'electron-renderer',
  context: srcPath,
  entry: {
    main: mainFile,
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: distPath,
    chunkFilename: 'chunk.[name].[chunkhash].js',
    filename: 'bundle.[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              module: 'esnext',
              configFileName: './src/renderer/tsconfig.json',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['node_modules', './src/renderer'],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './renderer/index.html',
    }),
  ],
  // @ts-ignore
  devServer: {
    port: 7979,
  },
};

module.exports = config;
