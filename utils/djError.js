"use strict";
const logger = require("../utils/logger").getLogger('djError');


var DjError = function (message, code) {
    this.name = 'DJ ERROR';
    this.code = code || -2;
    this.message = message || 'DJ ERROR Message';
    logger.error(this.message+ '\r\n' +(new Error()).stack);
}
DjError.prototype = Object.create(Error.prototype);
DjError.prototype.constructor = DjError;

module.exports = DjError;