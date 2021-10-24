import { useStyleLoaders } from './util'
import type { LoadersConfig, RuleSetRule } from './typing'

export default (config: LoadersConfig, __DEV__: boolean, __PROD__: boolean): RuleSetRule[] => {
  const { useReact, useTypescript, useVue } = config

  const rules: RuleSetRule[] = [
    useVue && {
      test: /\.vue$/,
      exclude: /node_modules/,
      loader: 'vue-loader'
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
              useVue
                ? '@babel/preset-env'
                : [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'usage',
                      corejs: 3
                    }
                  ],
              useReact && '@babel/preset-react',
              useTypescript && '@babel/preset-typescript'
            ].filter(Boolean),
            plugins: [useReact && __DEV__ && 'react-refresh/babel', useVue && '@vue/babel-plugin-jsx'].filter(Boolean)
          }
        },
        {
          test: /\.css$/,
          use: useStyleLoaders(__PROD__, useVue)
        },
        {
          test: /\.less$/,
          use: useStyleLoaders(__PROD__, useVue, 'less-loader', {
            lessOptions: { javaScriptEnabled: true }
          })
        },
        {
          test: /\.s(a|c)ss$/,
          use: useStyleLoaders(__PROD__, useVue, 'sass-loader', {
            sassOptions: { javaScriptEnabled: true }
          })
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          type: 'asset',
          generator: {
            filename: 'images/[name].[hash:8][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024
            }
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]'
          }
        }
      ]
    }
  ]

  return rules.filter(Boolean)
}
