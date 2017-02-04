"use strict";

const _ = require('lodash');
const request = require('request-promise');

const uris = {
${uriTemplates}
};

/**
 * Checks if a parameter object contains a minimum set of values.
 *
 * @param {object} parameters - the parameter object to check.
 * @param {Array} names - an array of keys to check for.
 */
function validate(parameters, names) {
    let missing = [];
    for (let key of names) {
        if (!parameters[key]) {
            missing.push(key);
        }
    }
    if (missing.length != 0) {
        throw new Error('Required parameters [' + missing.join(', ') + '] missing');
    }
}

/**
 * Handles the raw response from the Destiny API allowing successful responses data to
 * pass through, potentially trimmed base on the `fullResponse` property. Or properly
 * converts error responses into promise failures by throwing them.
 *
 * @param {object} response - the response from the bungie api.
 * @param {boolean} full - whether or not to return the full response for successful requests
 *                         or to return only the actual result data.
 */
function handle(response, full) {
    if (response.Response) {
        return (full)
            ? response
            : response.Response;
    }
    throw response;
}

class DestinyApi {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.fullResponse = false;
    }

    /**
     * The membership type for PSN accounts.
     */
    static get psn() {
        return 2;
    }

    /**
     * The membership type for Xbox Live accounts.
     */
    static get xbox() {
        return 1;
    }

    /**
     * Performs a get request against an api uri.
     *
     * @param {string} uri - the uri to get from.
     * @returns {Promise} a promise for the request result.
     */
    get(uri) {
        return request({
            uri: uri,
            headers: {
                'x-api-key': this.apiKey,
            },
            json: true
        })
        .then(response => handle(response, this.fullResponse));
    }

    /**
     * Performs a post request against an api uri.
     *
     * @param {string} uri - the uri to post to.
     * @param {object} body - the object to place in the post body.
     * @returns {Promise} a promise for the request result.
     */
    post(uri, body) {
        return request({
            method: 'POST',
            uri: uri,
            body: body,
            headers: {
                'x-api-key': this.apiKey
            },
            json: true
        })
        .then(response => handle(response, this.fullResponse));
    }

${functions}
}

module.exports = DestinyApi;
