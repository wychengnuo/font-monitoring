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

/**
 * 
 * @param {*} data 数组
 * @param 返回类别最新的值
 */

const list = async (data) => {
    let arr = [];
    return data.reduce(async (pre, cur) => await redis.lrange(cur, 0, -1), []);
};

const objDate = async (ctx, data) => {
    
    const appVer = ctx.query.version;
    const androidVer = ctx.query.systemVer;
    const channl = ctx.query.channl;

    let d, d1, d2;

    let temp = data
        .map(JSON.parse);
    
    let temp3 = temp.filter(e => e.optionsRadios == '1');
    
    let temp2 = temp.filter(e => e.optionsRadios == '0' && (appVer == e.appVer || androidVer == e.systemVer || channl == e.channl));

    if (temp3.length > 0) {
        d1 = temp3.map(e => (e.plugVersion = Number(e.plugVersion), e)).reduce((pre, cur) => pre.plugVersion > cur.plugVersion ? pre : cur);
    }
    
    if (temp2.length > 0) {
        d2 = temp2.map(e => (e.plugVersion = Number(e.plugVersion), e)).reduce((pre, cur) => pre.plugVersion > cur.plugVersion ? pre : cur);
    }

    d = ((d2 && d2.plugVersion) > (d1 && d1.plugVersion)) ? d2 : d1;

    if (d) {
        return {
            version: d.plugVersion,
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
    } else {
        return {};
    }
};

module.exports = andirApiController;