
/**
 * 消息推送
 */

const redis = require('./../server/redis');

const { longTimeKeys } = require('./../config/default');

const moment = require('moment');


class messagePush {

    /**
     * 增加message接口
     */

    static async addMessage(ctx, next) {

        let obj = ctx.request.body;


        /**
         * 创建时间
         */

        obj.time = moment().format('YYYY-MM-DD HH:mm:ss');

        redis.rpush(longTimeKeys.messagePush, JSON.stringify(obj));

        ctx.body = {
            success: true,
            msg: '成功'
        };

    }

    /**
     * 获取信心用于前端分页显示
     */

    static async getMessage(ctx, next) {

        await paging(ctx, longTimeKeys.messagePush);
    }

    /**
     * 设置推送消息
     */
    
    static async setMessage(ctx, next) {

        const {
            num,
            order
        } = ctx.request.body;

        let data = await redis.lrange(longTimeKeys.messagePush, order, order);
        let d;

        d = JSON.parse(data);
        d.time = moment().format('YYYY-MM-DD HH:mm:ss');

        if (num == '1') {

            d.isEnable = 'true';

        } else if (num == '2') {

            d.isEnable = 'false'; // 是否停用

        }

        /**
         * 根据num 来区分功能
         * 1、启用
         * 2、停用
         * 3、删除
         * 根据oeder 定位插件的位置
         * 进行插件属性修改以及删除操作
         */

        if (num == '1' || num == '2') {
            
            redis.lset(longTimeKeys.messagePush, order, JSON.stringify(d));

            ctx.body = {
                success: true,
                msg: '操作成功',
                data: data
            };
        } else {

            /**
             * 删除数据库字段
             */

            redis.lrem(longTimeKeys.messagePush, order, data);
            ctx.body = {
                success: true,
                msg: '删除成功'
            };
        }

    }
}


/**
 * 分页处理
 */

const paging = async(ctx, keys) => {
    
    let page = ctx.query.page ? ctx.query.page : 1;
    let pageSize = ctx.query.pageSize ? ctx.query.pageSize : 10;
    const dataLeng = await redis.llen(keys);
    let data;

    if (dataLeng > 10) {
        page = page * 10 - 10;
        pageSize = (pageSize * ctx.query.page) - 1;
        data = await redis.lrange(keys, page, pageSize);
    } else {
        data = await redis.lrange(keys, 0, 9);
    }

    if (data) {
        ctx.body = {
            success: true,
            data: data,
            msg: '成功',
            pageSize: Math.ceil(dataLeng / 10)
        };
    } else {
        ctx.body = {
            success: false,
            data: {},
            msg: '失败',
            pageSize: 0
        };
    }

};
    

module.exports = messagePush;