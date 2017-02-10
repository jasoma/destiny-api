/**
 * @file A pre-test script that fetches destiny account data for a set of users
 *       cherry picked from guardian.gg and saves a minimal set of their account
 *       data to test/data/users.json. This removes the need to perform account
 *       lookups as the first step in any endpoint test and drops the test time
 *       significantly (~3s per endpoint).
 */

let fs = require('fs');
let _ = require('lodash');
let Promise = require('bluebird');
let DestinyApi = require('../../destiny-api');

let client = new DestinyApi(process.env.API_KEY);
let names = ['strombane', 'WTFisPoshy', 'BITTERSTEEL', 'JuSTCallMeFroST', 'Qaa51mB', 'Minato'];

function loadAccount(name) {
    return client.searchPlayer({
        displayName: name,
        membershipType: 'All'
    })
    .then(response => {
        if (response.length < 1) {
            throw new Error("could not find player " + name);
        }
        return client.accountSummary({
            membershipType: response[0].membershipType,
            destinyMembershipId: response[0].membershipId
        });
    })
    .then(response => {
        response.data.displayName = name;
        return response.data;
    });
}

function simplifyAccount(account) {
    return {
        displayName: account.displayName,
        destinyMembershipId: account.membershipId,
        membershipType: account.membershipType,
        characterIds: _.map(account.characters, 'characterBase.characterId')
    };
}

Promise.all(_.map(names, loadAccount))
    .then(accounts => {
        let simple = _.map(accounts, simplifyAccount);
        let json = JSON.stringify(simple, null, 2);
        fs.writeFileSync(__dirname + '/users.json', json, 'utf-8');
        console.log('test accounts saved to test/data/users.json');
    })
    .catch(error => {
        console.log("account loading failed: " + error);
    });
