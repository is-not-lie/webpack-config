import path from 'path'
import fs from 'fs'
import useLoaders from './loaders'
import usePlugins from './plugins'
import TerserPlugin from 'terser-webpack-plugin'
import { IWebpackConfig, Configuration } from '../typings'

export * from './middleware'

const appPath = fs.realpathSync(process.cwd())
const resolve = (relativePath: string) => path.resolve(appPath, relativePath)

const defaultConfig: IWebpackConfig = {
  entry: resolve('src'),
  outPath: resolve('dist'),
  htmlTemplate: [{ template: path.resolve(__dirname, '../index.html') }],
  NODE_ENV: { dev: ['development'], prod: ['production'] },
  alias: { '^@/*': appPath }
}

export default (config?: IWebpackConfig): Configuration => {
  const _config = Object.assign(defaultConfig, config)
  const {
    NODE_ENV: { dev, prod },
    entry,
    outPath,
    alias,
    useDevServer
  } = _config

  const __ISDEV__ = dev.includes(process.env.NODE_ENV)
  const __ISPROD__ = prod.includes(process.env.NODE_ENV)
  const sourceMap = __ISDEV__ ? 'inline-source-map' : __ISPROD__ ? 'nosources-source-map' : false

  const webpackConfig: Configuration = {
    mode: __ISDEV__ ? 'development' : __ISPROD__ ? 'production' : 'none',
    devtool: sourceMap,
    entry,
    output: {
      path: outPath,
      filename: __ISPROD__ ? `[name].[contenthash].js` : `[name].js`,
      chunkFilename: __ISPROD__ ? `[name].[contenthash].chunk.js` : `[name].chunk.js`,
      publicPath: __ISDEV__ ? '/' : './'
    },
    module: { rules: useLoaders(_config) },
    plugins: usePlugins(_config),
    optimization: {
      minimize: __ISPROD__,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              ecma: 5
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all'
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias
    }
  }

  if (useDevServer) {
    Object.assign(webpackConfig, {})
  }

  return webpackConfig
}
