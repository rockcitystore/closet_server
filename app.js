'use strict';

const ENV = process.env.NODE_ENV || "DEV";
const Koa = require('koa');
const fs = require('fs');
const Router = require('koa-router');
const router = new Router();
const app = new Koa();
const bodyParser = require("co-body");
const logger = require("./utils/logger").getLogger('app.js');
// const cron = require('./utils/cron');
const co = require('co');
const parse = require("co-busboy");
const constant = require("./utils/constant.js");

// 扫描Action
((path) => {
    fs.readdir(path, (err, files) => {
        if (!err) {
            files.forEach((item) => {
                let tmpPath = path + '/' + item;
                fs.stat(tmpPath, (err1, stats) => {
                    if (!err1 && !stats.isDirectory()) {
                        logger.info('load action :' + tmpPath);
                        require(tmpPath)(router);
                    }
                })
            });
        }
    });
})('./actions');
const pkg = require('./package.json');
var server = app.listen(pkg.port, function () {
    logger.info(`${pkg.name} listening on port ${pkg.port} in ${ENV}`);
});

let requestStartTime;
app
    .use((ctx, next)=> {
        return co(function*() {
            requestStartTime = new Date();
            let regx = /^\/server\/upload\/*/;
            if (regx.test(ctx.url) && ctx.method === 'POST') {
                logger.info(`${ctx.method}\t${ctx.url}\t${JSON.stringify(ctx.request.header)}`);
                logger.debug(ctx.request.is('multipart/*'));
                // if (ctx.request.is('multipart/*')) {
                ctx.req.files = yield parse(ctx, {autoFields: true, limits: {fileSize: 5 * 1024 * 1024, files: 1}});//5M 5120000
                // if(!ctx.req.files)  throw new Error(constant.msg.PARAMS_EMPTY)
                return next();
                // } else {
                //     throw new Error('PARAMS_ERROR')
                // }
            } else {
                logger.info(`${ctx.method}\t${ctx.url}\t${JSON.stringify(ctx.request.body)}\t${JSON.stringify(ctx.request.query)}\t${JSON.stringify(ctx.request.params)}`);
                if (ctx.method === "PUT" || ctx.method === "POST") {
                    ctx.request.body = yield bodyParser(ctx);
                    return next();
                } else {
                    return next();
                }
            }
        })
            .catch((err) => {
                logger.debug(err.stack);
                throw new Error(err)
            });
    })
    .use(router.routes())//路由
    // .use(router.allowedMethods()) //允许方法 nginx控制
    .use((ctx, next)=> {//日志
        logger.info(`${ctx.method}\t${ctx.url}\t${ new Date() - requestStartTime }\t${JSON.stringify(ctx.body)}`);
        return next();
    })
    .on('error', (err, ctx)=> {
        logger.error(err);
        ctx.res.setHeader('Content-Type', 'application/json');
        ctx.res.end(JSON.stringify({
            result: false,
            code: err.code || constant[err.message] || constant.RUNTIME_ERROR,
            msg: constant.msg[err.message] || err.message || constant.msg.RUNTIME_ERROR
        }));
    })//错误处理
;

// cron.getRedis;

process.on('uncaughtException', function (err) {
    logger.error(err);
    logger.error('uncaughtException : ' + err.message);
    // process.exit(1)
});

process.on('unhandledRejection', function (reason, p) {
    logger.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
