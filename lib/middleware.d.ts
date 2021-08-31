import { Compiler } from 'webpack';
import { Context, Next } from 'koa';
import { Options } from 'webpack-dev-middleware';
import { MiddlewareOptions } from 'webpack-hot-middleware';
export declare const koaWebpackHotMiddleware: (compiler: Compiler, options?: MiddlewareOptions) => (ctx: Context, next: Next) => Promise<void>;
export declare const koaWebpackDevMiddleware: (compiler: Compiler, options?: Options) => (ctx: Context, next: Next) => Promise<void>;
