const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.activityHistory', () => {

    it('should load activity history for an account', () => {
        let account = users.random();
        return client.activityHistory({
            membershipType: account.membershipType,
            destinyMembershipId: account.destinyMembershipId,
            characterId: account.randomCharacterId()
        })
        .then(response => {
            assert.ok(response);
            assert.ok(response.data);
            assert.ok(response.data.activities.length > 0);
        });
    });

    it('should limit rows if passed in options', () => {
        let account = users.random();
        return client.activityHistory({
            membershipType: account.membershipType,
            destinyMembershipId: account.destinyMembershipId,
            characterId: account.randomCharacterId(),
            count: 2
        })
        .then(response => {
            assert.ok(response);
            assert.ok(response.data);
            assert.equal(response.data.activities.length, 2);
        });
    });

    it('should include definitions if passed in options', () => {
        let account = users.random();
        return client.activityHistory({
            membershipType: account.membershipType,
            destinyMembershipId: account.destinyMembershipId,
            characterId: account.randomCharacterId(),
            definitions: true
        })
        .then(response => {
            assert.ok(response);
            assert.ok(response.data);
            assert.ok(response.definitions);
        });
    });

    it('should use the paging option', done => {
        let account = users.random();
        let characterId = account.randomCharacterId();
        let first = client.activityHistory({
            membershipType: account.membershipType,
            destinyMembershipId: account.destinyMembershipId,
            characterId: characterId,
            count: 2,
            page: 0
        });
        let second = client.activityHistory({
            membershipType: account.membershipType,
            destinyMembershipId: account.destinyMembershipId,
            characterId: characterId,
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
