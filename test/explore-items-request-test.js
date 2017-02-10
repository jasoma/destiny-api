const assert = require('assert');
const DestinyApi = require('../destiny-api');

let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.exploreItems', () => {

    it('should load a page of item data', () => {
        return client.exploreItems()
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

});
