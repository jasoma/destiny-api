const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.accountAdvisors', () => {

    it('should load advisors for an account', () => {
        let account = users.random();
        return client.accountAdvisors(account)
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

});
