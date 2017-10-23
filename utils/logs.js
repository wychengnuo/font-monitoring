

/**
 * Expose getInterface
 * 张Sam
 */

const editRedis = require('./../module/index');

const humanize = require('humanize-number');
const keys = require('./../config/default').keys;

function getInterface() { 
    
    return async function b(ctx, next) {
        const start = new Date();
        try {
            await next();
        } catch (err) {
            loggers(ctx, start, err);
            console.log(err);
            throw err;
        } 
        loggers(ctx, start);
    };
}

function loggers(ctx, start, err) {
    const t = time(start);
    const status = err ? (err.status || 500) : (ctx.status || 404);
    const o = {};
    o.method = ctx.method;
    o.originalUrl = ctx.originalUrl;
    o.status = status;
    o.t = t;
    o.time = nowTime();
    if (ctx.originalUrl !== '/__webpack_hmr' && status != '400' && status != '404' && status != '200') {
        o.msg = ctx.body ? ctx.body.msg : '服务端内部错误';
        let n = JSON.stringify(o);
        new editRedis().sadd(keys.errlogs, n);
        new editRedis().rpush(keys.pageError, n);
    }
}

function time (start) {
    const delta = new Date() - start;
    return humanize(delta < 10000
        ? delta + 'ms'
        : Math.round(delta / 1000) + 's');
}

function nowTime() { 
    const getTime = new Date(),
        m = getTime.getMonth() + 1;

    const t = getTime.getFullYear() + '-' + m + '-' +
        getTime.getDate() + ' ' + getTime.getHours() + ':' +
        getTime.getMinutes() + ':' + getTime.getSeconds();
    return t;
}

module.exports = getInterface;