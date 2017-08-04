const log4js = require('log4js');

log4js.configure(
    {
        appenders: {
            console: {
                type: 'console',
                category: 'console'
            },
            file: {
                type: 'file',
                filename: './loggers/access.log',
                maxLogSize: 10 * 1024 * 1024, // = 10Mb
                numBackups: 3, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: 0o0640,
                flags: 'w+'
            },
            dateFile: {
                type: 'dateFile',
                filename: './loggers/more-access.log',
                pattern: 'yyyy-MM-dd-hh',
                compress: true
            },
            out: {
                type: 'console'
            }
        },
        categories: {
            default: { appenders: ['file', 'dateFile', 'out'], level: 'ALL' }
        },
        replaceConsole: true
    }
);

const consoleLogger = log4js.getLogger('default');
console.trace = consoleLogger.trace.bind(consoleLogger); // 替换系统的console
console.debug = consoleLogger.debug.bind(consoleLogger);
console.log = consoleLogger.info.bind(consoleLogger);
console.info = consoleLogger.info.bind(consoleLogger);
console.warn = consoleLogger.warn.bind(consoleLogger);
console.error = consoleLogger.error.bind(consoleLogger);

module.exports = {
    log4js,
    consoleLogger
};