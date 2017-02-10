const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.characterActivities', () => {

    it('should load activities for an account', () => {
        let account = users.random();
        return client.characterActivities({
            membershipType: account.membershipType,
            destinyMembershipId: account.destinyMembershipId,
            characterId: account.randomCharacterId()
        })
        .then(response => {
            assert.ok(response);
            assert.ok(response.data);
            assert.ok(response.data.available.length > 0);
        });
    });

});
