import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import type {Compiler, Context, Next, devMiddlewareOptions, hotMiddlewareOptions} from './typing'

export const koaWebpackHotMiddleware = (compiler: Compiler, options: hotMiddlewareOptions = {}) => {
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

export const koaWebpackDevMiddleware = (compiler: Compiler, options: devMiddlewareOptions = {}) => {
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
        } as any,
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
