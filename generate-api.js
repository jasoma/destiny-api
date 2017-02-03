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

const acorn = require('acorn');
const astring = require('astring');
const astravel = require('astravel');

function prettify(code) {
    var comments = [];
    let ast = acorn.parse(code, {
        ecmaVersion: 6,
        locations: true,
        onComment: comments
    });
    astravel.attachComments(ast, comments);
    return astring(ast, {
        indent: '    ',
        lineEnd: '\n',
        comments: true
    });
}

let functionTemplate = fs.readFileSync('code-gen/api-method.template.js', 'utf-8');

for (let entry of config.endpoints) {

    let def = new EnpointDefinition(entry);
    def.host = config.host
    let outputLines = [];

    for (let line of functionTemplate.split("\n")) {
        let lineTemplate = _.template(line);
        outputLines.push(lineTemplate(def));
    }

    let code = outputLines.join('\n');
    fs.writeFileSync(`src/${def.name}.js`, code, 'utf-8');
}

