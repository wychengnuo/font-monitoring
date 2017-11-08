
/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const editMysql = require('./../module/index');

const throttle = require('lodash.throttle');

const updateDate = throttle((b, id) => {
    new editMysql().updatePlugDownId(b, id).then((data) => {
        global.a[b.id] = 0;
        global.d = 0;
        global.f = 0;
        global.e = {};
        global.b = {};
    })
}, 1400);

module.exports = async (ctx, obj, homeDir, next) => {
    

    if (obj && obj.channel) {
        let name = homeDir.split('/')[homeDir.split('/').length - 3];
        let version = homeDir.split('/')[homeDir.split('/').length - 2];

        if (!global.b[obj.channel]) {
            let adata = await new editMysql().getPlugAnListInfoId({ name: name, plugVersion: version });
            adata = !adata ? {} : adata;
            global.b[obj.channel] = adata;
        }

        if (global.b[obj.channel].id) {

            if (!global.e[obj.channel]) {
                
                let bdata = await new editMysql().getPlugDownId({ name: obj.channel, plugAnListInfoId: global.b[obj.channel].id });
                
                bdata = !bdata ? {} : bdata;
    
                global.e[bdata.name] = bdata;
                
            }
            
            if (typeof global.e[obj.channel] !== 'undefined' && global.e[obj.channel].plugAnListInfoId === global.b[obj.channel].id) {
                
                global.a[b.id] = (global.a[b.id] || 0) + 1;

                global.f++;

                if (global.d == 100) {
                    updateDate(global.e[obj.channel], global.a[b.id]);
                }

            } else {

                if (global.e[obj.channel] !== obj.channel) {
                    new editMysql().plugDown(obj, global.b[obj.channel].id);
                }
                next();

            }   
        }
        // await next();
    }
    ctx.body = {
        success: false,
        data: '不知道为啥，请求头字段暂不能为中文'
    };
    
};