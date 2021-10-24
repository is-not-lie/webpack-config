import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { DefinePlugin, IgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import { useDefine, useHtmlOptions } from './util'
import type { PluginsConfig, WebpackPluginInstance } from './typing'

export default (config: PluginsConfig, outPath: string, __DEV__: boolean, __PROD__: boolean, useHot?: boolean) => {
  const { useReact, useVue, htmlOptions, define, ignore, copy } = config

  const plugins: WebpackPluginInstance[] = [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [outPath] }),
    __PROD__ &&
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:10].css',
        chunkFilename: '[name].[contenthash:10].chunk.css'
      }),
    __DEV__ && useReact && new ReactRefreshPlugin({ overlay: { sockIntegration: 'whm' } }),
    useHot && new HotModuleReplacementPlugin(),
    define && new DefinePlugin(useDefine(__DEV__, __PROD__, useVue, define)),
    ignore && new IgnorePlugin(ignore),
    useVue && new VueLoaderPlugin(),
    copy && new CopyPlugin(copy)
  ].filter(Boolean)

  if (htmlOptions) plugins.push(...useHtmlOptions(htmlOptions, __PROD__))

  return plugins
}
