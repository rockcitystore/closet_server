/**
 * 表单验证
 *
 * Created by leovs on 2015/12/12
 */
'use strict'
const constant = require("./constant.js");
const util = require('util');
const xss = require('../utils/xss_whitelist');
const logger = require("../utils/logger").getLogger('validatorUtils');
const djError = require('../utils/djError');


/**
 * 长度范围
 *
 * @param str
 * @param start
 * @param end
 * @returns {*|boolean}
 */
exports.lenrange = function (str, start, end, allowEmpty) {
    if (str) {
        return (str && str.length >= start && str.length <= end);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否为邮箱
 * @param str
 * @returns {*|boolean}
 */
exports.isEmail = function (str, allowEmpty) {
    if (str) {
        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(str);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};


/**
 * 是否为手机号
 * @param str
 * @returns {*|boolean}
 */
exports.isPhone = function (str, allowEmpty) {
    if (str) {
        return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0-9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(str);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否为数字
 *
 * @param str
 * @returns {*|boolean}
 */
exports.isNumeric = function (str, allowEmpty) {
    if (str || str === 0) {
        return str && util.isNumber(str) && parseInt(str) >= 0;
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否是Json格式
 *
 * @param str
 * @returns {*}
 */
exports.isJson = function (str, allowEmpty) {
    if (str) {
        return JSON.parse(str) != null;
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否小于
 *
 * @param str
 * @returns {*}
 */
exports.LessThan = function (value, threshold, allowEmpty) {
    if (value) {
        return (value < threshold);
    } else if (value === 0) {
        return (value < threshold);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否小于等于
 *
 * @param str
 * @returns {*}
 */
exports.LessThanOrEqual = function (value, threshold, allowEmpty) {
    if (value) {
        return (value <= threshold);
    } else if (value === 0) {
        return (value <= threshold);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否等于
 *
 * @param str
 * @returns {*}
 */
exports.equalTo = function (value, threshold, allowEmpty) {
    if (value) {
        return (value === threshold);
    } else if (value === 0) {
        return (value === threshold);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否大于
 *
 * @param str
 * @returns {*}
 */
exports.GreaterThan = function (value, threshold, allowEmpty) {
    if (value) {
        return (value > threshold);
    } else if (value === 0) {
        return (value > threshold);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否大于等于
 *
 * @param str
 * @returns {*}
 */
exports.GreaterThanOrEqual = function (value, threshold, allowEmpty) {
    if (value) {
        return (value >= threshold);
    } else if (value === 0) {
        return (value >= threshold);
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};

/**值区间
 *
 * @param str
 * @returns {*}
 */
exports.valRange = function (value, min, max, allowEmpty) {
    if (value) {
        return (value >= min && value <= max );
    } else if (value === 0) {
        return (value >= min && value <= max );
    } else if (allowEmpty) {
        return true;
    } else {
        return false;
    }
};


/**
 * 验证表单
 *
 * @param forms
 * @param configs
 */
exports.validator = function (forms, configs, source) {
    for (var key in configs) {
        var config = configs[key];
        var form = forms[key];

        // 检查参数是否不允许为空 默认是可以为空
        var allowEmpty;
        if (config.empty === true || util.isUndefined(config.empty)) {
            allowEmpty = true;
        } else {
            allowEmpty = false;
        }
        switch (config.type) {
            case "email":
                if (!exports.isEmail(form, allowEmpty)) {
                    logger.debug('email : ' + key);
                    throw new djError(constant.msg.PARAMS_NOT_EMAIL, constant.PARAMS_NOT_EMAIL);
                }
                break;
            case "phone":
                if (!exports.isPhone(form, allowEmpty)) {
                    logger.debug('phone : ' + key);
                    throw new djError(constant.msg.PARAMS_NOT_PHONE, constant.PARAMS_NOT_PHONE);
                }
                break;
            case "number":
                var result = exports.isNumeric(form, allowEmpty);
                if (!result && typeof(result) == 'boolean') {
                    logger.debug('number : ' + key);
                    throw new djError(constant.msg.PARAMS_NOT_NUMBER, constant.PARAMS_NOT_NUMBER);
                }
                break;
            case "length":
                if (form && form.length > config.length) {
                    logger.debug('length : ' + key);
                    throw new djError(constant.msg.PARAMS_NOT_LENGTH, constant.PARAMS_NOT_LENGTH);
                }
                break;
            case "lenrange":
                if (!exports.lenrange(form, config.start, config.end, allowEmpty)) {
                    logger.debug('lenrange : ' + key);
                    throw new djError(key + ' ' + constant.msg.PARAMS_NOT_LENRANGE, constant.PARAMS_NOT_LENRANGE);
                }
                break;
            case "json":
                if (!exports.isJson(form, allowEmpty)) {
                    logger.debug('json : ' + key);
                    throw new djError(constant.msg.PARAMS_NOT_JSON, constant.PARAMS_NOT_JSON);
                }
                break;
            case "lessthan":
                if (!exports.LessThan(form, config.threshold, allowEmpty)) {
                    logger.debug('lessthan : ' + key);
                    throw new djError(constant.msg.VALUE_ERROR, constant.VALUE_ERROR);
                }
                break;
            case "lessthanorequal":
                if (!exports.LessThanOrEqual(form, config.threshold, allowEmpty)) {
                    logger.debug('lessthanorequal : ' + key);
                    throw new djError(constant.msg.VALUE_ERROR, constant.VALUE_ERROR);
                }
                break;
            case "equalto":
                if (!exports.equalTo(form, config.threshold, allowEmpty)) {
                    logger.debug('equalto : ' + key);
                    throw new djError(constant.msg.VALUE_ERROR, constant.VALUE_ERROR);
                }
                break;
            case "greaterthan":
                if (!exports.GreaterThan(form, config.threshold, allowEmpty)) {
                    logger.debug('greaterthan : ' + key);
                    throw new djError(constant.msg.VALUE_ERROR, constant.VALUE_ERROR);
                }
                break;
            case "greaterthanorequal":
                if (!exports.GreaterThanOrEqual(form, config.threshold, allowEmpty)) {
                    logger.debug('greaterthanorequal : ' + key);
                    throw new djError(constant.msg.VALUE_ERROR, constant.VALUE_ERROR);
                }
                break;
            case "valrange":
                if (!exports.valRange(form, config.min, config.max, allowEmpty)) {
                    logger.debug('valrange : ' + key);
                    throw new djError(constant.msg.VALRANGE_ERROR, constant.VALRANGE_ERROR);
                }
                break;
        }
    }
};

/**
 * 参数赋值
 *
 * @param params
 * @param query
 */
exports.query = function (params, query) {
    for (var key in params) {
        switch (typeof params[key]) {
            case "number":
                params[key] = Number(query[key]);
                break;
            case "string":
                //xss过滤
                params[key] = xss(query[key]);
                params[key] = params[key].replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
                break;
            case "boolean":
                params[key] = query[key] == "true";
                break;
            case "object":
                params[key] = JSON.parse(query[key]);
                break;
        }
    }
    return params;
};


