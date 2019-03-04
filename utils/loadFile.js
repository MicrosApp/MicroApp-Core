'use strict';

const tryRequire = require('try-require');
const fs = require('fs');
const path = require('path');
const symbols = require('../config/symbols');

function isSupport(filename) {
    return [ '.js' ].some(ext => {
        return filename.endsWith(ext);
    });
}

function load(filePath) {
    // const str = fs.readFileSync(filePath, 'utf8');
    const file = tryRequire(filePath);
    if (file) {
        file[symbols.root] = path.dirname(filePath);
        file[symbols.path] = filePath;
    }
    return file;
}

module.exports = function loadFile(root, filename) {
    if (!root || !filename) {
        return null;
    }
    if (!isSupport(filename)) {
        return null;
    }
    if (!fs.existsSync(root)) {
        return null;
    }
    if (!fs.statSync(root).isDirectory()) {
        return null;
    }
    const filePath = path.join(root, filename);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    if (!fs.statSync(filePath).isFile()) {
        return null;
    }
    return load(filePath);
};
