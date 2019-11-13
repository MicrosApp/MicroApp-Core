'use strict';

/* global expect */

const { PreLoadPlugins, SharedProps } = require('.');

describe('Constants', () => {

    it('check PreLoadPlugins', () => {
        PreLoadPlugins.forEach(item => {
            expect(item.id).not.toBeUndefined();
            expect(typeof item.id).toEqual('string');
            expect(/[\.|\/]/ig.test(item.id)).toEqual(false);
            expect(item.link).not.toBeUndefined();
            expect(typeof item.link).toEqual('string');
            expect(item.description).not.toBeUndefined();
            expect(typeof item.description).toEqual('string');

            expect(PreLoadPlugins.filter(_item => _item.id === item.id).length).toEqual(1);
        });

        expect(Array.from(new Set(PreLoadPlugins.map(item => item.id))).length).toEqual(PreLoadPlugins.length);
    });

    it('check SharedProps length', () => {
        expect(Array.from(new Set(SharedProps)).length).toEqual(SharedProps.length);
    });

    it('check SharedProps exist', () => {
        const Service = require('../');
        const service = new Service();
        SharedProps.forEach(key => {
            expect(service[key] === undefined && key).toBeFalsy();
            expect(service[key]).not.toBeUndefined();
            expect(service[key]).not.toBeNull();
        });
    });

});
