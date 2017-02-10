const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.accountGrimoire', () => {

    it('should load grimoire for an account', () => {
        let account = users.random();
        return client.accountGrimoire(account)
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

});
