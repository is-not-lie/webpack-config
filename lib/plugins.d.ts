import { DefinePlugin, IgnorePlugin, HotModuleReplacementPlugin } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { IWebpackConfig } from '../typings';
declare const _default: (config?: IWebpackConfig) => (DefinePlugin | HotModuleReplacementPlugin | IgnorePlugin | MiniCssExtractPlugin | CleanWebpackPlugin | ReactRefreshPlugin)[];
export default _default;
