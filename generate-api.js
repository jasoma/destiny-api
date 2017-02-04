"use strict";

const _ = require('lodash');
const fs = require('fs');
const glob = require('glob');
const Template = require('./code-gen/template')
const endpoints = require('./code-gen/endpoints');

let methodTemplates = {
    get: new Template('./code-gen/get.template.js'),
    post: new Template('./code-gen/post.template.js'),
}

let config = endpoints.load('endpoints.yml');

for (let definition of config.endpoints) {
    let template = methodTemplates[definition.httpMethod];
    let code = template.render(definition);
    fs.writeFileSync(`build/${definition.name}.fragment`, code, 'utf-8');
}

let apiTemplate = new Template('./code-gen/destiny-api.template.js');
let uris = [];

for (let definition of config.endpoints) {
    if (definition.httpMethod === 'get') {
        uris.push(`"${definition.name}": _.template('${config.host + definition.path}')`);
    }
    else {
        uris.push(`"${definition.name}": '${config.host + definition.path}'`);
    }
}

uris = _.map(uris, u => '    ' + u);

let functions = glob.sync('./build/*.fragment');
functions = _.map(functions, path => fs.readFileSync(path, 'utf-8'));
functions = _.map(functions, code => {
    let lines = code.split('\n');
    lines = _.map(lines, l => '    ' + l);
    return lines.join('\n');
});


let api = apiTemplate.render({
    uriTemplates: uris.join(',\n'),
    functions: functions.join('\n')
});
fs.writeFileSync('./destiny-api.js', api, 'utf-8');
