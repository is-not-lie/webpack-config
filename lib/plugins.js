"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = require("webpack");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
exports.default = (config) => {
    const { NODE_ENV: { dev, prod }, useReact, useHtml, htmlTemplate, outPath, define, ignore } = config;
    const __ISPROD__ = prod.includes(process.env.NODE_ENV);
    const __ISDEV__ = dev.includes(process.env.NODE_ENV);
    const plugins = [
        new clean_webpack_plugin_1.CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [outPath] }),
        __ISPROD__ && new mini_css_extract_plugin_1.default(),
        __ISDEV__ && useReact && new react_refresh_webpack_plugin_1.default({ overlay: { sockIntegration: 'whm' } }),
        __ISDEV__ && new webpack_1.HotModuleReplacementPlugin(),
        __ISDEV__ && define.dev && new webpack_1.DefinePlugin(define.dev),
        __ISPROD__ && define.prod && new webpack_1.DefinePlugin(define.prod),
        ignore && new webpack_1.IgnorePlugin(ignore)
    ].filter(Boolean);
    if (useHtml) {
        htmlTemplate.forEach((config) => {
            plugins.push(new html_webpack_plugin_1.default(config));
        });
    }
    return plugins;
};
