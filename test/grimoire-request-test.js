const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.grimoire', () => {

    it('should load grimoire definitions', () => {
        let account = users.random();
        return client.grimoire(account)
            .then(response => {
                assert.ok(response);
            });
    });

});
