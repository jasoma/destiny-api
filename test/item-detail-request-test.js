const assert = require('assert');
const chance = require('chance').Chance();
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.itemDetail', () => {

    it('should load item detail for an owned item', () => {
        let account = users.random();
        let characterId = account.randomCharacterId();

        return client.characterInventory({
                membershipType: account.membershipType,
                destinyMembershipId: account.destinyMembershipId,
                characterId: characterId
            })
            .then(response => {
                assert.ok(response.data.items);
                assert.ok(response.data.items.length > 0);
                return chance.pickone(response.data.items);
            })
            .then(item => {
                return client.itemDetail({
                    membershipType: account.membershipType,
                    destinyMembershipId: account.destinyMembershipId,
                    characterId: characterId,
                    itemInstanceId: item.itemId
                });
            })
            .then(response => {
                assert.ok(response);
                assert.ok(response.data.item);
            });
    });

});
