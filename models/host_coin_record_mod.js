/**
 * Created by bar on 8/2/16.
 */

'use strict';

const db = require("../database/db.js");
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger(__filename.split("/").pop());
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
        let sql = [`SELECT ${data.select || '*'} FROM host_coin_record `];

        if (data.where.length) {
            tem.push(data.where);
            args.push(data.whereCont);
            sql.push('WHERE ');
            sql.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }

        sql.push(`ORDER BY ${(data.order || "create_time")} ${(data.desc || "ASC")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`);
        db.execQuery_readonly({
            "sql": sql.join(''),
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                if (r.length < 1) return resolve({body: [], code: constant.SUCCESS});
                    return resolve({body: r, code: constant.SUCCESS});
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
        let args = [data.hostId, data.mid, data.roomId, data.coinValue, data.dejiCoin];
        let sql = "insert into host_coin_record (host_id,mid,room_id,deji_coin_value,deji_coin,create_time) VALUES (?,?,?,?,?,NOW())";
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({code: constant.SUCCESS, body: r.insertId});
            }
        })
    }).asCallback(callback);
};


module.exports = new Mod();





















