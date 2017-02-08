var log4js = require('log4js');
var config =require('../config');
// logger configure
log4js.configure({
    appenders: [
        {type: 'console'}
        ,
        {
            type: 'dateFile',
            filename: 'logs/log',
            pattern: "_yyyy-MM-dd",
            maxLogSize: 1024,
            alwaysIncludePattern: false,
            backups: 4
        }
    ],
    levels: {
        "[all]": "debug"
    },
    replaceConsole: true
});

module.exports = log4js;