"use strict";

const acorn = require('acorn');
const astring = require('astring');
const astravel = require('astravel');

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
