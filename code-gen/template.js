"use strict";

const _ = require('lodash');
const fs = require('fs');
const prettify = require('./prettify');

/**
 * Loads a file containing lodash template syntax and can render the contents
 */
class Template {

    /**
     * Create a new template from a file.
     *
     * @param {string} filePath - path the template file.
     */
    constructor(filePath) {
        let content = fs.readFileSync(filePath, 'utf-8');
        this.template = _.template(content);
    }

    /**
     * Render the template file to a string.
     *
     * @param {object} context - values to replace in the template.
     * @returns {string} - the rendered template.
     */
    render(context) {
        return this.template(context);
    }

    /**
     * Renders the template file to a string and then formats the result as
     * javascript code. This is done by first parsing the code into AST an
     * re-rendering it. Note that this will only work for valid javascript
     * code and the output will lose empty lines.
     *
     * @param {object} context - values to replace in the template.
     * @returns {string} - the rendered and formatted template.
     */
    renderCode(context) {
        return prettify(this.template(context));
    }
}

module.exports = Template;
