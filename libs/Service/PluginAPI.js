'use strict';

const assert = require('assert');
const BaseAPI = require('./BaseAPI');
const DEFAULT_METHODS = require('./methods');

class PluginAPI extends BaseAPI {

    constructor(id, service) {
        super();
        this.id = id;
        this.service = service;

        this._addMethods();
    }

    _addMethods() {
        DEFAULT_METHODS.forEach(method => {
            if (Array.isArray(method)) {
                this.registerMethod(...method);
            } else {
                let type;
                const isPrivate = /^_/i.test(method);
                const slicedMethod = isPrivate ? method.slice(1) : method;
                if (slicedMethod.indexOf('modify') === 0) {
                    type = this.API_TYPE.MODIFY;
                } else if (slicedMethod.indexOf('add') === 0) {
                    type = this.API_TYPE.ADD;
                } else if (
                    slicedMethod.indexOf('on') === 0 ||
                  slicedMethod.indexOf('before') === 0 ||
                  slicedMethod.indexOf('after') === 0
                ) {
                    type = this.API_TYPE.EVENT;
                } else {
                    throw new Error(`unexpected method name ${method}`);
                }
                this.registerMethod(method, { type, description: 'System Build-in' });
            }
        });
    }

    setState(key, value) {
        this.service.state[key] = value;
    }

    getState(key, value) {
        return this.service.state[key] || value;
    }

    register(hook, fn) {
        assert(
            typeof hook === 'string',
            `The first argument of api.register() must be string, but got ${hook}`
        );
        assert(
            typeof fn === 'function',
            `The second argument of api.register() must be function, but got ${fn}`
        );
        const { pluginHooks } = this.service;
        pluginHooks[hook] = pluginHooks[hook] || [];
        pluginHooks[hook].push({
            fn,
        });
    }

    registerMethod(name, opts) {
        assert(!this[name] || !this.service.pluginMethods[name], `api.${name} exists.`);
        assert(opts, 'opts must supplied');
        const { type, apply } = opts;
        assert(!(type && apply), 'Only be one for type and apply.');
        assert(type || apply, 'One of type and apply must supplied.');

        const params = Object.keys(opts).reduce((obj, key) => {
            if (key === 'apply' || key === 'fn') return obj;
            obj[key] = opts[key];
            return obj;
        }, {});

        this.service.pluginMethods[name] = {
            fn: (...args) => {
                if (apply) {
                    this.register(name, opts => {
                        return apply(opts, ...args);
                    });
                } else if (type === this.API_TYPE.ADD) {
                    this.register(name, opts => {
                        return (opts.last || []).concat(
                            typeof args[0] === 'function' ? args[0](opts.last, opts.args) : args[0]
                        );
                    });
                } else if (type === this.API_TYPE.MODIFY) {
                    this.register(name, opts => {
                        return typeof args[0] === 'function' ? args[0](opts.last, opts.args) : args[0];
                    });
                } else if (type === this.API_TYPE.EVENT) {
                    this.register(name, opts => {
                        return args[0](opts.args);
                    });
                } else {
                    throw new Error(`unexpected api type ${type}`);
                }
            },
            ...params,
        };
    }

    registerCommand(name, opts, fn) {
        return this.service.registerCommand(name, opts, fn);
    }

    hasPlugin(id) {
        assert(id, 'id must supplied');
        return this.service.plugins.some(p => id === p.id);
    }
}

module.exports = PluginAPI;
