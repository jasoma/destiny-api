const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.accountItems', () => {

    it('should load items for an account', () => {
        let account = users.random();
        return client.accountItems(account)
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

});
