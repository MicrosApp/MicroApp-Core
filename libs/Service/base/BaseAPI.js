'use strict';

const semver = require('semver');
const logger = require('../../../src/utils/logger');
const CONSTANTS = require('../../../config/constants');

class BaseAPI {

    constructor(id, service) {
        this.logger = logger;

        this.id = id;
        this.service = service || {};

        this.API_TYPE = {
            ADD: Symbol('add'),
            MODIFY: Symbol('modify'),
            EVENT: Symbol('event'),
        };
    }

    get version() {
        return this.service.version || CONSTANTS.VERSION;
    }

    setState(key, value) {
        this.service.state[key] = value;
    }

    getState(key, value) {
        return this.service.state[key] || value;
    }

    assertVersion(range) {
        if (typeof range === 'number') {
            if (!Number.isInteger(range)) {
                this.logger.throw('Expected string or integer value.');
            }
            range = `^${range}.0.0-0`;
        }
        if (typeof range !== 'string') {
            this.logger.throw('Expected string or integer value.');
        }

        const version = this.version;

        if (semver.satisfies(version, range)) return;

        this.logger.throw(`Require ${CONSTANTS.SCOPE_NAME}/core "${range}", but was loaded with "${version}".`);
    }
}

module.exports = BaseAPI;
