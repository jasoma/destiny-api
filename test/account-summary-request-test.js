const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let chance = require('chance').Chance();
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.accountSummary', () => {

    it('should load details of a psn account', () => {
        let name = chance.pickone(users.psn.names);
        return client.searchPlayer({
                membershipType: DestinyApi.psn,
                displayName: name
            })
            .then(response => {
                return client.accountSummary({
                    membershipType: DestinyApi.psn,
                    destinyMembershipId: response[0].membershipId
                });
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

    it('should load details of an xbox account', () => {
        let name = chance.pickone(users.xbox.names);
        return client.searchPlayer({
                membershipType: DestinyApi.xbox,
                displayName: name
            })
            .then(response => {
                return client.accountSummary({
                    membershipType: DestinyApi.xbox,
                    destinyMembershipId: response[0].membershipId
                });
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });
});
