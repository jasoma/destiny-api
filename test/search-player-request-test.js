const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');
const users = require('./data/users');

let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.searchPlayer', () => {

    it('should find a psn account', () => {
        let account = users.randomPsn();
        return client.searchPlayer(account)
            .then(response => assert.equal(response[0].displayName, account.displayName));
    });

    it('should find an xbox account', () => {
        let account = users.randomXbox();
        return client.searchPlayer(account)
            .then(response => assert.equal(response[0].displayName, account.displayName));
    });

    it('should return an empty array for no matches', () => {
        return client.searchPlayer({
                membershipType: DestinyApi.psn,
                displayName: 'this is not a username surely'
            })
            .then(response => assert.equal(0, response.length));
    });
});
