'use strict';

/* global expect */

const BaseService = require('./BaseService');

describe('BaseService', () => {

    it('new constructor', () => {
        const base = new BaseService();

        expect(base.pkg).not.toBeNull();
        expect(base.pkg).not.toBeUndefined();

        expect(base.mode).not.toBeNull();
        expect(base.mode).not.toBeUndefined();
        expect(base.mode).toEqual('test');

        expect(base.strictMode).not.toBeNull();
        expect(base.strictMode).not.toBeUndefined();

    });

    it('env', () => {
        const base = new BaseService();

        expect(base.mode).not.toBeNull();
        expect(base.mode).not.toBeUndefined();
        expect(base.mode).toEqual('test');

        expect(process.env.MICRO_APP_TEST).not.toBeNull();
        expect(process.env.MICRO_APP_TEST).not.toBeUndefined();
        expect(process.env.MICRO_APP_TEST).toEqual('true');

    });

});
