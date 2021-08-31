"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.koaWebpackDevMiddleware = exports.koaWebpackHotMiddleware = void 0;
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
const koaWebpackHotMiddleware = (compiler, options = {}) => {
    const middleware = webpack_hot_middleware_1.default(compiler, options);
    const koaMiddleware = async (ctx, next) => {
        const { req, res } = ctx;
        const { end: originalEnd } = res;
        const runNext = await new Promise((resolve) => {
            res.end = function end() {
                originalEnd.apply(this, arguments);
                resolve(0);
            };
            middleware(req, res, () => {
                resolve(1);
            });
        });
        if (runNext)
            await next();
    };
    return koaMiddleware;
};
exports.koaWebpackHotMiddleware = koaWebpackHotMiddleware;
const koaWebpackDevMiddleware = (compiler, options = {}) => {
    const expressMiddleware = webpack_dev_middleware_1.default(compiler, options);
    const koaMiddleware = async (ctx, next) => {
        const { req } = ctx;
        const locals = ctx.locals || ctx.state;
        ctx.webpack = expressMiddleware;
        const runNext = await new Promise((resolve) => {
            expressMiddleware(req, {
                locals,
                send(body) {
                    ctx.body = body;
                    resolve(0);
                },
                set(field, value) {
                    ctx.response.set(field, value);
                },
                get(field) {
                    return ctx.response.get(field);
                }
            }, () => {
                resolve(1);
            });
        });
        if (runNext)
            await next();
    };
    Object.keys(expressMiddleware).forEach((key) => (koaMiddleware[key] = expressMiddleware[key]));
    return koaMiddleware;
};
exports.koaWebpackDevMiddleware = koaWebpackDevMiddleware;
