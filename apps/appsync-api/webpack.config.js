const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const path = require('path');
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const { cpus } = require('os');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: 'tsconfig.json'
      })
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'artifacts', '.webpack'),
    filename: '[name].js'
  },
  //mode: isLocal ? 'development' : 'production',
  mode: 'development',
  devtool: isLocal ? 'source-map' : 'none',
  target: 'node',
  externals: ['aws-sdk', 'dtrace-provider', 'fs'],
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /^.*\.ts$/,
        exclude: /^.*\.spec\.ts$/,
        use: [
          {
            loader: 'cache-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              transpileOnly: true,
              happyPackMode: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/platform-express',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          'cache-manager',
          'class-validator',
          'class-transformer',
          '@nestjs/grahpql',
          'graphql'
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      }
    }),
    new CopyWebpackPlugin({ patterns: [`src/assets/GeoLite2-City.mmdb`] })
  ]
};
