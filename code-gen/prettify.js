"use strict";

const acorn = require('acorn');
const astring = require('astring');
const astravel = require('astravel');

/**
 * Pretty-prints javascript code fragments by first parsing it with acorn and
 * then rendering it with astring.
 *
 * @param {string} code - the code to format.
 * @param {string} indent - a string to use when indenting the output code.
 */
function prettify(code, indent) {
    if (!indent) {
        indent = '    ';
    }
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

module.exports = prettify;
