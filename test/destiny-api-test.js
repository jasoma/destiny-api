const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let chance = require('chance').Chance();
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi', function() {

    it('request promises should fail if the request fails', done => {
        client.searchPlayer({
            membershipType: 777,
            displayName: 'not a valid membership type'
        })
        .then(ok => {
            assert.fail('promise should not succeed');
            done();
        })
        .catch(err => done());
    });

    it('promise errors should contain the properties of the bungie error', done => {
        client.searchPlayer({
            membershipType: 777,
            displayName: 'not a valid membership type'
        })
        .then(ok => {
            done(new Error('promise should not succeed'));
        })
        .catch(err => {
            if (!err.ErrorCode) {
                done(new Error('propagated error did not contain the bungie error properties'));
            }
            else {
                done();
            }
        });
    });

});
