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
 * 暂时没有提出来，先走这里
 */

var staticServer = require('koa-static');

app.use(staticServer(path.join(__dirname)));

/**
 * 下载文件
 */

const fs = require('fs');
// const newpath = homeDir + ';

app.use(async (ctx, next) => {

    try {
        const homeDir = __dirname + '/public/upload/' + ctx.query.name;
        const filename = path.basename(homeDir);

        if (ctx.path.indexOf('/public/upload') > -1) {
            ctx.body = fs.createReadStream(homeDir);
            ctx.set('Content-disposition', 'attachment; filename=' + filename);
        }
        
    } catch (error) {
        throw err;
    }
    await next();
});

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
