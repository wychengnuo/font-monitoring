const Koa = require('koa');
const app = new Koa();

const path = require('path');
const cors = require('koa-cors');
const koaBody = require('koa-body');
// const eventproxy = require('eventproxy');

const getInterface = require('./utils/logs');
const { corn } = require('./config/default');

app.use(cors());

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

app
    .use(getInterface());

const fs = require('fs');

const baseUrl = path.join(__dirname, '/public/');
const baseUrlList = path.join(__dirname, '/public/download');

if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
    if (!fs.existsSync(baseUrlList)) {
        fs.mkdirSync(baseUrlList);
    }
}

/**
 * 下载文件
 */

global.a = {};
global.b = {};
global.c = {};
global.d = 0;
global.e = {};
global.f = 0;

app.use(async (ctx, next) => {

    /**
     * 兼容api不走下载
     */
   
    if (ctx.originalUrl.indexOf('/public/download') == 0) {

        if (!global.c[ctx.headers['channel']]) {
            global.d = 0;
        }

        global.c[ctx.headers['channel']] = global.d+=1;

        try {
            const homeDir = decodeURIComponent(ctx.path);
            let filePath = path.join(__dirname, homeDir);
            let obj = {
                channel : ctx.headers['channel'],
                mobileModel : ctx.headers['mobile_model'] || '',
                mobileVersion : ctx.headers['os_version'] || '',
                networkType : ctx.headers['network_type'] || '',
                romInfo : ctx.headers['rom_info'] || '',
                appVersion : ctx.headers['sver'] || '',
                imei : ctx.headers['imei'] || ''
            }

            require('./utils/andirdownloads')(ctx, obj, homeDir, next);
            
            ctx.response.attachment(filePath);

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    await next();
});

const staticServer = require('koa-static');

app.use(staticServer(path.join(__dirname)));

const getKoaLogger = require('koa2-loggers');

app.use(getKoaLogger({ level: 'auto'}));

const server = app.listen(3002, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});

require('./utils/socket')(server);

/**
 * 定时任务执行
 */
// const cronJob = require('cron').CronJob;

// new cronJob(corn.time, function () {  
//     require('./logs/errLog')(); 
// }, null, true, 'Asia/Chongqing');  
