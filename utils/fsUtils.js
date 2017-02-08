/**
 * Created by root on 4/25/16.
 */

var constant = require("../utils/constant.js");
var fs = require('fs');
var exec = require('child_process').exec;
var multipart = require('connect-multiparty');
var logger = require("../utils/logger").getLogger('fsUtils');
var multipartMiddleware = multipart({
    //uploadDir:"" //上传的路径
});
var Promise = require('bluebird');

/**
 * 删除非空文件夹 单层
 *
 * @param file
 */
var deleteFolderRecursive =  (path) => {
    return new Promise(function (resolve, reject) {
        fs.lstat(path, function (err, stats) {
            if (err && err.code != 'ENOENT') {
                logger.error("deleteFolderRecursive -> " + err);
                reject(err);
            }
            try {
                if (stats && stats.dev) {
                    fs.readdirSync(path).forEach(function (file, index) {
                        var curPath = path + file;
                        fs.unlinkSync(curPath)
                    });
                }
                fs.rmdirSync(path);
                resolve();
            } catch (err) {
                logger.error("deleteFolderRecursive1 -> " + err);
                reject(err);
            }
        })
    })
};

/**
 * 整理文件的路径
 *
 * @param value
 * @returns {{name: T, path: string, ext: string}}
 */
function formatPath(value) {
    if (value.length < 1) return;
    var filearr = value.split("/");
    return {
        name: filearr.pop(),
        path: filearr.join("/"),
        ext: (/[.]/.exec(value)) ? /[^.]+$/.exec(value.toLowerCase())[0] : ''
    };
}

/**
 * 修改名字
 *
 * @param newName
 * @param file
 */
function rename(file, newName) {
    if (file && newName.length > 0) {
        exec(['mv', '-f', file, newName].join(" "));
    }
}

/**
 * 删除文件
 *
 * @param file
 */
function deleteFile(file) {
    if (file) {
        exec(['rm', '-rf', file].join(" "));
    }
}
/**
 * 删除文件
 *
 * @param file
 */
function deleteFile_p(file) {
    return new Promise(function (resolve, reject) {
        if (file) {
            exec(['rm', '-rf', file].join(" "));
            return resolve();
        }else{
            return reject(constant.PARAMS_EMPTY);
        }
    });

}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3)
    {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}


/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function(src, dest) {
    return new Promise(function(resolve, reject) {
        try {
            if(!fs.statSync(src) && !fs.statSync(src).dev) reject(err);
            try {
                fs.mkdirSync(dest);
            } catch (err) {
                if (err && err.code != 'EEXIST') {
                    logger.error("copyRecursiveSync error: " + err);
                    reject(err);
                }
                ;
            }
            fs.readdirSync(src).forEach(function (childItemName) {
                fs.linkSync(path.join(src, childItemName),
                    path.join(dest, childItemName));
            });
            resolve();
        } catch (err) {
            logger.error("copyRecursiveSync1 -> " + err);
            reject(err);
        }
    });
};
module.exports ={
    deleteFolderRecursive:deleteFolderRecursive
    ,copyRecursiveSync:copyRecursiveSync
    ,decodeBase64Image:decodeBase64Image
    ,deleteFile:deleteFile
    ,deleteFile_p:deleteFile_p
    ,rename:rename
    ,formatPath:formatPath
}