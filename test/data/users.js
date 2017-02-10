"use strict";

/**
 * @file contains helper methods for loading sample user data to test the api client.
 */

const _ = require('lodash');
const fs = require('fs');
const chance = require('chance').Chance();
const DestinyApi = require('../../destiny-api');

const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));

for (let account of users) {
    account.randomCharacterId = function() {
        return chance.pickone(account.characterIds);
    };
}

module.exports = {

    all: users,

    random: function() {
        return chance.pickone(users);
    },

    randomPsn: function() {
        let psn = _.filter(users, u => u.membershipType === DestinyApi.psn);
        return chance.pickone(psn);
    },

    randomXbox: function() {
        let xbox = _.filter(users, u => u.membershipType === DestinyApi.xbox);
        return chance.pickone(xbox);
    }
}
