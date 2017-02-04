"use strict";

const _ = require('lodash');
const request = require('request-promise');

const template = _.template("${host}${path}");

${code}

module.exports = ${jsMethod};
