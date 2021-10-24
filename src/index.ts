import TerserPlugin from 'terser-webpack-plugin'
import { getEnv, resolve } from './util'
import useLoaders from './loaders'
import usePlugins from './plugins'
import type { WebpackConfig, Configuration } from './typing'

export type { WebpackConfig } from './typing'
export * from './middleware'

export default (config: WebpackConfig): Configuration => {
  const { env, entry, output, alias, devServer } = config
  const { __DEV__, __PROD__ } = getEnv(env)
  const outPath = output || resolve('dist')
  const useHot = typeof devServer === 'undefined'
  const sourceMap = __PROD__ ? 'hidden-source-map' : 'cheap-module-source-map'

  const webpackConfig: Configuration = {
    mode: __DEV__ ? 'development' : __PROD__ ? 'production' : 'none',
    devtool: sourceMap,
    entry,
    output: {
      path: outPath,
      filename: __PROD__ ? `[name].[contenthash:10].js` : `[name].js`,
      chunkFilename: __PROD__ ? `[name].[contenthash:10].chunk.js` : `[name].chunk.js`,
      publicPath: __DEV__ ? '/' : './'
    },
    module: { rules: useLoaders(config, __DEV__, __PROD__) },
    plugins: usePlugins(config, outPath, __DEV__, __PROD__, useHot),
    optimization: {
      minimize: __PROD__,
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
      alias: alias || {
        '@': resolve('src')
      }
    }
  }

  if (devServer) {
    Object.assign(webpackConfig, { devServer })
  }

  return webpackConfig
}
