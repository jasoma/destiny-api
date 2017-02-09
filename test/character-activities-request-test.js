const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let chance = require('chance').Chance();
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.characterActivities', () => {

    it('should load activities for a psn account', () => {
        let name = chance.pickone(users.psn.names);
        return client.search({
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
                return client.characterActivities({
                    membershipType: DestinyApi.psn,
                    destinyMembershipId: response.data.membershipId,
                    characterId: response.data.characters[0].characterBase.characterId
                });
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
                assert.ok(response.data.available.length > 0);
            });
    });

    it('should load activities for an xbox account', () => {
        let name = chance.pickone(users.xbox.names);
        return client.search({
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
                return client.characterActivities({
                    membershipType: DestinyApi.xbox,
                    destinyMembershipId: response.data.membershipId,
                    characterId: response.data.characters[0].characterBase.characterId
                });
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
                assert.ok(response.data.available.length > 0);
            });
    });
});
