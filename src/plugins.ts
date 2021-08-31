import { DefinePlugin, IgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { IWebpackConfig } from '../typings'

export default (config?: IWebpackConfig) => {
  const {
    NODE_ENV: { dev, prod },
    useReact,
    useHtml,
    htmlTemplate,
    outPath,
    define,
    ignore
  } = config

  const __ISPROD__ = prod.includes(process.env.NODE_ENV)
  const __ISDEV__ = dev.includes(process.env.NODE_ENV)

  const plugins = [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [outPath] }),
    __ISPROD__ && new MiniCssExtractPlugin(),
    __ISDEV__ && useReact && new ReactRefreshPlugin({ overlay: { sockIntegration: 'whm' } }),
    __ISDEV__ && new HotModuleReplacementPlugin(),
    __ISDEV__ && define.dev && new DefinePlugin(define.dev),
    __ISPROD__ && define.prod && new DefinePlugin(define.prod),
    ignore && new IgnorePlugin(ignore)
  ].filter(Boolean)

  if (useHtml) {
    htmlTemplate.forEach((config) => {
      plugins.push(new HtmlWebpackPlugin(config))
    })
  }

  return plugins
}
