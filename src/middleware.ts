import { Compiler } from 'webpack'
import { Context, Next } from 'koa'
import devMiddleware, { Options } from 'webpack-dev-middleware'
import hotMiddleware, { MiddlewareOptions } from 'webpack-hot-middleware'

export const koaWebpackHotMiddleware = (compiler: Compiler, options: MiddlewareOptions = {}) => {
  const middleware = hotMiddleware(compiler, options)
  const koaMiddleware = async (ctx: Context, next: Next) => {
    const { req, res } = ctx
    const { end: originalEnd } = res
    const runNext = await new Promise((resolve) => {
      res.end = function end() {
        originalEnd.apply(this, arguments)
        resolve(0)
      }
      middleware(req, res, () => {
        resolve(1)
      })
    })
    if (runNext) await next()
  }
  return koaMiddleware
}

export const koaWebpackDevMiddleware = (compiler: Compiler, options: Options = {}) => {
  const expressMiddleware = devMiddleware(compiler, options)

  const koaMiddleware = async (ctx: Context, next: Next) => {
    const { req } = ctx
    const locals = ctx.locals || ctx.state

    ctx.webpack = expressMiddleware
    const runNext = await new Promise((resolve) => {
      expressMiddleware(
        req,
        {
          locals,
          send(body) {
            ctx.body = body
            resolve(0)
          },
          set(field, value) {
            ctx.response.set(field, value)
          },
          get(field) {
            return ctx.response.get(field)
          }
        },
        () => {
          resolve(1)
        }
      )
    })

    if (runNext) await next()
  }

  Object.keys(expressMiddleware).forEach(
    (key) => (koaMiddleware[key] = expressMiddleware[key])
  )

  return koaMiddleware
}
