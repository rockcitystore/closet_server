/**
 * Created by root on 2017/2/4.
 */
"use strict";

const fs = require('fs');
const constant = require("../utils/constant.js");
const logger = require("../utils/logger").getLogger(__filename.split("/").pop());
const Md5 = require("../utils/md5");
const Promise = require('bluebird');
const gm = require('gm'), imageMagick = gm.subClass({imageMagick: true}), exec = require('child_process').exec;
const fsUtils = require('../utils/fsUtils');
const os = require('os');
const Uuid = require("../utils/uuid");
const co = require('co');
const closetPath = process.env.NODE_ENV === 'PRD' ? '/opt/photos/' : '/Users/bar/Downloads/';
const im = require('imagemagick-stream');
const spawn = require('child_process').spawn;
let uploadClothing = (file, uid)=> {
    //todo 先暂存在os.temdir 直接返回文件名 然后异步任务处理图片
    if (!file || !uid) throw new Error(constant.msg.PARAMS_EMPTY);
    let st = new Date().getTime();
    let et2;
    return co(function *() {
        // logger.debug(file);
        if (file.mimeType in {
                "image/png": 0,
                "image/jpeg": 0,
                "image/x-png": 0,
                "image/bmp": 0
            }) {

            let photoDir = `${closetPath}closet/${uid}/`;
            let photoName = `${Uuid()}.png`;
            yield exist(photoDir);
            let et1 = new Date().getTime();
            logger.debug(`exist use: ${et1 - st}ms`);
            yield writePhoto(file, `${photoDir}${photoName}`);
            et2 = new Date().getTime();
            logger.debug(`writePhoto use: ${et2 - et1}ms`);
            return {code: constant.SUCCESS, body: photoName}
        } else {
            throw new Error(constant.msg.UPLOAD_TYPE_ERROR);
        }
    })

}

let writePhoto = (file, photo)=> {
    return new Promise((resolve, reject) => {
        let stream = fs.createWriteStream(photo);
        const imHandle = im().quality(90);
        file.pipe(imHandle).pipe(stream);
        return resolve();
    });

}

let exist = (dir) => {
    return new Promise((resolve, reject) => {
        try {
            fs.statSync(dir);
            return resolve();
        } catch (err) {
            if (err.code == 'ENOENT') {
                spawn(`mkdir`, [`${dir}`, '-p'])
                return resolve();
            }
            return reject(err)
        }
    });
}


let getImage = (fid, uid)=> {
    return new Promise((resolve, reject) => {
        try {
            let file = `${closetPath}closet/${uid}/${fid}`;
            let data = fs.createReadStream(file);
            return resolve(data);
        } catch (err) {
            return reject(err)
        }
    });
}
module.exports = {
    uploadClothing: uploadClothing,
    getImage: getImage
}