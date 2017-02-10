const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.aggregateStats', () => {

    it('should load aggregate stats for a character', () => {
        let account = users.random();
        return client.aggregateStats({
                membershipType: account.membershipType,
                destinyMembershipId: account.destinyMembershipId,
                characterId: account.randomCharacterId()
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

});
