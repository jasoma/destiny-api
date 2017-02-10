const assert = require('assert');
const _ = require('lodash');
const Promise = require('bluebird');

const DestinyApi = require('../destiny-api');

let users = require('./data/users');
let client = new DestinyApi(process.env.API_KEY);

describe('DestinyApi.accountSummary', () => {

    it('should load account details', () => {
        let account = users.random();
        return client.accountSummary(account)
            .then(response => {
                assert.ok(response);
                assert.ok(response.data);
            });
    });

});
