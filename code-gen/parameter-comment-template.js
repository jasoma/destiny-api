"use strict";

const _ = require('lodash');

const baseTemplate = _.template(' * @param ${parameterName} - ${description}');
const requiredParameterName = _.template('parameters.${name}');
const optionalParameterName = _.template('[parameters.${name}]');
const defaultValueParameterName = _.template('[parameters.${name}=${defaultValue}]');

/**
 * Selects which of the name templates to use for a parameter.
 *
 * @param {object} parameter - the parameter being rendered to a JSDoc tag.
 * @returns {function} - the template function for the parameter name.
 */
function selectNameTemplate(parameter) {
    if (parameter.default) {
        return defaultValueParameterName;
    }
    if (!parameter.required) {
        return optionalParameterName;
    }
    return requiredParameterName;
}

/**
 * Converts a parameter definition from the yaml configuration into a JSDoc
 * parameter tag.
 *
 * @param {object} parameter - the parameter being rendered to a JSDoc tag.
 * @returns {string} - a comment line containing the tag.
 */
function renderTag(parameter) {
    let nameTemplate = selectNameTemplate(parameter);
    let name = nameTemplate(_.merge(parameter, {defaultValue: parameter.default}));
    return baseTemplate({
        parameterName: name,
        description: parameter.description
    });
}

module.exports = renderTag;
