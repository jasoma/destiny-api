"use strict";

const _ = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');

class Parameters {

    constructor(parameters) {
        this.values = [];
        for (let entry of parameters) {
            let name = Object.keys(entry)[0];
            this.values.push({name: name, description: entry[name]});
        }
    }

    get names() {
        return _.map(this.values, 'name');
    }

    get namesList() {
        return this.names.join(', ');
    }

    get namesArray() {
        let quoted = _.map(this.names, n => `'${n}'`);
        return `[${quoted.join(', ')}]`;
    }

    get object() {
        let assignments = _.map(this.names, n => `${n}: ${n}`);
        return assignments.join(", ");
    }

    get docs() {
        let atParams = _.map(this.values, p => `@param ${p.name} - ${p.description}`);
        return atParams.join('\n * ');
    }
}

class EndpointDefinition {

    constructor(name, values) {
        this.name = name;
        this.path = values.path;
        this.description = values.description;
        this.httpMethod = values.method;
        this.parameters = new Parameters(values.parameters);
    }

    get jsMethod() {
        var nameParts = this.name.split('-');
        if (nameParts.length == 1) {
            return this.name;
        }
        else {
            nameParts = nameParts[0].concat(_.map(nameParts.slice(1), _.capitalize));
            return _.join(nameParts, '');
        }
    }
}

module.exports = {
    load: function (file) {
        let config = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
        let endpoints = []
        for (let entry of config.endpoints) {
            let name = Object.keys(entry)[0];
            endpoints.push(new EndpointDefinition(name, entry[name]));
        }
        return {
            host: config.host,
            endpoints: endpoints
        };
    }
};
