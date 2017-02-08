/**
 * Created by bar on 8/2/16.
 */

'use strict';

const db = require("../database/db.js");
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger('host_item_mod');
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
        let sql = [`SELECT ${data.select || '*'} FROM host_item `];
        if (data.host_id >= 0) {
            tem.push("host_id = ? ");
            args.push(data.host_id);
        }
        if (data.isRecommend >= 0) {
            tem.push("isRecommend = ? ");
            args.push(data.isRecommend);
        }
        if (tem.length > 0) {
            sql.push('WHERE ');
            sql.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }

        sql.push(`ORDER BY ${(data.order || "create_time")} ${(data.desc || "DESC")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`);
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
        let args = [data.host_id, data.item_detail_id];
        let sql = "insert into host_item (host_id,item_detail_id,create_time) VALUES (?,?,NOW())";
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err && err.code != 'ER_DUP_ENTRY') return reject(err);
                if (err) return resolve({code: constant.EXISTS, msg: constant.msg.EXISTS, body: data});
                return resolve({code: constant.SUCCESS});
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
        let args = [data.isRecommend, data.host_id, data.item_detail_id];
        let sql = "update host_item set isRecommend = ? where host_id = ? and item_detail_id = ?";
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err)
                    return reject(err);
                return resolve({code: constant.SUCCESS});
            }
        })
    }).asCallback(callback);
};

/**
 /**
 * 删除
 *
 * @param data
 * @param callback
 */
Mod.prototype.del = (data, callback) => {
    return new Promise((resolve, reject) => {
        let sql = "DELETE FROM host_item WHERE item_detail_id = ? AND host_id = ?";
        db.execQuery({
            "sql": sql,
            "args": [data.item_detail_id, data.host_id],
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({code: constant.SUCCESS});
            }
        });
    }).asCallback(callback);
};


module.exports = new Mod();





















