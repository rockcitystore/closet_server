"use strict";
let uploadService = require("../services/uploadService");
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger(__filename.split("/").pop());
const co = require('co');

//TODO
let uid = 1;

/**
 * 新衣服图片上传
 */
let uploadClothingPhoto = (ctx, next)=> {
    return co(function*() {
        ctx.body = yield uploadService.uploadClothing(ctx.req.files, uid);
        return next();
    })
        .catch((err) => {
            logger.error('新衣服图片上传 error :' + err.message);
            logger.error(err);
            ctx.body = {
                result: false,
                code: err.code || constant.RUNTIME_ERROR,
                msg: err.message || constant.msg.RUNTIME_ERROR
            };
            return next();
        });
}

/**
 * 查看图片
 */
let getImage = (ctx, next)=> {
    return co(function*() {
        ctx.body = yield uploadService.getImage(ctx.request.query.fid, uid);
        return next();
    })
        .catch((err) => {
            logger.error('查看图片 error :' + err.message);
            logger.error(err);
            ctx.body = {
                result: false,
                code: err.code || constant.RUNTIME_ERROR,
                msg: err.message || constant.msg.RUNTIME_ERROR
            };
            return next();
        });
}

module.exports = function (app) {
    app.post('/server/upload/clothing', uploadClothingPhoto)
    app.get('/server/upload/clothing', getImage)
};


