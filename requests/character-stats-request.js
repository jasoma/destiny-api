"use strict";

const _ = require('lodash');
const request = require('request-promise');
const Promise = require('bluebird');
const RequestParameters = require('./request-parameters');

const uriTemplate = _.template('Stats/${membershipType}/${destinyMembershipId}/${characterId}/');
const parameters = new RequestParameters([{
    "required": true,
    "type": "path",
    "name": "membershipType"
}, {
    "required": true,
    "type": "path",
    "name": "destinyMembershipId"
}, {
    "required": true,
    "type": "path",
    "name": "characterId",
    "default": 0
}, {
    "required": false,
    "type": "query",
    "name": "monthstart"
}, {
    "required": false,
    "type": "query",
    "name": "monthend"
}, {
    "required": false,
    "type": "query",
    "name": "daystart"
}, {
    "required": false,
    "type": "query",
    "name": "dayend"
}, {
    "required": false,
    "type": "query",
    "name": "periodType"
}, {
    "required": false,
    "type": "query",
    "name": "modes"
}, {
    "required": false,
    "type": "query",
    "name": "groups"
}]);


class CharacterStatsRequest {

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

module.exports = CharacterStatsRequest;
