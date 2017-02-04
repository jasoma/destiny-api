const assert = require('assert');
const DestinyApi = require('../destiny-api');
const users = require('./data/users');

let client = new DestinyApi('f874edae1d7f44099712691966e43523');
let chance = require('chance').Chance();

describe('get methods', function() {

    // the api is slooooow
    this.timeout(20000);

    describe('search', () => {

        it('should find a psn account', () => {
            let name = chance.pickone(users.psn.names);
            return client.search(DestinyApi.psn, name)
                .then(response => assert.equal(response[0].displayName, name));
        });

        it('should find an xbox account', () => {
            let name = chance.pickone(users.xbox.names);
            return client.search(DestinyApi.xbox, name)
                .then(response => assert.equal(response[0].displayName, name));
        });

        it('should return an empty array for no matches', () => {
            return client.search(DestinyApi.psn, 'this is not a username surely')
                .then(response => assert.equal(0, response.length));
        });

        it('the promise should fail if the request fails', done => {
            client.search(555, 'not a valid membership type')
                .then(ok => assert.fail('promise should not succeed'))
                .catch(err => done());
        });
    });

    describe('account', () => {

        it('should load details of a psn account', () => {
            let name = chance.pickone(users.psn.names);
            return client.search(DestinyApi.psn, name)
                .then(response => client.account(DestinyApi.psn, response[0].membershipId))
                .then(response => {
                    assert.ok(response);
                    assert.ok(response.data);
                });
        });

        it('should load details of an xbox account', () => {
            let name = chance.pickone(users.xbox.names);
            return client.search(DestinyApi.xbox, name)
                .then(response => client.account(DestinyApi.xbox, response[0].membershipId))
                .then(response => {
                    assert.ok(response);
                    assert.ok(response.data);
                    assert.ok(response.data.characters.length > 0);
                });
        });
    });

    describe('activities', () => {

        it('should load activities for a psn account', () => {
            let name = chance.pickone(users.psn.names);
            return client.search(DestinyApi.psn, name)
                .then(response => client.account(DestinyApi.psn, response[0].membershipId))
                .then(response => client.activities(DestinyApi.psn, response.data.membershipId, response.data.characters[0].characterBase.characterId))
                .then(response => {
                    assert.ok(response);
                    assert.ok(response.data);
                    assert.ok(response.data.available.length > 0);
                });
        });

        it('should load activities for an xbox account', () => {
            let name = chance.pickone(users.xbox.names);
            return client.search(DestinyApi.xbox, name)
                .then(response => client.account(DestinyApi.xbox, response[0].membershipId))
                .then(response => client.activities(DestinyApi.xbox, response.data.membershipId, response.data.characters[0].characterBase.characterId))
                .then(response => {
                    assert.ok(response);
                    assert.ok(response.data);
                    assert.ok(response.data.available.length > 0);
                });
        });
    });
});
