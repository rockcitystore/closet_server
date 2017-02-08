"use strict";

const CronJob = require('cron').CronJob;
const http = require('http');
const logger = require("../utils/logger").getLogger('cron');


module.exports = {
    // getRedis: new CronJob({
    //     cronTime: '0 */2 * * * *',//每2分钟运行
    //     onTick: () => {
    //         redisService.getRedis()
    //         logger.info('getRedis 成功');
    //     },
    //     start: true,
    //     timeZone: 'Asia/Shanghai'
    // })
    // ,
    // getHostCoin: new CronJob({
    //     cronTime: '0 */2 * * * *',//每2分钟运行
    //     onTick: () => {
    //         // hostCoinService.getHostCoin()
    //         // logger.info('getHostCoin 成功');
    //     },
    //     start: true,
    //     timeZone: 'Asia/Shanghai'
    // })
}
