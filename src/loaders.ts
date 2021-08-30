import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { RuleSetRule } from 'webpack'
import { IWebpackConfig } from './typings.d'

export default (config?: IWebpackConfig): RuleSetRule[] => {
  const {
    NODE_ENV: { dev, prod },
    useEslint,
    useReact,
    useVue,
    useTypeScript
  } = config

  const __ISDEV__ = dev.includes(process.env.NODE_ENV)
  const __PROD__ = prod.includes(process.env.NODE_ENV)

  const useStyleLoaders = (loader?: string, loaderOptions?: any) => {
    return [
      __ISDEV__ ? 'style-loader' : MiniCssExtractPlugin.loader,
      { loader: 'css-loader', options: { importLoaders: loader ? 2 : 1 } },
      { loader: 'postcss-loader', options: { postcssOptions: {} } },
      loader && { loader, options: loaderOptions || {} }
    ].filter(Boolean)
  }

  const rules: RuleSetRule[] = [
    useEslint && {
      test: /\.(j|t)sx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      enforce: 'pre'
    },
    {
      oneOf: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              '@babel/preset-env',
              useReact && '@babel/preset-react',
              useTypeScript && '@babel/preset-typescript'
            ].filter(Boolean),
            plugins: [
              useReact && '@babel/plugin-syntax-dynamic-import',
              useReact && __ISDEV__ && 'react-refresh/babel'
            ].filter(Boolean)
          }
        },
        {
          test: /\.css$/,
          use: useStyleLoaders()
        },
        {
          test: /\.less$/,
          use: useStyleLoaders('less-loader', {
            lessOptions: { javaScriptEnabled: true }
          })
        },
        {
          test: /\.s(a|c)ss$/,
          use: useStyleLoaders('sass-loader', {
            sassOptions: { javaScriptEnabled: true }
          })
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          type: 'asset',
          generator: {
            filename: 'images/[name].[hash:8][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          type: 'asset',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]'
          }
        }
      ]
    }
  ]

  return rules.filter(Boolean)
}
