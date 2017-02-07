"use strict";

const _ = require('lodash');
const request = require('request-promise');
const requests = require('./requests/requests');

const host = 'http://www.bungie.net/Platform/Destiny/';
const uris = {
    "search": _.template('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/${membershipType}/${name}'),
    "account": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Summary'),
    "character": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}'),
    "activities": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}/Activities'),
    "activity-history": _.template('http://www.bungie.net/Platform/Destiny/Stats/ActivityHistory/${membershipType}/${membershipId}/${characterId}'),
    "carnage-report": _.template('http://www.bungie.net/Platform/Destiny/Stats/PostGameCarnageReport/${activityId}'),
    "inventory": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}/Inventory'),
    "progression": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}/Progression'),
    "equip": 'http://www.bungie.net/Platform/Destiny/EquipItem',
    "transfer-item": 'http://www.bungie.net/Platform/Destiny/TransferItem'
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
    throw new Error('Failed response from the DestinyApi:\n' + JSON.stringify(response, null, 2));
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

    accountSummary(parameters) {
        let request = new requests.AccountSummaryRequest(this.apiKey, parameters);
        return request
            .execute(host)
            .then(response => handle(response, this.fullResponse));
    }

    activityHistory(parameters) {
        let request = new requests.ActivityHistoryRequest(this.apiKey, parameters);
        return request
            .execute(host)
            .then(response => handle(response, this.fullResponse));
    }

    activities(parameters) {
        let request = new requests.ActivitiesRequest(this.apiKey, parameters);
        return request
            .execute(host)
            .then(response => handle(response, this.fullResponse));
    }

    search(parameters) {
        let request = new requests.SearchRequest(this.apiKey, parameters);
        return request
            .execute(host)
            .then(response => handle(response, this.fullResponse));
    }

}

module.exports = DestinyApi;
