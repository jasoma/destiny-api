const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.characterInventory', () => {

    it('should load inventory for a character', () => {
        let account = users.random();
        return client.characterInventory({
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
