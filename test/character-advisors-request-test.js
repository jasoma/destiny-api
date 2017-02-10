const assert = require('assert');
const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.characterAdvisors', () => {

    it('should load advisors for a character', () => {
        let account = users.random();
        return client.characterAdvisors({
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
