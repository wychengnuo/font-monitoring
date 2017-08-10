
/**
 * 统计插件下载量
 * 1、区分渠道下载量
 * 2、总下载量
 */

const redis = require('./../server/redis');

const { longTimeKeys } = require('./../config/default');

module.exports = async (channl, next) => {

    /**
     * 检查redis是否存在channl
     */

    if (!await redis.get(longTimeKeys.plugDownloads + '_' + channl)) {
        redis.set(longTimeKeys.plugDownloads + '_' + channl, 0);
    }

    redis.incr(longTimeKeys.plugDownloads + '_' + channl);

    await next();
};