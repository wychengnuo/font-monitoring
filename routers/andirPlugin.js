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
                msg: '成功'
            };
        } else {
            ctx.body = {
                data: {
                    list: []
                },
                code: '300',
                success: false,
                msg: '失败'
            };
        }
    }
}

/**
 * 
 * @param {*} data 数组
 * @param 返回类别最新的值
 * @param 核心处理逻辑
 */

const list = async (data) => {

    /**
     * @param data 数据库中插件详情详情存储字段的个数，也就是长度
     * @param data的长度决定了要不对其中一个进行比较处理，获取最新的
     */

    if (data.length > 1) {

        /**
         * 核心处理逻辑
         */

        return (async () => {
            const b = data.map(async v => await redis.lrange(v, 0, -1));
            const c = await Promise.all(b);
            return c;
        })();

    } else {
        return data.reduce(async (pre, cur) => await redis.lrange(cur, 0, -1), []);
    }

};

const objDate = async (ctx, data, next) => {
    
    const appVer = ctx.query.version;
    // const androidVer = ctx.query.systemVer;
    const channl = ctx.query.channl;

    let d, d1, d2, arr = [];

    /**
     * 话说看到了这里，你就牛逼了。
     * @param data里面有可能是但数组，也有可能是多数组
     */

    let temp;

    for (var i = 0; i < data.length; i++) {

        temp = '', d1 = '', d2 = '';

        if (typeof data[i] == 'string') {

            /**
             * 数组里面是单数组的时候
             */

            temp = data
                .map(JSON.parse);
        } else {
            
            /**
             * 数组里面为多数组
             */

            temp = data[i]
                .map(JSON.parse);
        }
        
        /**
         * 插件全部使用，数据
         */
        
        let temp3 = temp.filter(e => e.optionsRadios == '1');

        /**
         * 插件条件使用，数据
         *  || androidVer == e.systemVer
         *
         *  @param e.e.version 对应 ctx.query.version
         *  @param e.channl 对应 ctx.query.channl
         */
        
        let temp2 = temp.filter(e => e.optionsRadios == '0' && (appVer == e.version && channl == e.channl));

        /**
         * 以下为分别获取最大值
         */

        if (temp3.length > 0) {
            d1 = temp3.map(e => (e.plugVersion = Number(e.plugVersion), e)).reduce((pre, cur) => pre.plugVersion > cur.plugVersion ? pre : cur);
        }
        
        if (temp2.length > 0) {
            d2 = temp2.map(e => (e.plugVersion = Number(e.plugVersion), e)).reduce((pre, cur) => pre.plugVersion > cur.plugVersion ? pre : cur);
        }

        /**
         * 以下为最终的最大值
         */

        d = ((d2 && d2.plugVersion) > (d1 && d1.plugVersion)) ? d2 : d1;

        try {
            if (d.plugVersion) {

                /**
                 * 数组里面是单数组的时候
                 */

                arr.push(d);
            }
            
        } catch (error) {
            throw error;
        }

    }

    return arr.map(d => {

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
    }); 
};

module.exports = andirApiController;