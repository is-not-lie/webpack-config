import path from 'path'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import type { Options, MinifyOptions, RuleSetUseItem } from './typing'

const appPath = fs.realpathSync(process.cwd())

export const resolve = (relativePath: string) => path.resolve(appPath, relativePath)

export const useStyleLoaders = (
  __PROD__: boolean,
  useVue?: boolean,
  loader?: string,
  options: Record<string, any> = {}
) => {
  const styleLoaders: RuleSetUseItem[] = [
    __PROD__ ? MiniCssExtractPlugin.loader : useVue ? 'vue-style-loader' : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: loader ? 2 : 1,
        esModule: false
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    }
  ]

  if (loader) styleLoaders.push({ loader, options })
  return styleLoaders
}

export const getEnv = (env: { dev?: string[]; prod?: string[] } = {}) => {
  const { dev, prod } = env
  const development = ['development'].concat(dev || [])
  const production = ['production'].concat(prod || [])
  return {
    __DEV__: development.includes(process.env.NODE_ENV),
    __PROD__: production.includes(process.env.NODE_ENV)
  }
}

export const useHtmlOptions = (htmlOptions: Options | Options[], __PROD__: boolean) => {
  const defaultMinifiy: MinifyOptions = {
    removeComments: true,
    removeEmptyAttributes: true,
    removeTagWhitespace: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true
  }
  const options = Array.isArray(htmlOptions) ? htmlOptions : [htmlOptions]
  return options.map(
    item =>
      new HtmlWebpackPlugin({
        ...defaultMinifiy,
        ...item
      })
  )
}

export const useDefine = (
  __DEV__: boolean,
  __PROD__: boolean,
  useVue?: boolean,
  define: { dev?: Record<string, string>; prod?: Record<string, string> } = {}
) => {
  const { dev, prod } = define
  const defineObj = dev && __DEV__ ? dev : prod && __PROD__ ? prod : {}
  const result = Object.keys(defineObj).reduce(
    (res, key) => ({
      ...res,
      [key]: JSON.stringify(defineObj[key])
    }),
    {}
  )

  if (useVue)
    Object.assign(result, {
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
    })

  return { NODE_ENV: JSON.stringify(process.env.NODE_ENV), ...result }
}
