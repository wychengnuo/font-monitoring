
/**
 * 
 * 数据库值过期时间限制
 */

const keys = require('./../config/default').keys;
const t = require('./../config/default').t;

function existenceTime(redis) {

    return async (ctx, next) => { 
        try {
            await next();
        } catch (err) {
            eachKeys(keys, redis, err);
            throw err;
        } 
        eachKeys(keys, redis);
    };
}

/**
 * 遍历配置keys，判断数据库中是否存在
 */

const eachKeys = async (obj, redis, err = {}) => {

    if (!obj && typeof obj !== 'object') {
        return;
    }
    for (var i in obj) {

        const k = obj[i];

        /**
         * exists 判断数据库是否有值
         * @param v === 1 key存在
         * @param v === 0 key不存在
         */

        await redis.exists(k).then(v => {

            if (v === 1) {

                /**
                 * @param pptl数据库中有这个值，看看是否设置过期时间
                 * @param {key} key 不存在: -2,
                 * @param {key} key 存在但没有设置剩余生存时间: -1
                 * @param {key} key 存在也设置的生存时间: 返回key的剩余生存时间
                 */

                redis.pttl(k).then(v => {

                    if (v === -1) {
                        
                        /**
                         * @param {time} 走到这里，说明，key存在，但是没有设置过期时间
                         * @param {time} 开始设置key的过期时间
                        */
                        
                        redis.expire(k, t.time);
                    }
                });
            }
        });
    }
};

module.exports = existenceTime;