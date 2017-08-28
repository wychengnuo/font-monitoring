
/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const { longTimeKeys } = require('./../config/default');

const editRedis = require('./../module/index');

module.exports = async (channl, next) => {

    /**
     * 检查redis是否存在channl
     */

    if (channl) {
        if (!await new editRedis().get(longTimeKeys.plugDownloads + '_' + channl)) {
            new editRedis().downSet(longTimeKeys.plugDownloads + '_' + channl, 0);
        }

        new editRedis().downSet(longTimeKeys.plugDownloads + '_' + channl);
    }
    
};