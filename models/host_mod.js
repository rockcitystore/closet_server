/**
 * Created by bar on 8/2/16.
 */

'use strict';

const db = require("../database/db.js");
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger('host_mod');
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
        let sql = [`SELECT ${data.select || '*'} FROM host `];
        if (data.host_name && data.host_name.length > 0) {
            tem.push("host_name = ? ");
            args.push(data.host_name);
        }
        if (data.host_id >= 0) {
            tem.push("host_id = ? ");
            args.push(data.host_id);
        }
        if (data.host_type_ids) {
            tem.push("host_type_ids like ? ");
            args.push("%" + data.host_type_ids + "%");
        }
        if (tem.length > 0) {
            sql.push('WHERE ');
            sql.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }

        sql .push(`ORDER BY ${(data.order || "host_id")} ${(data.desc || "ASC")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`);
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
        let args = [data.host_id,data.host_type_ids, data.host_intro];
        let sql = "insert into host (host_id,host_type_ids,host_intro,create_time) VALUES (?,?,?,NOW())";
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({code: constant.SUCCESS, body: data.host_id});
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
        let sql = "update host set ";
        let tem = [];
        let args = [];
        if (data.host_type_ids && data.host_type_ids.length > 0) {
            tem.push("host_type_ids=? ");
            args.push(data.host_type_ids);
        }
        if (data.host_intro && data.host_intro.length > 0) {
            tem.push("host_intro=? ");
            args.push(data.host_intro);
        }
        if (data.host_fans == -1 || data.host_fans == 1) {
            tem.push(" host_fans = host_fans + ? ");
            args.push(data.host_fans);
        }
        if (tem.length < 1)  return reject({code: constant.PARAMS_EMPTY, message: constant.msg.PARAMS_EMPTY});

        sql = `${sql}${tem.join(',')},update_time = NOW() WHERE host_id = ? `;
        args.push(data.host_id);
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
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
        let sql = "DELETE FROM host WHERE host_id = ?";
        db.execQuery({
            "sql": sql,
            "args": [data.host_id],
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({code: constant.SUCCESS});
            }
        });
    }).asCallback(callback);
};


module.exports = new Mod();





















