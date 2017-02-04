const assert = require('assert');
const DestinyApi = require('../destiny-api');
const users = require('./data/users');

let client = new DestinyApi('f874edae1d7f44099712691966e43523');
let chance = require('chance').Chance();

describe('generated api methods', function() {

    this.timeout(10000);

    describe('search', () => {

        it('should find a psn account', () => {
            let name = chance.pickone(users.psn.names);
            return client.search(DestinyApi.psn, name)
                .then(data => assert.equal(data[0].displayName, name));
        });

        it('should find an xbox account', () => {
            let name = chance.pickone(users.xbox.names);
            return client.search(DestinyApi.xbox, name)
                .then(data => assert.equal(data[0].displayName, name));
        });

        it('should return an empty array for no matches', () => {
            return client.search(DestinyApi.psn, 'this is not a username surely')
                .then(data => assert.equal(0, data.length));
        });

        it('the promise should fail if the request fails', done => {
            client.search(555, 'not a valid membership type')
                .then(ok => assert.fail('promise should not succeed'))
                .catch(err => done());
        });

    });

});
