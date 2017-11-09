

/**
 * Expose getInterface
 * 张Sam
 */

const editMysql = require('./../module/index');

const humanize = require('humanize-number');
const moment = require('moment');

function getInterface() { 
    
    return async function b(ctx, next) {
        const start = new Date();
        try {
            await next();
        } catch (err) {
            loggers(ctx, start, err);
            throw err;
        } 
        await loggers(ctx, start);
    };
}

const loggers = async (ctx, start, err) => {
    const t = time(start);
    const status = err ? (err.status || 500) : (ctx.status || 404);
    const o = {};
    o.source = ctx.source;
    o.method = ctx.method;
    o.originalUrl = ctx.originalUrl;
    o.status = status;
    o.t = t;
    o.time = moment().format('YYYY-MM-DD HH:mm:ss');
    if (ctx.originalUrl.indexOf('/plugin/api') === 0) {
        o.msg = ctx.body ? ctx.body.msg : '服务端内部错误';
        const da = await new editMysql().selectToken(ctx.headers.cookie.split('=')[1])
        const dt = await new editMysql().selectProjects(da.roleId);
        o.id = dt.id;
        new editMysql().netMessageSet(o);
        
    }
}

function time (start) {
    const delta = new Date() - start;
    return humanize(delta < 10000
        ? delta + 'ms'
        : Math.round(delta / 1000) + 's');
}

module.exports = getInterface;