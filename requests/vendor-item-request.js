"use strict";

const _ = require('lodash');
const request = require('request-promise');
const Promise = require('bluebird');
const RequestParameters = require('./request-parameters');

const uriTemplate = _.template('${membershipType}/MyAccount/Character/${characterId}/Vendor/${vendorHash}/Item/${vendorItemIndex}/');
const parameters = new RequestParameters([{
    "required": true,
    "type": "path",
    "name": "membershipType"
}, {
    "required": true,
    "type": "path",
    "name": "characterId"
}, {
    "required": true,
    "type": "path",
    "name": "vendorHash"
}, {
    "required": true,
    "type": "path",
    "name": "vendorItemIndex"
}, {
    "required": false,
    "type": "query",
    "name": "definitions"
}]);


class VendorItemRequest {

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

module.exports = VendorItemRequest;
