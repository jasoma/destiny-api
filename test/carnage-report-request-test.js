const assert = require('assert');
const chance = require('chance').Chance();
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.carnageReport', () => {

    it('should return a carnage report', () => {
        let account = users.random();
        let characterId = account.randomCharacterId();
        return client.activityHistory({
            membershipType: account.membershipType,
            destinyMembershipId: account.destinyMembershipId,
            characterId: characterId,
            mode: 'AllPvP'
        })
        .then(response => {
            let activityId = chance.pickone(response.data.activities).activityDetails.instanceId;
            return client.carnageReport({ activityId: activityId });
        })
        .then(response => {
            assert.ok(response.data);
        });
    });

});
