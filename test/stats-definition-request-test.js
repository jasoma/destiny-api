const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.statsDefinitions', () => {

    it('should load definitions for historical stats', () => {
        let account = users.random();
        return client.statsDefinitions()
            .then(response => {
                assert.ok(response);
            });
    });

});
