/**
 * Mysql方法封装
 *
 * Created by leovs on 2015/12/12
 */
"use strict";

const config = require("../config"), crypto = require('crypto');
const Md5 = require('../utils/md5.js');
const logger = require("../utils/logger").getLogger(__filename.split("/").pop());
const util = require('util');


var options = {
    'host': config.dbhost,
    'port': config.port,
    'user': config.user,
    'password': config.password,
    'database': config.db,
    'charset': config.charset,
    'connectionLimit': config.maxConnLimit,
    'supportBigNumbers': true,
    'bigNumberStrings': true
};
var mysql = require('mysql');
var pool = mysql.createPool(options);

/**
 * 释放连接
 *
 * @param connection
 */
exports.release = function (connection) {
    connection.end(function (error) {
        //console.log('Connection closed');
    });
};

/**
 * 执行SQL
 *
 * @param options
 * @returns {*}
 */
exports.execQuery = function (options) {
    var sql = options['sql'];
    var args = options['args'];
    var handler = options['handler'];
    var cache = options['cache'];
    logger.debug(options);
    var st = new Date().getTime();

    function exec(callback) {
        pool.getConnection(function (error, connection) {
            try {
                if (error) throw error;
                if (!args) {
                    connection.query(sql, callback);
                } else {
                    connection.query(sql, args, callback);
                }
                connection.release(function (error) {
                    if (error) throw error;
                });
                var et = new Date().getTime();
                logger.debug('execQuery');
                logger.debug(et - st);
            } catch (err) {
                logger.error('execQuery exec error: %s', util.inspect(err, {depth: null}));
                callback(err);
            }
        });
    }

    // 是否开启cache
    if (cache && cache.key && cache.key.length > 0) {
        redis.getJson(Md5.md5(cache.key + sql + args.join("_")), function (error, info, value) {
            if (error) {
                return exec(function (error, results) {
                    if (error) {
                        console.log(error);
                    } else {
                        if (results && results.length > 0) {
                            // redis.setJson(info.key, results).expire(info.key, info.expire || 65536);
                        }
                    }
                    handler(error, results);
                });
            }
            return handler(error, value);
        });
    } else return exec(function (error, results) {
        if (error)  logger.error('execQuery error: %s', util.inspect(error, {depth: null}));
        return handler(error, results);
    });
};


/*
 * SQL事务
 *@param options,options2
 * @returns {*}
 * */

exports.transaction = function (options, options2) {
    var sql = options['sql'];
    var args = options['args'];

    var sql2 = options2['sql'];
    var args2 = options2['args'];
    var handler2 = options2['handler'];
    if (!args || !args2) {
        return
    }
    logger.debug(options);
    logger.debug(options2);
    var st = new Date().getTime();

    function exec(callback) {
        try {
            pool.getConnection(function (error, connection) {
                connection.beginTransaction(function (err) {
                    if (err) {
                        connection.release(function (error) {
                            if (error) throw error;
                        });
                        return callback(err);
                    }
                    connection.query(sql, args, function (err, result) {
                        if (err) {
                            return connection.rollback(function () {
                                connection.release(function (error) {
                                    if (error) throw error;
                                });
                                return callback(err);
                            });
                        }
                        var et1 = new Date().getTime();
                        logger.debug(et1 - st);

                        connection.query(sql2, args2, function (err, result) {
                            if (err) {
                                return connection.rollback(function () {
                                    connection.release(function (error) {
                                        if (error) throw error;
                                    });
                                    return callback(err);
                                });
                            }

                            var et2 = new Date().getTime();
                            logger.debug(et2 - et1);
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        connection.release(function (error) {
                                            if (error) throw error;
                                        });
                                        return callback(err);
                                    });
                                }
                                var et = new Date().getTime();
                                logger.debug(et - st);

                                connection.release(function (error) {
                                    if (error) throw error;
                                });
                                logger.debug('transaction success');

                                return callback(error, result);
                            });
                        });

                    });
                });
            });
        } catch (error) {
            logger.debug('transaction uncaughtException fail');
            return callback(error);
        }
    }

    return exec(function (error, results) {
        if (error) {
            logger.error(' transaction execQuery error');
            logger.error(error);
            return handler2(error);
        }
        return handler2(error, results);
    });
}

/*
 * SQL事务
 *@param options,options2,options3
 * @returns {*}
 * */
//TODO 更换orm
exports.transaction_three = function (options, options2, options3) {
    var sql = options['sql'];
    var args = options['args'];

    var sql2 = options2['sql'];
    var args2 = options2['args'];

    var sql3 = options3['sql'];
    var args3 = options3['args'];
    var handler3 = options3['handler'];
    if (!args || !args2 || !args3) {
        return;
    }
    logger.debug(options);
    logger.debug(options2);
    logger.debug(options3);

    var st = new Date().getTime();

    function exec(callback) {
        try {
            pool.getConnection(function (error, connection) {
                connection.beginTransaction(function (err) {
                    if (err) {
                        connection.release(function (error) {
                            if (error) throw error;
                        });
                        return callback(err);
                    }
                    connection.query(sql, args, function (err, result) {
                        if (err) {
                            return connection.rollback(function () {
                                connection.release(function (error) {
                                    if (error) throw error;
                                });
                                return callback(err);
                            });
                        }
                        var et1 = new Date().getTime();
                        logger.debug(et1 - st);

                        connection.query(sql2, args2, function (err, result) {
                            if (err) {
                                return connection.rollback(function () {
                                    connection.release(function (error) {
                                        if (error) throw error;
                                    });
                                    return callback(err);
                                });
                            }

                            var et2 = new Date().getTime();
                            logger.debug(et2 - et1);

                            connection.query(sql3, args3, function (err, result) {
                                if (err) {
                                    return connection.rollback(function () {
                                        connection.release(function (error) {
                                            if (error) throw error;
                                        });
                                        return callback(err);
                                    });
                                }
                                var et3 = new Date().getTime();
                                logger.debug(et3 - et2);
                                connection.commit(function (err) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            connection.release(function (error) {
                                                if (error) throw error;
                                            });
                                            return callback(err);
                                        });
                                    }
                                    var et = new Date().getTime();
                                    logger.debug(et - st);

                                    connection.release(function (error) {
                                        if (error) throw error;
                                    });
                                    logger.debug('transaction success');

                                    return callback(error, result);
                                });
                            });
                        });
                    });
                });
            });
        } catch (error) {
            logger.debug('transaction uncaughtException fail');
            return callback(error);
        }
    }

    return exec(function (error, results) {
        if (error) {
            logger.error(' transaction execQuery error');
            logger.error(error);
            return handler3(error);
        }
        return handler3(error, results);
    });
}


//escape
exports.escape = function (val) {
    return mysql.escape(val, null, null);
};

//getConnection
exports.getConnection = function (fun) {
    return pool.getConnection(fun);
};