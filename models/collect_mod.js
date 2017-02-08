/**
 * Created by bar on 8/11/16.
 */

'use strict';

const db = require("../database/db.js");
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger('collect_mod');
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
        let args = [];
        let tem = [];
        let sql = ['select * FROM collect WHERE '];
        if (data.mid >= 0) {
            tem.push("mid = ? ");
            args.push(data.mid);
        }
        if (data.host_id >= 0) {
            tem.push("host_id = ? ");
            args.push(data.host_id);
        }
        sql.push(tem.join((data.link || 'OR') + " "));//AND,OR);

        sql.push(`ORDER BY ${(data.order || "create_time")} ${(data.desc || "desc")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`);
        db.execQuery_readonly({
            "sql": sql.join(''),
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                if (r && r.length > 0) {
                    return resolve({body: r, code: constant.SUCCESS});
                } else {
                    return resolve({body: [], code: constant.SUCCESS});
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
    return new Promise(function (resolve, reject) {
        let sql = "INSERT INTO collect (mid,host_id,create_time) VALUES (?,?,NOW())";
        let args = [data.mid, data.host_id];
        let sql1 = "update host set host_fans = host_fans +1 where host_id = ?";
        let args1 = [data.host_id];
        db.transaction(
            {"sql": sql, "args": args},
            {
                "sql": sql1, "args": args1, "handler": function (err, r) {
                if (err && err.code != 'ER_DUP_ENTRY') return reject(err);
                if (err) return resolve({code: constant.EXISTS, msg: constant.msg.EXISTS, body: data});
                return resolve({code: constant.SUCCESS});
            }
            }
        );
    }).asCallback(callback);
};


/**
 * 删除
 *
 * @param data
 * @param callback
 */
Mod.prototype.del = (data, callback) => {
    return new Promise(function (resolve, reject) {
        let sql = "DELETE FROM collect WHERE host_id = ?";
        let args = [data.host_id];
        if (data.mid) {
            sql += "  AND mid = ? ";
            args.push(data.mid);
            let sql1 = "update host set host_fans = host_fans -1 where host_id = ? and host_fans > 0 ";
            let args1 = [data.host_id];
            db.transaction(
                {"sql": sql, "args": args},
                {
                    "sql": sql1, "args": args1, "handler": function (e, r) {
                    if (e) {
                        return reject(e);
                    }
                    return resolve({code: constant.SUCCESS});
                }
                }
            );
        } else {
            db.execQuery({
                "sql": sql,
                "args": args,
                "handler": (err, r) => {
                    if (err) return reject(err);
                    return resolve({code: constant.SUCCESS});
                }
            });
        }

    }).asCallback(callback);
};


module.exports = new Mod();
