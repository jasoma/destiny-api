"use strict";

/**
 * Re-exports the generated request classes as a single module.
 */

module.exports = {
    SearchRequest: require('./search-request'),
    ActivityHistoryRequest: require('./activity-history-request'),
    AccountSummaryRequest: require('./account-summary-request'),
    ActivitiesRequest: require('./activities-request')
};
