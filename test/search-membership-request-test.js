const assert = require('assert');

const DestinyApi = require('../destiny-api');
const users = require('./data/users');

let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.searchMembership', () => {

    it('should find a users membership id', () => {
        let account = users.random();
        return client.searchMembership(account)
            .then(response => assert.equal(response, account.membershipId));
    });

});
