"use strict";

/**
 * @file Generates request classes for each API endpoint defined in `code-gen/endpoints.yml`
 */

const _ = require('lodash');
const fs = require('fs');
const Template = require('./code-gen/template')
const endpoints = require('./code-gen/endpoints');

let parameterTemplate = new Template('code-gen/request-parameters.template.js');
let classTemplate = new Template('code-gen/request-class.template.js');
let config = endpoints('code-gen/endpoints.yml');

/**
 * Converts the hyphenated endpoint names from yaml into class names.
 *
 * @param {object} endpoint - the endpoint definition parsed from yaml.
 * @returns {string} - the class name to use for the endpoint.
 */
function className(endpoint) {
    var parts = endpoint.name.split('-');
    parts.push('Request');
    return _.map(parts, _.capitalize).join('');
}

/**
 * Cleans the parameter definitions for an endpoint, removing the description
 * field which is not used by the request code.
 *
 * @param {object} endpoint - the endpoint definition parsed from yaml.
 * *returns {Array} - a new array of parameter objects.
 */
function cleanParameters(endpoint) {
    return _.map(endpoint.parameters, p => _.omit(p, 'description'));
}

/**
 * Formats an object as JSON with newlines and indenting.
 */
function json(object) {
    return JSON.stringify(object, null, 2);
}

/**
 * Parses the endpoint definition file and creates a request class for each
 * endpoint.
 */
function generateClasses() {
    for (let definition of config) {
        let parameters = parameterTemplate.renderCode({
            parameters: json(cleanParameters(definition)),
            uriTemplate: definition.uriTemplate
        });
        let code = classTemplate.render({
            parameterTemplate: parameters,
            className: className(definition),
            httpMethod: definition.httpMethod
        });
        fs.writeFileSync(`requests/${definition.name}-request.js`, code, 'utf-8');
    }
}

generateClasses();