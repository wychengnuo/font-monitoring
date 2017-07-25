

/**
 * Expose getInterface
 * 张Sam
 */

const humanize = require('humanize-number');
const keys = require('./../config/default').keys;

function getInterface(redis) { 
    
    return async function b(ctx, next) {
        const start = new Date();
        try {
            await next();
        } catch (err) {
            loggers(ctx, start, redis, err);
            throw err;
        } 
        loggers(ctx, start, redis);
    };
}

function loggers(ctx, start, redis, err) {    
    const t = time(start);
    const status = err ? (err.status || 500) : (ctx.status || 404);
    const o = {};
    o.method = ctx.method;
    o.originalUrl = ctx.originalUrl;
    o.status = status;
    o.t = t;
    o.time = nowTime();
    if (ctx.originalUrl !== '/__webpack_hmr' && status != '404' && status != '200') {
        o.msg = ctx.body ? ctx.body.msg : '服务端内部错误';
        let n = JSON.stringify(o);
        redis.sadd(keys.errlogs, n);
        redis.rpush(keys.pageError, n);
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