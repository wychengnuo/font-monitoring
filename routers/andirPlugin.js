
const redis = require('./../server/redis');
const { longTimeKeys } = require('./../config/default');

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

        const e = await objDate(d);

        if (d) {
            ctx.body = {
                data: {
                    list: e
                },
                code: '0000',
                success: true,
                msg: '随便'
            };
        } else {
            ctx.body = {
                data: {
                    list: []
                },
                code: '0000',
                success: false,
                msg: '随便'
            };
        }
    }
}

const list = async (data) => {

    let d1 = [];
    let d2 = [];

    for (let i = 0; i < data.length; i++) {
        let d = await redis.lrange(data[i], 0, -1);
        if (d.length > 1) {
            for (let a = 0; a < d.length; a++){
                d2.push(d[a]);
            }
        } else {
            d1 = d;
        }
        
    }
    return d2.concat(d1);
};

const objDate = async (data) => {
    let arr = [];
    let o = {};

    for (let i = 0; i < data.length; i++) {
        o = {};
        let d = JSON.parse(data[i]);
        o.version = d.version;
        o.name = d.plugName.split('.')[0];
        o.isEnabis = d.isEnabis;
        o.isDisabis = d.isDisabis;
        o.fileSize = d.fileSize ? d.fileSize : '0K';
        o.path = d.path ? 'http://127.0.0.1:3002' + d.path.split('?')[0] + '/' + d.plugName + '?' + d.path.split('?')[1]  : '没有地址';
        arr.push(o);
    }
    return arr;
};

module.exports = andirApiController;