import type { Entry, RuleSetUseItem, WebpackPluginInstance, RuleSetRule, Compiler } from 'webpack'
import type { Context, Next } from 'koa'
import type { Options as devMiddlewareOptions } from 'webpack-dev-middleware'
import type { MiddlewareOptions as hotMiddlewareOptions } from 'webpack-hot-middleware'
import type { Options, MinifyOptions } from 'html-webpack-plugin'
import type { Configuration } from 'webpack-dev-server'
import type { CopyPluginOptions } from 'copy-webpack-plugin'

type IgnorePluginOptions = 
  | { contextRegExp?: RegExp; resourceRegExp: RegExp; }
  | { checkResource: (resource: string, context: string) => boolean; };

interface Base {
  env?: {
    // 环境变量
    dev?: string[]
    prod?: string[]
  }
  useReact?: boolean // 启用 react
  useVue?: boolean // 启用 vue
}

interface PluginsConfig extends Base {
  htmlOptions?: Options | Options[] // html-webpack-plugin 配置项
  define?: {
    // 全局变量
    dev?: Record<string, string>
    prod?: Record<string, string>
  }
  copy?: CopyPluginOptions
  ignore?: IgnorePluginOptions // 排除编译
}

interface LoadersConfig extends Base {
  useTypescript?: boolean // 启用 ts
}

interface WebpackConfig extends Base, PluginsConfig, LoadersConfig {
  entry: Entry // 入口
  output?: string // 输出
  devServer?: Configuration // webpack-dev-server 配置项
  alias?: Record<string, string> // 别名
}

export type { Configuration } from 'webpack'
export type {
  Next,
  Context,
  Options,
  Compiler,
  RuleSetRule,
  WebpackConfig,
  LoadersConfig,
  PluginsConfig,
  MinifyOptions,
  RuleSetUseItem,
  devMiddlewareOptions,
  hotMiddlewareOptions,
  WebpackPluginInstance,
}
