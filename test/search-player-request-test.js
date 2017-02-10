const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let chance = require('chance').Chance();
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.searchPlayer', () => {

    it('should find a psn account', () => {
        let name = chance.pickone(users.psn.names);
        return client.searchPlayer({
                membershipType: DestinyApi.psn,
                displayName: name
            })
            .then(response => assert.equal(response[0].displayName, name));
    });

    it('should find an xbox account', () => {
        let name = chance.pickone(users.xbox.names);
        return client.searchPlayer({
                membershipType: DestinyApi.xbox,
                displayName: name
            })
            .then(response => assert.equal(response[0].displayName, name));
    });

    it('should return an empty array for no matches', () => {
        return client.searchPlayer({
                membershipType: DestinyApi.psn,
                displayName: 'this is not a username surely'
            })
            .then(response => assert.equal(0, response.length));
    });
});
