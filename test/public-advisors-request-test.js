const assert = require('assert');
const DestinyApi = require('../destiny-api');

let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.publicAdvisors', () => {

    it('should load the current advisor data', () => {
        return client.publicAdvisors()
            .then(response => {
                assert.ok(response);
            });
    });

});
