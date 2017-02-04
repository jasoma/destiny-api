"use strict";

const _ = require('lodash');
const request = require('request-promise');

class DestinyApi {

    constructor(apiKey, fullResponse = false) {
        this.apiKey = apiKey;
        this.fullResponse = false;
    }

    /**
     * Handles the raw response from the Destiny API allowing successful responses data to
     * pass through, potentially trimmed base on the `fullResponse` property. Or properly
     * converts error responses into request failure errors by throwing them.
     *
     * @param {object} response - the response from the bungie api.
     */
    handle(response) {
        if (response.Response) {
            return (this.fullResponse)
                ? response
                : response.Response;
        }
        throw response;
    }

    /**
     * Checks if a parameter object contains a minimum set of keys.
     *
     * @param {object} parameters - the parameter object to check.
     * @param {Array} names - an array of keys to check for.
     */
    checkParameters(parameters, names) {
        let setKeys = Object.keys(parameters);
        let missing = _.reject(names, n => _.includes(setKeys, n));
        if (missing.length == 0) {
            return;
        }
        throw new Error(`Required parameters [${missing.join(', ')}] missing`);
    }

${functions}

}

module.exports = DestinyApi;
