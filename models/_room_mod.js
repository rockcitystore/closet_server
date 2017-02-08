/**
 * Created by bar on 8/2/16.
 */

'use strict';

const db = require("../database/db.js");
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger('room_mod');
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
        let sql1 =[];
        if (data.host_name && data.host_name.length > 0) {
            tem.push("room_host.host_name = ? ");
            args.push(data.host_name);
        }
        if (data.host_id >= 0) {
            tem.push("room_host.host_id = ? ");
            args.push(data.host_id);
        }
        if (tem.length > 0) {
            sql1.push('WHERE ');
            sql1.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }

        let sql = `SELECT * FROM room,host,(SELECT * FROM room_host ${sql1.join('')}) AS a WHERE a.host_id = host.host_id AND a.room_id = room.room_id ORDER BY ${(data.order || "room.room_id")} ${(data.desc || "ASC")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`;
        db.execQuery_readonly({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                if (r.length < 1) return resolve({body: [], code: constant.SUCCESS});
                if (data.needLength == 1) {
                    db.execQuery_readonly({
                        "sql": sql,
                        "args": args,
                        "handler": (err, r1) => {
                            return resolve({body: r,length:r1.length,code: constant.SUCCESS});
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
        let args = [data.room_type_ids,data.room_name,data.room_location];
        let sql = "insert into room (room_type_ids,room_name,room_location,create_time) VALUES (?,?,?,NOW())";
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                var sql1 = "insert into room_host (room_id,host_id) VALUES (?,?)";
                let args1 = [r.insertId,data.host_id];
                db.execQuery({
                    "sql": sql1,
                    "args": args1,
                    "handler": (err1, r1) => {
                        if (err1) {
                            let sqlE = "DELETE FROM room WHERE room_id = ?";
                            db.execQuery({
                                "sql": sqlE,
                                "args": [r.insertId],
                                "handler": (err2, r2) => {
                                    if (err2) return reject(err2);
                                    return reject(err1);
                                }
                            });
                        }else{
                            return resolve({code: constant.SUCCESS,body:r.insertId});
                        }
                    }
                })
            }
        })
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
        let sql = "DELETE FROM room WHERE room_id = ?";
        db.execQuery({
            "sql": sql,
            "args": [data.room_id],
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({body: r, code: constant.SUCCESS});
            }
        });
    }).asCallback(callback);
};


module.exports = new Mod();





















