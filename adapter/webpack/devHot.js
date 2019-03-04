'use strict';

const requireMicro = require('../../utils/requireMicro');

module.exports = function(webpackConfig) {

    if (!webpackConfig) {
        console.error('webpackConfig null...');
        return {};
    }

    const webpack = require('webpack');
    const compiler = webpack(webpackConfig);

    const selfConfig = requireMicro.self();
    const serverConfig = selfConfig.server;
    const devOptions = serverConfig.options;

    return { webpackConfig, compiler, devOptions };
};
