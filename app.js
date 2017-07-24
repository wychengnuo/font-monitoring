const Koa = require('koa');
const app = new Koa();

const path = require('path');
const cors = require('koa-cors');
const koaBody = require('koa-body');

const getInterface = require('./utils/logs');
const existenceTime = require('./server/existenceTime');
const { corn } = require('./config/default');

app
  .use(koaBody({
      multipart: true
  }));

/**
 * 请求入口
 */    
const apiRouter = require('./routers/router');

app.use(apiRouter.routes())
    .use(apiRouter.allowedMethods());

app.use(cors());


const redis = require('./server/redis');

app
    .use(getInterface(redis))
    .use(existenceTime(redis));

require('babel-register');
/**
 *  redis 监控启动
 */

redis.on('error', function (err) {
    console.log('\n哈喽：\n亲爱的小伙。\n请启动redis！！！\n');
    redis.disconnect();
    throw err;
});


/**
 * 下载文件
 */

app.use(async (ctx, next) => {

    try {
        const homeDir = decodeURIComponent(ctx.path);
        let filePath = path.join(__dirname, homeDir);
        ctx.response.attachment(filePath);

    } catch (error) {
        throw error;
    }
    await next();
});

/**
 * 暂时没有提出来，先走这里
 */

const staticServer = require('koa-static');

app.use(staticServer(path.join(__dirname)));

app.on('error', function (err) {
    console.log(err);
});

const server = app.listen(3002, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});

require('./utils/socket')(server);

/**
 * 定时任务执行
 */
const cronJob = require('cron').CronJob;

new cronJob(corn.time, function () {  
    require('./logs/errLog')(); 
}, null, true, 'Asia/Chongqing');  
