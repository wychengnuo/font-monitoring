const Koa = require('koa');
const app = new Koa();

const path = require('path');
const fs = require('fs');

const cors = require('koa-cors');

const koaBody = require('koa-body')();

app.use(cors());

/**
 *  redis 监控启动
 */

var redis = require('./server/redis');

redis.on('error', function (err) {
    console.log("\n哈喽：\n亲爱的小伙。\n麻烦开下天眼（- 0 -）确认redis有没有在运动！！！\n");
    redis.disconnect();
    throw err;
});

app.use(async(ctx, next) => {

    try {

        await next();

    } catch (err) {
        ctx.body = err.message;

    }
});


const addepath = path.resolve('./api.js');

const router = require('koa-router')();

if (fs.existsSync(addepath)) {

    require(addepath)(router, koaBody);
}

app
    .use(router.routes())
    .use(router.allowedMethods());

app.on('error', function (err, ctx) {
    console.log(err);
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});