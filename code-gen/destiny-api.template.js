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
     */
    handle(response) {
        if (response.Response) {
            return (this.fullResponse)
                ? response
                : response.Response;
        }
        throw response;
    }

${functions}

}
