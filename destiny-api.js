"use strict";

const _ = require('lodash');
const request = require('request-promise');
const requests = require('./requests/requests');

const bungieApiHost = 'http://www.bungie.net/Platform/Destiny/';

class DestinyApi {

    constructor(apiKey, host) {
        this.apiKey = apiKey;
        this.host = host || bungieApiHost;
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

    execute(request) {
        let promise = request.execute(this.host)
            .then(response => {
                if (!response.Response) {
                    let error = new Error('Error response from the destiny api');
                    _.assign(error, response);
                    throw error;
                }
                return response;
            });
        return (this.fullResponse)
            ? promise
            : promise.then(response => response.Response);
    }

    accountSummary(parameters) {
        let request = new requests.AccountSummaryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    activityHistory(parameters) {
        let request = new requests.ActivityHistoryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    characterActivities(parameters) {
        let request = new requests.CharacterActivitiesRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    search(parameters) {
        let request = new requests.SearchRequest(this.apiKey, parameters);
        return this.execute(request);
    }

}

module.exports = DestinyApi;
