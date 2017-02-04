"use strict";

const _ = require('lodash');
const fs = require('fs');
const prettify = require('./prettify');

class Template {

    constructor(filePath) {
        let content = fs.readFileSync(filePath, 'utf-8');
        this.template = _.template(content);
    }

    render(context) {
        return this.template(context);
    }

    renderCode(context) {
        return prettify(this.template(context));
    }
}

module.exports = Template;
