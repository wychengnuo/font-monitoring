const Koa = require('koa');
const app = new Koa();

const path = require('path');
const fs = require('fs');

const cors = require('koa-cors');

const koaBody = require('koa-body');

app.use(cors());
app.use(koaBody({ multipart: true }));

/**
 *  redis 监控启动
 */

var redis = require('./server/redis');

redis.on('error', function (err) {
    console.log("\n哈喽：\n亲爱的小伙。\n请启动redis！！！\n");
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

    require(addepath)(router);
}

app
    .use(router.routes())
    .use(router.allowedMethods());

app.on('error', function (err, ctx) {
    console.log(err);
});

const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});


var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
    console.log('User connected');
    socket.on('disconnect',function(){
        console.log('User disconnected');
    });
});

