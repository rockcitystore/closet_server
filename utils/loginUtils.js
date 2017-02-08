/**
 * 登录工具类
 *
 * Created by bar on 9/15/16.
 */
"use strict";

const config = require("../config");
const client = require('../database/redis');
const host_mod = require('../models/host_mod');
const logger = require("../utils/logger").getLogger('loginUtils');
const constant = require("../utils/constant");
const TOKEN_FLAG = "app_login_token_";// redistoken名字构造标记
const Promise = require('bluebird');

// 获取用户的登录信息
let getLoginInfo = (req, callback) => {
    return new Promise((resolve, reject) => {
        let authkey = req.headers["authkey"] || '';
        logger.debug(`${TOKEN_FLAG}${authkey}`);
        if (authkey && authkey.length > 0) {
            client.get(`${TOKEN_FLAG}${authkey}`)
                .then((value)=> {
                    if ((value == parseInt(value)) < 1 || value < 1) return reject({
                        result: false,
                        code: constant.AUTH_FAIL,
                        message: constant.msg.AUTH_FAIL
                    });
                    return host_mod.list({host_id: value})
                        .then((r)=> {
                            if ( r && r.body.length < 1) return reject({
                                result: false,
                                code: constant.AUTH_FAIL,
                                message: constant.msg.AUTH_FAIL
                            });
                            return resolve(value);
                        })

                })
                .catch((err) => {
                    logger.error('获取用户的登录信息 error :' + err.message);
                    logger.error(err);
                    return reject({result: false, code: constant.AUTH_FAIL, message: constant.msg.AUTH_FAIL})
                });
        } else {
            return reject({result: false, code: constant.AUTH_FAIL, message: constant.msg.AUTH_FAIL})
        }
    }).asCallback(callback);
};

// 校验是否内网
let isLan = (req, callback) => {
    return new Promise((resolve, reject) => {
        if (req.headers["authkey"] === '4zqfOeK4n0n&tA10XDGv#INh4*kGMuNn') {
            return resolve();
        } else {
            return reject({result: false, code: constant.AUTH_FAIL, message: constant.msg.AUTH_FAIL})
        }
    }).asCallback(callback);
};


module.exports = {
    getLoginInfo: getLoginInfo
    ,isLan: isLan
};



