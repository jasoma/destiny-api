"use strict";

const _ = require('lodash');
const request = require('request-promise');
const Promise = require('bluebird');
const RequestParameters = require('./request-parameters');

const pathTemplate = _.template('Stats/ActivityHistory/${membershipType}/${membershipId}/${characterId}');
const parameters = new RequestParameters([
    {
        name: 'membershipType',
        type: 'path',
        required: true,
    },
    {
        name: 'membershipId',
        type: 'path',
        required: true,
    },
    {
        name: 'characterId',
        type: 'path',
        required: true,
    },
    {
        name: 'count',
        type: 'query',
        required: false
    },
    {
        name: 'page',
        type: 'query',
        required: false,
    },
    {
        name: 'definitions',
        type: 'query',
        required: false,
    },
    {
        name: 'mode',
        type: 'query',
        required: true,
        default: 'None'
    }
]);

class ActivityHistory {

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
        let uri = (host || '') + pathTemplate(options.path);
        return request({
            uri: uri,
            headers: {
                'x-api-key': this.apiKey
            },
            qs: options.query,
            json: true
        });
    }

}

module.exports = ActivityHistory;
