
/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const editMysql = require('./../module/index');

const throttle = require('lodash.throttle');

const updateDate = throttle((b) => {
    new editMysql().updatePlugDownId(b, global.a[b.id]).then((data) => {
        global.a[b.id] = 0;
    })
}, 1400);

module.exports = async (ctx, obj, homeDir,  next) => {

    if (obj && obj.channel) {
        let name = homeDir.split('/')[homeDir.split('/').length - 3];
        let version = homeDir.split('/')[homeDir.split('/').length - 2];

        if (!global.b[obj.channel]) {
            let a = await new editMysql().getPlugAnListInfoId({ name: name, plugVersion: version });
            a = !a ? {} : a;
            global.b[obj.channel] = a;
        }

        if (global.b[obj.channel].id) {

            new editMysql().getPlugDownId({ name: obj.channel, plugAnListInfoId: global.b[obj.channel].id }).then(b => {

                b = !b ? {} : b;

                if (b.name === obj.channel) {
                    
                    global.a[b.id] = (global.a[b.id] || 0) + 1;
    
                    updateDate(b);
    
                } else {

                    new editMysql().plugDown(obj, global.b[obj.channel].id);

                }
            })    
        }
        // await next();
    }
    ctx.body = {
        success: false,
        data: '不知道为啥，请求头字段暂不能为中文'
    };
    
};