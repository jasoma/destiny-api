"use strict";

const _ = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');

/**
 * Converts a parameters block from the configuration for an endpoint and turns
 * it into a parameter definition by applying default values and handling simple
 * parameter configurations that only contain the description.
 */
function readParameters(parametersBlock) {
    let defaults = {
        required: true,
        type: 'path',
    }

    let parameters = [];

    for (let name of Object.keys(parametersBlock)) {
        let values = parametersBlock[name];
        let definition = _.defaults({}, defaults);
        definition.name = name;

        // configuration contains only the parameter description
        if (_.isString(values)) {
            definition.description = values;

        // configuration contains multiple parameter configuration values.
        } else {
            _.assign(definition, values);
        }

        parameters.push(definition);
    }

    return parameters;
}

/**
 * Converts an endpoint definition block from the configuration
 * file.
 *
 * @param {string} name - the name of the endpoint from the configuration.
 * @param {object} values - the configuration values for the endpoint.
 * @returns {object} - an endpoint definition generated from the configuration.
 */
function readEndpoint(name, values) {
    let definition = { name: name };
    _.assign(definition, values);
    definition.parameters = readParameters(values.parameters);
    return definition;
}

/**
 * Loads an endpoints.yml file and converts cleans up the configuration
 * into endpoint and parameter definitions allowing for default values.
 *
 * @param {string} file - path to the .yml file.
 * @returns {Array} - an array of endpoint definitions.
 */
function load(file) {
    let config = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
    let endpoints = []
    for (let name of Object.keys(config)) {
        endpoints.push(readEndpoint(name, config[name]));
    }
    return endpoints;
}

module.exports = load;
