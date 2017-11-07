
/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const editMysql = require('./../module/index');

module.exports = async (ctx, obj, homeDir,  next) => {

    /**
     * 检查redis是否存在channl
     */
    if (obj && obj.channel) {
        let name = homeDir.split('/')[homeDir.split('/').length - 3];
        let version = homeDir.split('/')[homeDir.split('/').length - 2];

        // name = homeDir, sum += 1;

        let a = await new editMysql().getPlugAnListInfoId({ name: name, plugVersion: version });

        a = !a ? {} : a;

        if (a.id) {

            let b = await new editMysql().getPlugDownId({ name: obj.channel, plugAnListInfoId: a.id });

            b = !b ? {} : b;

            if (b.name) {
                new editMysql().updatePlugDownId(b);
            } else {
                new editMysql().plugDown(obj, a.id);
            }
        }
        // await next();
    }
    ctx.body = {
        success: false,
        data: '不知道为啥，请求头字段暂不能为中文'
    };
    
};