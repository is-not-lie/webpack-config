import { Configuration, Entry } from 'webpack'
import { Options as IHtmlTemplate } from 'html-webpack-plugin'

export { IHtmlTemplate, Configuration }

export interface IWebpackConfig {
  entry?: Entry // 入口
  outPath?: string // 出口
  useReact?: boolean // 启用 react 配置
  useVue?: boolean // 启用 vue 配置
  useEslint?: boolean // 启用 eslint
  useTypeScript?: boolean // 启用 ts
  useDevServer?: boolean // 启用 devServer
  useHtml?: boolean // 启用 html-webpack-plugin
  htmlTemplate?: IHtmlTemplate[] // html-webpack-plugin 配置项
  NODE_ENV?: { // 环境变量, 决定开发环境或生产环境
    dev?: string[]
    prod?: string[]
  }
  define?: { // 全局变量
    dev?: { [key: string]: string }
    prod?: { [key: string]: string }
  }
  ignore?: // 排除编译
    | { contextRegExp?: RegExp; resourceRegExp?: RegExp }
    | { checkResource?: (resource: string, context: string) => boolean },
  alias?: { [key: string]: string } // 路径别名
}
