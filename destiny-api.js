"use strict";

const _ = require('lodash');
const request = require('request-promise');

const uris = {
    "search": _.template('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/${membershipType}/${name}'),
    "account": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Summary'),
    "character": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}'),
    "activities": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}/Activities'),
    "activity-history": _.template('http://www.bungie.net/Platform/Destiny/Stats/ActivityHistory/${membershipType}/${membershipId}/${characterId}'),
    "carnage-report": _.template('http://www.bungie.net/Platform/Destiny/Stats/PostGameCarnageReport/${activityId}'),
    "inventory": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}/Inventory'),
    "progression": _.template('http://www.bungie.net/Platform/Destiny/${membershipType}/Account/${membershipId}/Character/${characterId}/Progression'),
    "equip": 'http://www.bungie.net/Platform/Destiny/EquipItem',
    "transfer-item": 'http://www.bungie.net/Platform/Destiny/TransferItem'
};

/**
 * Checks if a parameter object contains a minimum set of values.
 *
 * @param {object} parameters - the parameter object to check.
 * @param {Array} names - an array of keys to check for.
 */
function validate(parameters, names) {
    let missing = [];
    for (let key of names) {
        if (!parameters[key]) {
            missing.push(key);
        }
    }
    if (missing.length != 0) {
        throw new Error('Required parameters [' + missing.join(', ') + '] missing');
    }
}

/**
 * Handles the raw response from the Destiny API allowing successful responses data to
 * pass through, potentially trimmed base on the `fullResponse` property. Or properly
 * converts error responses into promise failures by throwing them.
 *
 * @param {object} response - the response from the bungie api.
 * @param {boolean} full - whether or not to return the full response for successful requests
 *                         or to return only the actual result data.
 */
function handle(response, full) {
    if (response.Response) {
        return (full)
            ? response
            : response.Response;
    }
    throw new Error('Failed response from the DestinyApi:\n' + JSON.stringify(response, null, 2));
}

class DestinyApi {

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.fullResponse = false;
    }

    /**
     * The membership type for PSN accounts.
     */
    static get psn() {
        return 2;
    }

    /**
     * The membership type for Xbox Live accounts.
     */
    static get xbox() {
        return 1;
    }

    /**
     * Performs a get request against an api uri.
     *
     * @param {string} uri - the uri to get from.
     * @param {object} queryString - an object containing key-value pairs to be placed in the query string.
     * @returns {Promise} a promise for the request result.
     */
    get(uri, queryString) {
        let options = {
            uri: uri,
            headers: {
                'x-api-key': this.apiKey,
            },
            json: true
        };
        if (queryString) {
            options.qs = queryString;
        }
        return request(options)
            .then(response => handle(response, this.fullResponse));
    }

    /**
     * Performs a post request against an api uri.
     *
     * @param {string} uri - the uri to post to.
     * @param {object} body - the object to place in the post body.
     * @returns {Promise} a promise for the request result.
     */
    post(uri, body) {
        return request({
            method: 'POST',
            uri: uri,
            body: body,
            headers: {
                'x-api-key': this.apiKey
            },
            json: true
        })
        .then(response => handle(response, this.fullResponse));
    }

    /**
     * Loads the details of a Destiny account
     *
     * @param membershipType - Which console network the account belongs to
     * @param membershipId - The bungie id for the account
     */
    account(membershipType, membershipId) {
        let parameters = {membershipType: membershipType, membershipId: membershipId};
        validate(parameters, ['membershipType', 'membershipId']);
        let uri = uris['account'](parameters);
        return this.get(uri);
    }

    /**
     * Loads all activities a character can participate in.
     *
     * @param membershipType - Which console network the account belongs to
     * @param membershipId - The bungie id for the account
     * @param characterId - the id for the character
     */
    activities(membershipType, membershipId, characterId) {
        let parameters = {membershipType: membershipType, membershipId: membershipId, characterId: characterId};
        validate(parameters, ['membershipType', 'membershipId', 'characterId']);
        let uri = uris['activities'](parameters);
        return this.get(uri);
    }

    /**
     * Loads the activity history for a character. The request has optional parameters:
     *
     * - count: the number of rows to return in the response.
     * - definitions: whether or not to include activity definitions in the response.
     * - mode: filters the characters history to return only a subset of activities, possible filters:
     *         None, Story, Strike, Raid, AllPvP, Patrol, AllPvE, PvPIntroduction, ThreeVsThree, Control,
     *         Lockdown, Team, FreeForAll, Nightfall, Heroic, AllStrikes, IronBanner, AllArena, Arena,
     *         ArenaChallenge, TrialsOfOsiris, Elimination, Rift, Mayhem, ZoneControl, Racing, Supremacy,
     *         PrivateMatchesAll
     * - page: a results page number to return, starting at 0.
     *
     * @param membershipType - Which console network the account belongs to
     * @param membershipId - The bungie id for the account
     * @param characterId - the id for the character
     * @param options - an object containing the optional parameters for the request.
     */
    activityHistory(membershipType, membershipId, characterId, options) {
        let parameters = {membershipType: membershipType, membershipId: membershipId, characterId: characterId};
        validate(parameters, ['membershipType', 'membershipId', 'characterId']);
        let uri = uris['activity-history'](parameters);
        options = _.defaults(options, {mode: 'None'});
        return this.get(uri, options);
    }

    /**
     * Loads the post-game carnage report for a particular activity
     *
     * @param activityId - The id of the activity to get the carnage report for
     */
    carnageReport(activityId) {
        let parameters = {activityId: activityId};
        validate(parameters, ['activityId']);
        let uri = uris['carnage-report'](parameters);
        return this.get(uri);
    }

    /**
     * Loads the details of a single character
     *
     * @param membershipType - Which console network the account belongs to
     * @param membershipId - The bungie id for the account
     * @param characterId - the id for the character
     */
    character(membershipType, membershipId, characterId) {
        let parameters = {membershipType: membershipType, membershipId: membershipId, characterId: characterId};
        validate(parameters, ['membershipType', 'membershipId', 'characterId']);
        let uri = uris['character'](parameters);
        return this.get(uri);
    }

    /**
     * Equip an item to a characters
     *
     * @param membershipType - Which console network the account belongs to
     * @param characterId - the id for the character in the account
     * @param itemId - the id of the item to equip
     */
    equip(membershipType, characterId, itemId) {
        let parameters = {membershipType: membershipType, characterId: characterId, itemId: itemId};
        validate(parameters, ['membershipType', 'characterId', 'itemId']);
        let uri = uris['equip'];
        return this.post(uri, parameters);
    }

    /**
     * Loads the item inventory for a character
     *
     * @param membershipType - Which console network the account belongs to
     * @param membershipId - The bungie id for the account
     * @param characterId - the id for the character
     */
    inventory(membershipType, membershipId, characterId) {
        let parameters = {membershipType: membershipType, membershipId: membershipId, characterId: characterId};
        validate(parameters, ['membershipType', 'membershipId', 'characterId']);
        let uri = uris['inventory'](parameters);
        return this.get(uri);
    }

    /**
     * Loads the progression details for a character
     *
     * @param membershipType - Which console network the account belongs to
     * @param membershipId - The bungie id for the account
     * @param characterId - the id for the character
     */
    progression(membershipType, membershipId, characterId) {
        let parameters = {membershipType: membershipType, membershipId: membershipId, characterId: characterId};
        validate(parameters, ['membershipType', 'membershipId', 'characterId']);
        let uri = uris['progression'](parameters);
        return this.get(uri);
    }

    /**
     * Searches for player accounts based on the username of the account
     *
     * @param membershipType - Which console network the account belongs to
     * @param name - The name of the account
     */
    search(membershipType, name) {
        let parameters = {membershipType: membershipType, name: name};
        validate(parameters, ['membershipType', 'name']);
        let uri = uris['search'](parameters);
        return this.get(uri);
    }

    /**
     *
     *
     * @param membershipType - Which console network the account belongs to
     * @param characterId - the id for the character in the account
     * @param itemId - the id of the item to transfer
     * @param itemReferenceHash - the reference hash of the item to transfer
     */
    transferItem(membershipType, characterId, itemId, itemReferenceHash) {
        let parameters = {membershipType: membershipType, characterId: characterId, itemId: itemId, itemReferenceHash: itemReferenceHash};
        validate(parameters, ['membershipType', 'characterId', 'itemId', 'itemReferenceHash']);
        let uri = uris['transfer-item'];
        return this.post(uri, parameters);
    }

}

module.exports = DestinyApi;
