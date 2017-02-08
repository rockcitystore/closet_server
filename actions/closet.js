/**
 * Created by bar on 31/01/2017.
 */

'use strict';

const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger(__filename.split("/").pop());
const clothing_mod = require('../models/clothing_mod');
const co = require('co');
const util = require("util");
const Promise = require('bluebird');
// const loginUtils = require('../utils/loginUtils');
let v = '0.0.1';

/**
 * 获取直播室列表
 *
 * @param req
 * @param res
 */
let list = (ctx, next)=> {
    return co(function*() {
        let a = yield room_mod.list(ctx.request.query);
        ctx.body = a;
        return next();
    })
        .catch((err) => {
            logger.error('获取直播室列表 error :' + err.message);
            logger.error(err);
            ctx.body = {
                result: false,
                code: err.code || constant.RUNTIME_ERROR,
                msg: err.message || constant.msg.RUNTIME_ERROR
            };
            return next();
        });
};


/**
 * 获取特殊排序直播室列表
 *
 */
let special_list = (ctx, next)=> {
    return room_mod.special_list(ctx.request.query)
        .then((r)=> {
            ctx.body = r;
            return next();
        })
        .catch((err) => {
            logger.error('获取特殊排序直播室列表 error :' + err.message);
            logger.error(err);
            ctx.body = {
                result: false,
                code: err.code || constant.RUNTIME_ERROR,
                msg: err.message || constant.msg.RUNTIME_ERROR
            };
            return next();
        });
};

/**
 * 新增直播室
 *
 * @param req
 * @param res
 */
let add = (ctx, next)=> {
    let cb = {};
    return host_mod.list({host_id: ctx.request.body.host_id})
        .then((r)=> {
            if (r && r.body.length < 1) return Promise.reject({
                result: false,
                code: constant.AUTH_FAIL,
                message: constant.msg.AUTH_FAIL
            });
            return room_mod.add(ctx.request.body)
        })
        .then((r)=> {
            cb = r;
            if (r.code === constant.SUCCESS) {
                return setRoomInfos();
            } else {
                return Promise.reject(r)
            }
        })
        .then(()=> {
            ctx.body = cb;
            return next();
        })
        .catch((err) => {
            logger.error('新增直播室 error :' + err.message);
            logger.error(err);
            ctx.body = {
                result: false,
                code: err.code || constant.RUNTIME_ERROR,
                msg: err.message || constant.msg.RUNTIME_ERROR
            };
            return next();
        });
};

const brands = [{id: 0, name: '无'}, {id: 1, name: 'ZARA'}, {id: 2, name: 'H&M'}];
const types = [{id: 0, name: '无'}, {id: 1, name: '帽子'}, {id: 2, name: '眼镜'}, {id: 3, name: '耳环'}, {
    id: 4,
    name: '项链'
}, {id: 5, name: '围巾'}, {id: 6, name: '内衣'}, {id: 7, name: '上衣'}, {id: 8, name: '内裤'}, {id: 9, name: '裙子'}, {
    id: 10,
    name: '裤子'
}, {id: 11, name: '袜子'}, {id: 12, name: '鞋子'}];
const malls = [{id: 0, name: '无'}, {id: 1, name: '新百'}, {id: 2, name: '德基'}, {id: 3, name: '金轮'}, {
    id: 4,
    name: '中央'
}, {id: 5, name: '大洋'}, {id: 6, name: '水游城'}, {id: 7, name: '虹悦城'}];
let brand = (ctx, next)=> {
    ctx.body = {
        code: constant.SUCCESS,
        msg: constant.msg.SUCCESS,
        result: {v: v, brands: brands, types: types, malls: malls}
    };

    return next();
}
/**
 * 新增衣服
 *
 * @param req
 * @param res
 */
let addClothing = (ctx, next)=> {
    return co(function*() {
        ctx.body = yield clothing_mod.add(ctx.request.body)
        return next();
    })
        .catch((err) => {
            logger.error('新增衣服 error :' + err.message);
            logger.error(err);
            ctx.body = {
                result: false,
                code: err.code || constant.RUNTIME_ERROR,
                msg: err.message || constant.msg.RUNTIME_ERROR
            };
            return next();
        });
}

let editClothing = (ctx, next)=> {
}

module.exports = function (app) {
    app.get("/server/brand", brand);
    app.post("/server/clothing", addClothing);
    app.put("/server/clothing", editClothing);

};