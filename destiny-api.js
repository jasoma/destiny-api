"use strict";

const _ = require('lodash');
const request = require('request-promise');
const requests = require('./requests/requests');

const bungieApiHost = 'http://www.bungie.net/Platform/Destiny/';

const _fullResponse = Symbol('fullResponse');

/**
 * Client for the Destiny API, all methods return promises for the request result.
 * Note that the Destiny API will return successful (i.e. status code 200) responses
 * for some request errors such as bad parameters or failed searches. Requests made
 * through this client will detect these cases and cause the promise to fail.
 *
 * @see {@link https://www.bungie.net/platform/destiny/help/|Official Bungie API Reference}
 */
class DestinyApi {

    /**
     * Create a new client.
     *
     * @param {string} apiKey - the api key for your application.
     * @param {string} [host=http://www.bungie.net/Platform/Destiny/] - the host to use for all requests, defaults to accessing
     *                                                                  the bungie api directly. To use a proxy provide the base
     *                                                                  path for all requests here.
     */
    constructor(apiKey, host) {
        this.apiKey = apiKey;
        this.host = host || bungieApiHost;
        this.fullResponse = false;
    }

    /**
     * Whether or not the client should strip api metadata, such as throttling information, from successful responses.
     */
    set fullResponse(val) {
        this[_fullResponse] = val;
    }

    get fullResponse() {
        return this[_fullResponse];
    }

    /**
     * The membership type for PSN accounts, may be used in any request that needs a membership type.
     */
    static get psn() {
        return 2;
    }

    /**
     * The membership type for Xbox Live accounts, may be used in any request that needs a membership type.
     */
    static get xbox() {
        return 1;
    }

    /**
     * Executes a request object using the host and api key defined on this client and handling
     * the response based on the `fullResponse` property.
     *
     * @param {object} request - the request object to execute.
     * @return {Promise} - a promise for the response.
     */
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
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fSummary%2f">GetAccountSummary</a>
     */
    accountSummary(parameters) {
        let request = new requests.AccountSummaryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets activity history stats for indicated character.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - The Destiny membershipId of the user to retrieve.
     * @param parameters.characterId - The id of the character to retrieve.
     * @param [parameters.count] - Number of rows to return
     * @param [parameters.page] - Page number to return, starting with 0.
     * @param [parameters.definitions] - True if activity definitions should be returned in response.
     * @param [parameters.mode=None] - filters the characters history to return only a subset of activities, possible filters:
      None, Story, Strike, Raid, AllPvP, Patrol, AllPvE, PvPIntroduction, ThreeVsThree, Control,
      Lockdown, Team, FreeForAll, Nightfall, Heroic, AllStrikes, IronBanner, AllArena, Arena,
      ArenaChallenge, TrialsOfOsiris, Elimination, Rift, Mayhem, ZoneControl, Racing, Supremacy,
      PrivateMatchesAll
    uses None if not specified which returns history for all activities

     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Stats%2fActivityHistory%2f%7bmembershipType%7d%2f%7bdestinyMembershipId%7d%2f%7bcharacterId%7d%2f">GetActivityHistory</a>
     */
    activityHistory(parameters) {
        let request = new requests.ActivityHistoryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the set of Advisor data for the given account. This endpoint only returns advisors that are relevant on an account level, and will likely grow over time.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fAdvisors%2f">GetAdvisorsForAccount</a>
     */
    accountAdvisors(parameters) {
        let request = new requests.AccountAdvisorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the set of Advisor data for the given account and character.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - The Character ID for which we want the Advisor.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fCharacter%2f%7bcharacterId%7d%2fAdvisors%2fV2%2f">GetAdvisorsForCharacterV2</a>
     */
    characterAdvisors(parameters) {
        let request = new requests.CharacterAdvisorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns information about all items on the for the supplied Destiny Membership ID, and a minimal set of character information so that it can be used.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fItems%2f">GetAccountItemsSummary</a>
     */
    accountItems(parameters) {
        let request = new requests.AccountItemsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Loads all activities available to a character
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - ID of the character.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fCharacter%2f%7bcharacterId%7d%2fActivities%2f">GetCharacterActivities</a>
     */
    characterActivities(parameters) {
        let request = new requests.CharacterActivitiesRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns summary information for the inventory for the supplied character.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - ID of the character.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fCharacter%2f%7bcharacterId%7d%2fInventory%2fSummary%2f">GetCharacterInventorySummary</a>
     */
    characterInventory(parameters) {
        let request = new requests.CharacterInventoryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Provides the progression details for the supplied character.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - ID of the character.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fCharacter%2f%7bcharacterId%7d%2fProgression%2f">GetCharacterProgression</a>
     */
    characterProgression(parameters) {
        let request = new requests.CharacterProgressionRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns a character summary for the supplied membership.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - ID of the character.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fCharacter%2f%7bcharacterId%7d%2f">GetCharacterSummary</a>
     */
    characterSummary(parameters) {
        let request = new requests.CharacterSummaryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets all activities the character has participated in together with aggregate statistics for those activities.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - The specific character whose activities should be returned.
     * @param [parameters.definitions] - Client would like activity definition returned in response.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Stats%2fAggregateActivityStats%2f%7bmembershipType%7d%2f%7bdestinyMembershipId%7d%2f%7bcharacterId%7d%2f">GetDestinyAggregateActivityStats</a>
     */
    aggregateStats(parameters) {
        let request = new requests.AggregateStatsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets a page list of Destiny items.
     *
     * @param parameters - the parameters to pass in the request.
     * @param [parameters.definitions] - Indicates the item definitions should be returned with item hash results.
     * @param [parameters.sourcecat] - Items must drop from the specified source category, omit for all items. Use Vendor or Activity.
     * @param [parameters.categories] - Category identifiers. Only items that are in all of the passed-in categories will be returned.
     * @param [parameters.weaponPerformance] - Items must have node steps in one of these categories, omit for all items. RateOfFire, Damage, Accuracy, Range, Zoom, Recoil, Ready, Reload, HairTrigger, AmmoAndMagazine, TrackingAndDetonation, ShotgunSpread, ChargeTime
     * @param [parameters.rarity] - Rarity of items to return: Currency, Basic, Common, Rare, Superior, Exotic. Omit for all items.
     * @param [parameters.sourceHash] - Items must drop from the specified source, omit for all items. Overrides sourcecat.
     * @param [parameters.damageTypes] - Items must have node steps in one of these categories, omit for all items. Kinetic, Arc, Solar, Void
     * @param [parameters.impactEffects] - Items must have node steps in one of these categories, omit for all items. ArmorPiercing, Ricochet, Flinch, CollateralDamage, Disorient, HighlightTarget
     * @param [parameters.guardianAttributes] - Items must have node steps in one of these categories, omit for all items. Stats, Shields, Health, Revive, AimUnderFire, Radar, Invisibility, Reputations
     * @param [parameters.lightAbilities] - Items must have node steps in one of these categories, omit for all items. Grenades, Melee, MovementModes, Orbs, SuperEnergy, SuperMods
     * @param [parameters.matchrandomsteps] - True if the supplied groups/step hash filters should match random node steps. False indicates the item can always get the step before it is considered a match.
     * @param [parameters.step] - Hash ID of the talent node step that an item must have in order to be returned.
     * @param [parameters.count] - Number of rows to return. Use 10, 25, 50, 100, or 500.
     * @param [parameters.page] - Page number to return, starting with 0.
     * @param [parameters.name] - Name of items to return (partial match, no case). Omit for all items.
     * @param [parameters.order] - Item property used for sorting. Use Name, ItemType, Rarity, ItemTypeName, ItemStatHash, MinimumRequiredLevel, MaximumRequiredLevel.
     * @param [parameters.orderstathash] - This value is used when the order parameter is set to ItemStatHash. The item stat for the provided hash value will be used in the sort.
     * @param [parameters.direction] - Order to sort items: Ascending or Descending
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Explorer%2fItems%2f">GetDestinyExplorerItems</a>
     */
    exploreItems(parameters) {
        let request = new requests.ExploreItemsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets a page list of Destiny talent node steps, ordered by the step name.
     *
     * @param parameters - the parameters to pass in the request.
     * @param [parameters.definitions] - Indicates the step definitions should be returned with item hash results.
     * @param [parameters.page] - Page number to return, starting with 0.
     * @param [parameters.direction] - Order to sort steps (by name): Ascending or Descending
     * @param [parameters.name] - Name of items to return (partial match, no case). Omit for all items.
     * @param [parameters.count] - Number of rows to return. Use 10, 25, 50, 100, 500
     * @param [parameters.impactEffects] - Node steps in one of these categories, omit for all steps. ArmorPiercing, Ricochet, Flinch, CollateralDamage, Disorient, HighlightTarget
     * @param [parameters.weaponPerformance] - Node steps in one of these categories, omit for all steps. RateOfFire, Damage, Accuracy, Range, Zoom, Recoil, Ready, Reload, HairTrigger, AmmoAndMagazine, TrackingAndDetonation, ShotgunSpread, ChargeTime
     * @param [parameters.guardianAttributes] - Node steps in one of these categories, omit for all steps. Stats, Shields, Health, Revive, AimUnderFire, Radar, Invisibility, Reputations
     * @param [parameters.lightAbilities] - Node steps in one of these categories, omit for all steps. Grenades, Melee, MovementModes, Orbs, SuperEnergy, SuperMods
     * @param [parameters.damageTypes] - Node steps in one of these categories, omit for all steps. Kinetic, Arc, Solar, Void
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Explorer%2fTalentNodeSteps%2f">GetDestinyExplorerTalentNodeSteps</a>
     */
    exploreTalentNodes(parameters) {
        let request = new requests.ExploreTalentNodesRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the current version of the manifest as a json object.
     *
     * @param parameters - the parameters to pass in the request.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Manifest%2f">GetDestinyManifest</a>
     */
    manifest(parameters) {
        let request = new requests.ManifestRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the specific item from the current manifest a json object.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.type - The type of definition to return.
     * @param parameters.id - The hash ID of the definition instance.
     * @param [parameters.version] - The version of content to be returned, if that version exists. No, you can't look into the future by changing this, it doesn't exist. Nice try though.
     * @param [parameters.definitions] - If true, related definitions will be returned.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Manifest%2f%7btype%7d%2f%7bid%7d%2f">GetDestinySingleDefinition</a>
     */
    manifestItem(parameters) {
        let request = new requests.ManifestItemRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets someone else's Grimoire.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid membership type.
     * @param parameters.membershipId - The membershipId of the user to retrieve.
     * @param [parameters.definitions] - Indicates the card definition should be returned when player data
     * @param [parameters.flavour] - Indicates flavour stats should be included with player card data.
     * @param [parameters.single] - Indicates data for a single card should be returned.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Vanguard%2fGrimoire%2f%7bmembershipType%7d%2f%7bmembershipId%7d%2f">GetGrimoireByMembership</a>
     */
    accountGrimoire(parameters) {
        let request = new requests.AccountGrimoireRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets Grimoire definitions.
     *
     * @param parameters - the parameters to pass in the request.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Vanguard%2fGrimoire%2fDefinition%2f">GetGrimoireDefinition</a>
     */
    grimoire(parameters) {
        let request = new requests.GrimoireRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets historical stats for indicated character.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - The Destiny membershipId of the user to retrieve.
     * @param parameters.characterId - The id of the character to retrieve. You can omit this character ID or set it to 0 to get aggregate stats across all characters.
     * @param [parameters.monthstart] - First month to return when monthly stats are requested. Use the format YYYY-MM.
     * @param [parameters.monthend] - Last month to return when monthly stats are requested. Use the format YYYY-MM.
     * @param [parameters.daystart] - First day to return when daily stats are requested. Use the format YYYY-MM-DD
     * @param [parameters.dayend] - Last day to return when daily stats are requested. Use the format YYYY-MM-DD.
     * @param [parameters.periodType] - Indicates a specific period type to return. Optional. May be: Daily, Monthly, AllTime, or Activity
     * @param [parameters.modes] - Game modes to return. Values: None, Story, Strike, Raid, AllPvP, Patrol, AllPvE, PvPIntroduction, ThreeVsThree, Control, Lockdown, Team, FreeForAll, Nightfall, Heroic, AllStrikes, IronBanner, AllArena, Arena, ArenaChallenge, TrialsOfOsiris, Elimination, Rift, Mayhem, ZoneControl, Racing, Supremacy, PrivateMatchesAll
     * @param [parameters.groups] - Group of stats to include, otherwise only general stats are returned. Comma separated list is allowed. Values: General, Weapons, Medals, Enemies
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Stats%2f%7bmembershipType%7d%2f%7bdestinyMembershipId%7d%2f%7bcharacterId%7d%2f">GetHistoricalStats</a>
     */
    characterStats(parameters) {
        let request = new requests.CharacterStatsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets historical stats definitions.
     *
     * @param parameters - the parameters to pass in the request.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Stats%2fDefinition%2f">GetHistoricalStatsDefinition</a>
     */
    statsDefinitions(parameters) {
        let request = new requests.StatsDefinitionsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets aggregate historical stats organized around each character for a given account.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param [parameters.groups] - Groups of stats to include, otherwise only general stats are returned. Comma separated list is allowed. Values: General, Weapons, Medals, Enemies.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Stats%2fAccount%2f%7bmembershipType%7d%2f%7bdestinyMembershipId%7d%2f">GetHistoricalStatsForAccount</a>
     */
    accountStats(parameters) {
        let request = new requests.AccountStatsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Retrieve the details of a Destiny Item.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - The specific character whose activities should be returned.
     * @param parameters.itemInstanceId - The Instance ID of the destiny item. Not the Reference ID, pay attention.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fCharacter%2f%7bcharacterId%7d%2fInventory%2f%7bitemInstanceId%7d%2f">GetItemDetail</a>
     */
    itemDetail(parameters) {
        let request = new requests.ItemDetailRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Retrieve the details of a conceptual Destiny Item that may be relevant to a character, but without referring to a specific instance of that item. There are some rare cases where noninstanced items may have character-relevant metadata, in which case you need to call this service. (ugh, I know. It annoys me too.)
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - The specific character whose activities should be returned.
     * @param parameters.itemHash - The *hash* (i.e. item reference ID) of the item, and *not* a specific instance ID.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fCharacter%2f%7bcharacterId%7d%2fItemReference%2f%7bitemHash%7d%2f">GetItemReferenceDetail</a>
     */
    itemReferenceDetail(parameters) {
        let request = new requests.ItemReferenceDetailRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns the numerical id of a player based on their display name, zero if not found.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.displayName - A display name meeting the parameters of display names for the specified membership type (i.e., a gamertag, or a PSN Id)
     * @param parameters.membershipType - A valid non-BungieNet membership type, or All.
     * @param [parameters.ignorecase] - Default is false when not specified. True to cause a caseless search to be used.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fStats%2fGetMembershipIdByDisplayName%2f%7bdisplayName%7d%2f">GetMembershipIdByDisplayName</a>
     */
    searchMembership(parameters) {
        let request = new requests.SearchMembershipRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets the available post game carnage report for the activity ID.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.activityId - The ID of the activity whose PGCR is requested.
     * @param [parameters.definitions] - Client would like activity and weapon definitions returned in response.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Stats%2fPostGameCarnageReport%2f%7bactivityId%7d%2f">GetPostGameCarnageReport</a>
     */
    carnageReport(parameters) {
        let request = new requests.CarnageReportRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns public Advisor data - data that is common for all characters and accounts, and thus does not require login in order to access.
     *
     * @param parameters - the parameters to pass in the request.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Advisors%2fV2%2f">GetPublicAdvisorsV2</a>
     */
    publicAdvisors(parameters) {
        let request = new requests.PublicAdvisorsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Provides Triumphs for a given Destiny account.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param [parameters.definitions] - If False, will not return definition information.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=%7bmembershipType%7d%2fAccount%2f%7bdestinyMembershipId%7d%2fTriumphs%2f">GetTriumphs</a>
     */
    triumphs(parameters) {
        let request = new requests.TriumphsRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Gets details about unique weapon usage, including all exotic weapons.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.membershipType - A valid non-BungieNet membership type.
     * @param parameters.destinyMembershipId - Destiny membership ID.
     * @param parameters.characterId - The id of the character to retrieve.
     * @param [parameters.definitions] - True if item definitions should be returned in response.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=Stats%2fUniqueWeapons%2f%7bmembershipType%7d%2f%7bdestinyMembershipId%7d%2f%7bcharacterId%7d%2f">GetUniqueWeaponHistory</a>
     */
    weaponHistory(parameters) {
        let request = new requests.WeaponHistoryRequest(this.apiKey, parameters);
        return this.execute(request);
    }

    /**
     * Returns a list of Destiny memberships given a full Gamertag or PSN ID.
     *
     * @param parameters - the parameters to pass in the request.
     * @param parameters.displayName - The full gamertag or PSN id of the player. Spaces and case are ignored.
     * @param parameters.membershipType - A valid non-BungieNet membership type, or All.
     * @see <a href="https://www.bungie.net/platform/destiny/help/HelpDetail/GET?uri=SearchDestinyPlayer%2f%7bmembershipType%7d%2f%7bdisplayName%7d%2f">SearchDestinyPlayer</a>
     */
    searchPlayer(parameters) {
        let request = new requests.SearchPlayerRequest(this.apiKey, parameters);
        return this.execute(request);
    }


}

module.exports = DestinyApi;
