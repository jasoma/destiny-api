"use strict";

const _ = require('lodash');
const request = require('request-promise');
const Promise = require('bluebird');
const RequestParameters = require('./request-parameters');

const uriTemplate = _.template('Explorer/Items/');
const parameters = new RequestParameters([{
    "required": false,
    "type": "query",
    "name": "definitions"
}, {
    "required": false,
    "type": "query",
    "name": "sourcecat"
}, {
    "required": false,
    "type": "query",
    "name": "categories"
}, {
    "required": false,
    "type": "query",
    "name": "weaponPerformance"
}, {
    "required": false,
    "type": "query",
    "name": "rarity"
}, {
    "required": false,
    "type": "query",
    "name": "sourceHash"
}, {
    "required": false,
    "type": "query",
    "name": "damageTypes"
}, {
    "required": false,
    "type": "query",
    "name": "impactEffects"
}, {
    "required": false,
    "type": "query",
    "name": "guardianAttributes"
}, {
    "required": false,
    "type": "query",
    "name": "lightAbilities"
}, {
    "required": false,
    "type": "query",
    "name": "matchrandomsteps"
}, {
    "required": false,
    "type": "query",
    "name": "step"
}, {
    "required": false,
    "type": "query",
    "name": "count"
}, {
    "required": false,
    "type": "query",
    "name": "page"
}, {
    "required": false,
    "type": "query",
    "name": "name"
}, {
    "required": false,
    "type": "query",
    "name": "order"
}, {
    "required": false,
    "type": "query",
    "name": "orderstathash"
}, {
    "required": false,
    "type": "query",
    "name": "direction"
}]);


class ExploreItemsRequest {

    constructor(apiKey, values) {
        this.apiKey = apiKey;
        _.defaults(this, parameters.defaults());
        _.merge(this, values);
    }

    execute(host) {
        let error = parameters.validate(this);
        if (error) {
            return Promise.reject(error);
        }
        let options = parameters.buildOptions(this);
        let uri = (host || '') + uriTemplate(options.path);
        return request({
            uri: uri,
            method: 'GET',
            headers: {
                'x-api-key': this.apiKey
            },
            qs: _.isEmpty(options.query) ? undefined : options.query,
            body: _.isEmpty(options.body) ? undefined : options.body,
            json: true
        });
    }

    validate() {
        return parameters.validate(this);
    }
}

module.exports = ExploreItemsRequest;
