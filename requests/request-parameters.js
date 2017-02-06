"use strict";

const _ = require('lodash');

/**
 * Contains a description of the parameters required for an API request.
 */
class RequestParameters {

    /**
     * Constructor.
     *
     * @param {ParametersDefinition} parameters - the configuration of the request parameters.
     */
    constructor(definition) {
        this.required = new Set();
        this.pathParams = new Set();
        this.queryParams = new Set();
        this.bodyParams = new Set();
        this.defaultValues = {};

        for (let parameter of definition) {
            if (parameter.required) {
                this.required.add(parameter.name);
            }
            if (parameter.default) {
                this.defaultValues[parameter.name] = parameter.default;
            }
            switch(parameter.type) {
                case 'query':
                    this.queryParams.add(parameter.name);
                    break;
                case 'body':
                    this.bodyParams.add(parameter.name);
                    break;
                case 'path':
                    this.pathParams.add(parameter.name);
                    break;
                default:
                    throw new Error(`unknown parameter type ${parameter.type}`);
            }
        }
    }

    /**
     * Checks that an object contains all the required parameters.
     *
     * @param {object} parameters - the object to check.
     * @returns {Error} - if validation fails an error object will be returned.
     */
    validate(parameters) {
        let missing = [];
        for (let name of this.required) {
            let value = parameters[name];
            if (_.isUndefined(value) || _.isNull(value)) {
                missing.push(name);
            }
        }
        if (missing.length != 0) {
            return new Error(`Required parameter(s) [${missing.join('. ')}] missing`);
        }
        return null;
    }

    /**
     * Creates a new parameters object with any default values already assigned.
     *
     * @returns {object} - the created parameters object.
     */
    defaults() {
        return _.defaults({}, this.defaultValues);
    }

    /**
     * Converts a flat parameters object into a structured options object by assigning parameters
     * into query/path/body sub-objects depending on the definition of that parameter.
     *
     * @param {object} parameters - the parameters object to convert.
     * @return {object} - an object with the parameters divided into query/path/body as appropriate.
     */
    buildOptions(parameters) {
        let options = {
            query: {},
            path: {},
            body: {}
        };
        for (let key of Object.keys(parameters)) {
            if (this.queryParams.has(key)) {
                options.query[key] = parameters[key];
            }
            else if (this.pathParams.has(key)) {
                options.path[key] = parameters[key];
            }
            else if (this.bodyParams.has(key)) {
                options.body[key] = parameters[key];
            }
        }
        return options;
    }

}

module.exports = RequestParameters;
