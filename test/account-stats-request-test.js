const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.accountStats', () => {

    it('should load historical stats for an account', () => {
        let account = users.random();
        return client.accountStats(account)
            .then(response => {
                assert.ok(response);
            });
    });

});
