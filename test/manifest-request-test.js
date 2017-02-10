const assert = require('assert');
const DestinyApi = require('../destiny-api');

let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.manifest', () => {

    it('should load the current manifest data', () => {
        return client.manifest()
            .then(response => {
                assert.ok(response);
                assert.ok(response.version);
            });
    });

});
