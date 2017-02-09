"use strict";

const _ = require('lodash');
const request = require('request-promise');
const requests = require('./requests/requests');

const bungieApiHost = 'http://www.bungie.net/Platform/Destiny/';

class DestinyApi {

    constructor(apiKey, host) {
        this.apiKey = apiKey;
        this.host = host || bungieApiHost;
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

    execute(request) {
        let promise = request.execute(this.host)
            .then(response => {
                if (!response.Response) {
                    let error = new Error('Error response from the destiny api');
                    _.assign(error, response);
                    throw error;
                }
                return response;
            });
        return (this.fullResponse)
            ? promise
            : promise.then(response => response.Response);
    }

    /**
     * Returns Destiny account information for the supplied membership in a compact summary form.
     */
    accountSummary(parameters) {
        let request = new requests.AccountSummaryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets activity history stats for indicated character.
     */
    activityHistory(parameters) {
        let request = new requests.ActivityHistoryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the set of Advisor data for the given account. This endpoint only returns advisors that are relevant on an account level, and will likely grow over time.
     */
    accountAdvisors(parameters) {
        let request = new requests.AccountAdvisorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the set of Advisor data for the given account and character.
     */
    characterAdvisors(parameters) {
        let request = new requests.CharacterAdvisorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns information about all items on the for the supplied Destiny Membership ID, and a minimal set of character information so that it can be used.
     */
    accountItems(parameters) {
        let request = new requests.AccountItemsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the set of Advisor data specific to Bonds between the given Account. The currently logged-in user must own this character with a Destiny account of the given Membership Type.
     */
    bondAdvisors(parameters) {
        let request = new requests.BondAdvisorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns all character information for the supplied character.
     */
    character(parameters) {
        let request = new requests.CharacterRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Loads all activities available to a character
     */
    characterActivities(parameters) {
        let request = new requests.CharacterActivitiesRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns summary information for the inventory for the supplied character.
     */
    characterInventory(parameters) {
        let request = new requests.CharacterInventoryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Provides the progression details for the supplied character.
     */
    characterProgression(parameters) {
        let request = new requests.CharacterProgressionRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns a character summary for the supplied membership.
     */
    characterSummary(parameters) {
        let request = new requests.CharacterSummaryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets all activities the character has participated in together with aggregate statistics for those activities.
     */
    aggregateStats(parameters) {
        let request = new requests.AggregateStatsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets a page list of Destiny items.
     */
    exploreItems(parameters) {
        let request = new requests.ExploreItemsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets a page list of Destiny talent node steps, ordered by the step name.
     */
    exploreTalentNodes(parameters) {
        let request = new requests.ExploreTalentNodesRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the current version of the manifest as a json object.
     */
    manifest(parameters) {
        let request = new requests.ManifestRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the specific item from the current manifest a json object.
     */
    manifestItem(parameters) {
        let request = new requests.ManifestItemRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets someone else's Grimoire.
     */
    accountGrimoire(parameters) {
        let request = new requests.AccountGrimoireRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets Grimoire definitions.
     */
    grimoire(parameters) {
        let request = new requests.GrimoireRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets historical stats for indicated character.
     */
    characterStats(parameters) {
        let request = new requests.CharacterStatsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets historical stats definitions.
     */
    statsDefinitions(parameters) {
        let request = new requests.StatsDefinitionsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets aggregate historical stats organized around each character for a given account.
     */
    accountStats(parameters) {
        let request = new requests.AccountStatsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Retrieve the details of a Destiny Item.
     */
    itemDetail(parameters) {
        let request = new requests.ItemDetailRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Retrieve the details of a conceptual Destiny Item that may be relevant to a character, but without referring to a specific instance of that item. There are some rare cases where noninstanced items may have character-relevant metadata, in which case you need to call this service. (ugh, I know. It annoys me too.)
     */
    itemReferenceDetail(parameters) {
        let request = new requests.ItemReferenceDetailRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the numerical id of a player based on their display name, zero if not found.
     */
    searchMembership(parameters) {
        let request = new requests.SearchMembershipRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets the available post game carnage report for the activity ID.
     */
    carnageReport(parameters) {
        let request = new requests.CarnageReportRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns public Advisor data - data that is common for all characters and accounts, and thus does not require login in order to access.
     */
    publicAdvisors(parameters) {
        let request = new requests.PublicAdvisorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Provides Record Book completion status for your Destiny account. Returned as a separate endpoint because it could have potentially sensitive information.
     */
    recordBookStatus(parameters) {
        let request = new requests.RecordBookStatusRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Provides Triumphs for a given Destiny account.
     */
    triumphs(parameters) {
        let request = new requests.TriumphsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets details about unique weapon usage, including all exotic weapons.
     */
    weaponHistory(parameters) {
        let request = new requests.WeaponHistoryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns summary information for the vault for the account of the given Membership Type. You must have an account linked for this membership type for it to work.
     */
    vaultSummary(parameters) {
        let request = new requests.VaultSummaryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns vendor data for the given character and vendor hash. The currently logged-in user must own this character with a Destiny account of the given Membership Type.
     */
    vendors(parameters) {
        let request = new requests.VendorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns vendor data for the given character and vendor hash, along with any secondary metadata for the vendor and their items. The currently logged-in user must own this character with a Destiny account of the given Membership Type.
     */
    vendorsMetadata(parameters) {
        let request = new requests.VendorsMetadataRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     *
     */
    vendorItem(parameters) {
        let request = new requests.VendorItemRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns vendor data for the given character and vendor hash. The currently logged-in user must own this character with a Destiny account of the given Membership Type. Includes various bits of interesting metadata that might not be useful for some.
     */
    vendorItemMetadata(parameters) {
        let request = new requests.VendorItemMetadataRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the set of vendor data for the given character. The currently logged-in user must own this character with a Destiny account of the given Membership Type.
     */
    vendorSummary(parameters) {
        let request = new requests.VendorSummaryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns a list of Destiny memberships given a full Gamertag or PSN ID.
     */
    search(parameters) {
        let request = new requests.SearchRequest(this.apiKey, parameters);
        return this.execute(request);
    }

}

module.exports = DestinyApi;
