'use strict';

// test file

module.exports = {
    micros: {
        test: { // 单独配置
            disabled: true, // 禁用入口
            link: '', // 本地路径, 进行本地开发使用的软链接.
        },
        'micro-cc-test': {
            link: __dirname + '/simple',
        },
    },
};
