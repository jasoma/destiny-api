"use strict";

const _ = require('lodash');
const request = require('request-promise');

const template = _.template("${host}${path}");

/**
 * ${description}
 *
 * ${parameterDocs}
 */
function ${jsMethod}(apiKey, ${parameterNames}) {
    return request({
        uri: template({
            ${parameterObject}
        }),
        headers: {
            'x-api-key': apiKey
        },
        json: true
    });
}

module.exports = ${jsMethod};
