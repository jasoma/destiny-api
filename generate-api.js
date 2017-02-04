"use strict";

const _ = require('lodash');
const dust = require('dustjs-linkedin');
const yaml = require('js-yaml');
const fs = require('fs');

let config = yaml.safeLoad(fs.readFileSync('endpoints.yml'));
console.log(config);

function jsMethodName(endpointName) {
    var nameParts = endpointName.split('-');
    if (nameParts.length == 1) {
        return endpointName;
    }
    else {
        nameParts = nameParts[0].concat(_.map(nameParts.slice(1), _.capitalize));
        return _.join(nameParts, '');
    }
}

function buildParameters(configParameters) {
    let parameters = [];
    for (let entry of configParameters) {
        let name = Object.keys(entry)[0];
        parameters.push({
            name: name,
            description: entry[name]
        });
    }
    return parameters;
}

class EnpointDefinition {

    constructor(root) {
        this.name = Object.keys(root)[0];
        let config = root[this.name];
        this.path = config.path;
        this.description = config.description;
        this.httpMethod = config.method;
        this.jsMethod = jsMethodName(this.name);
        this.parameters = buildParameters(config.parameters);
        this.parameterNames = _.map(this.parameters, 'name');
        this.parameterObject = _.map(this.parameterNames, n => `${n}: ${n}`);
        this.parameterObject = this.parameterObject.join(',\n            ')
        this.parameterNames = this.parameterNames.join(", ");
        this.parameterDocs = _.map(this.parameters, p => `@param ${p.name} - ${p.description}`)
        this.parameterDocs = this.parameterDocs.join('\n * ');
    }

}

const Template = require('./code-gen/template')
let methodTemplate = new Template('./code-gen/method.template.js')

for (let entry of config.endpoints) {

    let def = new EnpointDefinition(entry);
    def.host = config.host;
    let code = methodTemplate.render(def, true);
    fs.writeFileSync(`src/${def.name}.js`, code, 'utf-8');
}

