"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const loaders_1 = __importDefault(require("./loaders"));
const plugins_1 = __importDefault(require("./plugins"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
__exportStar(require("./middleware"), exports);
const appPath = fs_1.default.realpathSync(process.cwd());
const resolve = (relativePath) => path_1.default.resolve(appPath, relativePath);
const defaultConfig = {
    entry: resolve('src'),
    outPath: resolve('dist'),
    htmlTemplate: [{ template: path_1.default.resolve(__dirname, '../index.html') }],
    NODE_ENV: { dev: ['development'], prod: ['production'] },
    alias: { '^@/*': appPath }
};
exports.default = (config) => {
    const _config = Object.assign(defaultConfig, config);
    const { NODE_ENV: { dev, prod }, entry, outPath, alias, useDevServer } = _config;
    const __ISDEV__ = dev.includes(process.env.NODE_ENV);
    const __ISPROD__ = prod.includes(process.env.NODE_ENV);
    const sourceMap = __ISDEV__ ? 'inline-source-map' : __ISPROD__ ? 'nosources-source-map' : false;
    const webpackConfig = {
        mode: __ISDEV__ ? 'development' : __ISPROD__ ? 'production' : 'none',
        devtool: sourceMap,
        entry,
        output: {
            path: outPath,
            filename: __ISPROD__ ? `[name].[contenthash].js` : `[name].js`,
            chunkFilename: __ISPROD__ ? `[name].[contenthash].chunk.js` : `[name].chunk.js`,
            publicPath: __ISDEV__ ? '/' : './'
        },
        module: { rules: loaders_1.default(_config) },
        plugins: plugins_1.default(_config),
        optimization: {
            minimize: __ISPROD__,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    parallel: true,
                    extractComments: false,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            ecma: 5
                        }
                    }
                })
            ],
            splitChunks: {
                chunks: 'all'
            }
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            alias
        }
    };
    if (useDevServer) {
        Object.assign(webpackConfig, {});
    }
    return webpackConfig;
};
