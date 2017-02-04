"use strict";

// const _ = require('lodash');
// const dust = require('dustjs-linkedin');
// const yaml = require('js-yaml');
// const fs = require('fs');

// let config = yaml.safeLoad(fs.readFileSync('endpoints.yml'));
// console.log(config);

// function jsMethodName(endpointName) {
//     var nameParts = endpointName.split('-');
//     if (nameParts.length == 1) {
//         return endpointName;
//     }
//     else {
//         nameParts = nameParts[0].concat(_.map(nameParts.slice(1), _.capitalize));
//         return _.join(nameParts, '');
//     }
// }

// function buildParameters(configParameters) {
//     let parameters = [];
//     for (let entry of configParameters) {
//         let name = Object.keys(entry)[0];
//         parameters.push({
//             name: name,
//             description: entry[name]
//         });
//     }
//     return parameters;
// }

// class EnpointDefinition {

//     constructor(root) {
//         this.name = Object.keys(root)[0];
//         let config = root[this.name];
//         this.path = config.path;
//         this.description = config.description;
//         this.httpMethod = config.method;
//         this.jsMethod = jsMethodName(this.name);
//         this.parameters = buildParameters(config.parameters);
//         this.parameterNames = _.map(this.parameters, 'name');
//         this.parameterObject = _.map(this.parameterNames, n => `${n}: ${n}`);
//         this.parameterObject = this.parameterObject.join(',\n            ')
//         this.parameterNames = this.parameterNames.join(", ");
//         this.parameterDocs = _.map(this.parameters, p => `@param ${p.name} - ${p.description}`)
//         this.parameterDocs = this.parameterDocs.join('\n * ');
//     }

// }
const fs = require('fs');
const Template = require('./code-gen/template')
const endpoints = require('./code-gen/endpoints');

let methodTemplates = {
    get: new Template('./code-gen/get.template.js'),
    post: new Template('./code-gen/post.template.js'),
}

let config = endpoints.load('endpoints.yml');

for (let definition of config.endpoints) {
    let template = methodTemplates[definition.httpMethod];
    let code = template.renderCode(definition);
    fs.writeFileSync(`build/${definition.name}.fragment`, code, 'utf-8');
}

