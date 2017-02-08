/**
 * Created by bar on 8/2/16.
 */

'use strict';

const db = require("../database/db.js");
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger('room_host_mod');
const Promise = require('bluebird');

var Mod = function () {
};



/**
 * 删除
 *
 * @param data
 * @param callback
 */
Mod.prototype.del = (data, callback) => {
    return new Promise((resolve, reject) => {
        let tem = [];
        let args = [];
        let sql = ["DELETE FROM room_host "];
        if (data.room_id >= 0) {
            tem.push("room_id = ? ");
            args.push(data.room_id);
        }
        if (data.host_id >= 0) {
            tem.push("host_id = ? ");
            args.push(data.host_id);
        }
        if (tem.length > 0) {
            sql.push('WHERE ');
            sql.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }
        db.execQuery({
            "sql": sql.join(','),
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({body: r, code: constant.SUCCESS});
            }
        });
    }).asCallback(callback);
};


module.exports = new Mod();





















