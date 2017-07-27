const redis = require('./../server/redis');

const { host } = require('./../config/default');

const os = require('os');

const networkInterfaces = os.networkInterfaces();
const eth0 = (networkInterfaces.eth0 || networkInterfaces.en0).filter(i=> i.family === 'IPv4');

class andirApiController {

    /**
     * andir app 获取全部插件
     */

    static async andirAppPlugin(ctx, next) {

        /**
         * 第一步： 从数据库中查询到项目
         */

        const data = await redis.keys('*_plug');

        /**
         * 第二步： 对返回数据进行格式处理
         */

        const d = await list(data);

        /**
         * 第三步： 对接口数据进行赋值处理
         */

        const e = await objDate(ctx, d);

        if (d) {
            ctx.body = {
                data: {
                    list: e
                },
                code: '200',
                success: true,
                msg: '随便'
            };
        } else {
            ctx.body = {
                data: {
                    list: []
                },
                code: '300',
                success: false,
                msg: '随便'
            };
        }
    }
}

const list = async(data) => {

    let d1 = [];
    let d2 = [];

    for (let i = 0; i < data.length; i++) {
        let d = await redis.lrange(data[i], 0, -1);
        if (d.length > 1) {
            for (let a = 0; a < d.length; a++) {
                d2.push(d[a]);
            }
        } else {
            d1 = d;
        }

    }
    return d2.concat(d1);
};

const objDate = async (ctx, data) => {
    
    const appVer = ctx.query.version;
    const androidVer = ctx.query.systemVer;
    const channl = ctx.query.channl;

    return data
        .map(JSON.parse)
        .filter(e => e.optionsRadios == '1' || appVer == e.appVer || androidVer == e.systemVer || channl == e.channl)
        .map(d => {
            return {
                version: Number(d.plugVersion),
                name: d.plugName.split('_')[0],
                isEnable: Boolean(d.isEnable),
                fileSize: d.fileSize ? d.fileSize : '0K',
                appVer: Number(d.version),
                updateType: Boolean(Number(d.appVer)),
                channl: d.channl,
                androidVer: Number(d.systemVer),
                isAll: Boolean(Number(d.optionsRadios)),
                path: d.path ? 'http://' + (host || (eth0[0].address + ':3002')) + d.path + '/' + d.name + '/' + d.plugName : '没有地址'
            };
        });
};

module.exports = andirApiController;