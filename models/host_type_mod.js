/**
 * Created by bar on 8/2/16.
 */

'use strict';

const db = require("../database/db.js");
const constant = require("../utils/constant");
const logger = require("../utils/logger").getLogger('host_type_mod');
const Promise = require('bluebird');


var Mod = function () {
};


/**
 * 列表
 *
 * @param data
 * @param callback
 */
Mod.prototype.list = (data, callback) => {
    return new Promise((resolve, reject) => {
        let tem = [];
        let args = [];
        let sql = [`SELECT ${data.select || '*'} FROM host_type `];
        if (data.host_type_name && data.host_type_name.length > 0) {
            tem.push("host_type_name = ? ");
            args.push(data.host_type_name);
        }
        if (data.host_type_id >= 0) {
            tem.push("host_type_id = ? ");
            args.push(data.host_type_id);
        }
        if (tem.length > 0) {
            sql.push('WHERE ');
            sql.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }

        sql.push(`ORDER BY ${(data.order || "host_type_name")} ${(data.desc || "ASC")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`);
        db.execQuery_readonly({
            "sql": sql.join(''),
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                if (r.length < 1) return resolve({body: [], code: constant.SUCCESS});
                if (data.needLength == 1) {
                    db.execQuery_readonly({
                        "sql": sql,
                        "args": args,
                        "handler": (err, r1) => {
                            return resolve({body: r, length: r1.length, code: constant.SUCCESS});
                        }
                    })
                } else {
                    return resolve({body: r, code: constant.SUCCESS});
                }
            }
        });
    }).asCallback(callback);
};

/**
 * 新增
 *
 * @param data
 * @param callback
 */
Mod.prototype.add = (data, callback) => {
    return new Promise((resolve, reject) => {
        let args = [data.host_type_name];
        let sql = "insert into host_type (host_type_name) VALUES (?)";
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err && err.code != 'ER_DUP_ENTRY') return reject(err);
                if (err) return resolve({code: constant.EXISTS, msg: constant.msg.EXISTS,body:data});
                return resolve({code: constant.SUCCESS, body: r.insertId});
            }
        })
    }).asCallback(callback);
};

/**
 * 编辑
 *
 * @param data
 * @param callback
 */
Mod.prototype.edit = (data, callback) => {
    return new Promise((resolve, reject) => {
        let sql = "update host_type set ";
        let tem = [];
        let args = [];
        if (data.host_type_name && data.host_type_name.length > 0) {
            tem.push("host_type_name = ? ");
            args.push(data.host_type_name);
        }
        if (tem.length < 1)  return reject({code: constant.PARAMS_EMPTY, message: constant.msg.PARAMS_EMPTY});

        sql = `${sql}${tem.join(',')} WHERE host_type_id = ? `;
        args.push(data.host_type_id);
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err && err.code != 'ER_DUP_ENTRY') return reject(err);
                if (err) return resolve({code: constant.EXISTS, msg: constant.msg.EXISTS,body:data});
                return resolve({code: constant.SUCCESS});
            }
        });
    }).asCallback(callback);
};


/**
 * 删除
 *
 * @param data
 * @param callback
 */
Mod.prototype.del = (data, callback) => {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM host_type WHERE host_type_id = ?";
        db.execQuery({
            "sql": sql,
            "args": [data.host_type_id],
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({code: constant.SUCCESS});
            }
        });
    }).asCallback(callback);
};


module.exports = new Mod();





















