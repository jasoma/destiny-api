const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let chance = require('chance').Chance();
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.activityHistory', () => {

    var psn;

    before(done => {
        let name = chance.pickone(users.psn.names);
        client.search({
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
                psn = response.data;
                done();
            });
    });

    it('should load activity history for a psn account', () => {
        return client.activityHistory({
                membershipType: DestinyApi.psn,
                destinyMembershipId: psn.membershipId,
                characterId: psn.characters[0].characterBase.characterId
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
                assert.ok(response.data.activities.length > 0);
            });
    });

    it('should load activity history for an xbox account', () => {
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
                return client.activityHistory({
                    membershipType: DestinyApi.xbox,
                    destinyMembershipId: response.data.membershipId,
                    characterId: response.data.characters[0].characterBase.characterId
                });
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
                assert.ok(response.data.activities.length > 0);
            });
    });

    it('should limit rows if passed in options', () => {
        return client.activityHistory({
                membershipType: DestinyApi.psn,
                destinyMembershipId: psn.membershipId,
                characterId: psn.characters[0].characterBase.characterId,
                count: 2
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
                assert.equal(response.data.activities.length, 2);
            });
    });

    it('should include definitions if passed in options', () => {
        return client.activityHistory({
                membershipType: DestinyApi.psn,
                destinyMembershipId: psn.membershipId,
                characterId: psn.characters[0].characterBase.characterId,
                definitions: true
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
                assert.ok(response.definitions);
            });
    });

    it('should use the paging option', done => {
        let first = client.activityHistory({
                membershipType: DestinyApi.psn,
                destinyMembershipId: psn.membershipId,
                characterId: psn.characters[0].characterBase.characterId,
                count: 2,
                page: 0
            });
        let second = client.activityHistory({
                membershipType: DestinyApi.psn,
                destinyMembershipId: psn.membershipId,
                characterId: psn.characters[0].characterBase.characterId,
                count: 2,
                page: 0
            });
        Promise.join(first, second, (responseOne, responseTwo) => {
            let all = _.concat(responseOne.data.activities, responseTwo.data.activities);
            let ids = _.map(all, "activityDetails.instanceId");
            assert.equal(4, ids.length);
            assert.equal(2, _.uniq(ids).length);
            done();
        });
    });
});
