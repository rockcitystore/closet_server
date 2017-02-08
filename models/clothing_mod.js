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
        let sql = [`SELECT * FROM room `];
        if (data.host_name && data.host_name.length > 0) {
            tem.push("host_name = ? ");
            args.push(data.host_name);
        }
        if (data.host_id >= 0) {
            tem.push("host_id = ? ");
            args.push(data.host_id);
        }
        if (data.room_id >= 0) {
            tem.push("room_id = ? ");
            args.push(data.room_id);
        }
        if (data.status >= 0) {
            tem.push("room_status = ? ");
            args.push(data.status);
        }
        if (data.room_type_ids >= 0) {
            tem.push("room_type_ids = ? ");
            args.push(data.room_type_ids);
        }
        if (tem.length > 0) {
            sql.push('WHERE ');
            sql.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }

        sql.push(`ORDER BY ${(data.order || "room_id")} ${(data.desc || "ASC")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`);
        db.execQuery_readonly({
            "sql": sql.join(''),
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                if (r.length < 1) return resolve({body: [], code: constant.SUCCESS});
                if (data.needLength == 1) {
                    db.execQuery_readonly({
                        "sql": sql[0],
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
 * 特殊排序：直播中(按人数降序) > 回放和视频(按人数降序) > 按时间降序
 *
 * @param data
 * @param callback
 */
Mod.prototype.special_list = (data, callback) => {
    return new Promise((resolve, reject) => {
        let tem = [];
        let args = [];
        let sql = [`SELECT * FROM room `];
        if (data.host_name && data.host_name.length > 0) {
            tem.push("host_name = ? ");
            args.push(data.host_name);
        }
        if (data.host_id >= 0) {
            tem.push("host_id = ? ");
            args.push(data.host_id);
        }
        if (data.room_id >= 0) {
            tem.push("room_id = ? ");
            args.push(data.room_id);
        }
        if (data.status >= 0) {
            tem.push("room_status = ? ");
            args.push(data.status);
        }
        if (data.room_type_ids >= 0) {
            tem.push("room_type_ids = ? ");
            args.push(data.room_type_ids);
        }
        if (tem.length > 0) {
            sql.push('WHERE ');
            sql.push(tem.join((data.link || 'OR') + " "))//AND,OR;
        }

        sql.push(`ORDER BY ${(data.order || "room_id")} LIMIT ${((data.current - 1) * data.limit) < 0 ? 0 : ((data.current - 1) * data.limit || 0)},${data.limit < 1 ? 1 : (data.limit || 10000)}`);
        db.execQuery_readonly({
            "sql": sql.join(''),
            "args": args,
            "handler": (err, r) => {
                if (err) return reject(err);
                if (r.length < 1) return resolve({body: [], code: constant.SUCCESS});
                if (data.needLength == 1) {
                    db.execQuery_readonly({
                        "sql": sql[0],
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
 */
Mod.prototype.add = (data) => {
    return new Promise((resolve, reject) => {
        let sql = "insert into clothing (name,color,buy_time,price,brand_id,type,mall_id,user_id,intro,photo_url,create_time) VALUES (?,?,?,?,?,?,?,?,?,?,NOW())";
        let args = [data.name, data.color, data.buy_time, data.price, data.brand_id, data.type, data.mall_id, data.user_id, data.intro, data.photo_url];
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err && err.code != 'ER_DUP_ENTRY')
                    return reject(err.code);
                if (err)
                    return resolve({code: constant.EXISTS, msg: constant.msg.EXISTS, body: data});
                return resolve({code: constant.SUCCESS, body: r.insertId});
            }
        })

    });
};

/**
 * 编辑
 *
 * @param data
 * @param callback
 */
Mod.prototype.edit = (data, callback) => {
    return new Promise((resolve, reject) => {
        let sql = "update room set ";
        let tem = [];
        let args = [];
        if (data.room_type_ids && data.room_type_ids.length > 0) {
            tem.push("room_type_ids=? ");
            args.push(data.room_type_ids);
        }
        if (data.room_name && data.room_name.length > 0) {
            tem.push("room_name=? ");
            args.push(data.room_name);
        }
        if (data.room_location && data.room_location.length > 0) {
            tem.push("room_location=? ");
            args.push(data.room_location);
        }
        if (data.video_url && data.video_url.length > 0) {
            tem.push("video_url =? ");
            args.push(data.video_url);
        }
        if (data.room_pic && data.room_pic.length > 0) {
            tem.push("room_pic =? ");
            args.push(data.room_pic);
        }


        if (data.room_status >= 0) {
            tem.push("room_status =? ");
            args.push(data.room_status);
        }
        if (data.visitor_number >= 0) {
            tem.push("visitor_number =? ");
            args.push(data.visitor_number);
        }
        if (data.host_id >= 0) {
            tem.push("host_id =? ");
            args.push(data.host_id);
        }
        if (tem.length < 1)  return reject({code: constant.PARAMS_EMPTY, message: constant.msg.PARAMS_EMPTY});

        sql = `${sql}${tem.join(',')},update_time = NOW() WHERE room_id = ? `;
        args.push(data.room_id);
        db.execQuery({
            "sql": sql,
            "args": args,
            "handler": (err, r) => {
                if (err && err.code != 'ER_DUP_ENTRY') return reject(err);
                if (err) return resolve({code: constant.EXISTS, msg: constant.msg.EXISTS, body: data});
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
        let sql = "DELETE FROM room WHERE room_id = ?";
        db.execQuery({
            "sql": sql,
            "args": [data.room_id],
            "handler": (err, r) => {
                if (err) return reject(err);
                return resolve({code: constant.SUCCESS});
            }
        });
    }).asCallback(callback);
};


module.exports = new Mod();





















