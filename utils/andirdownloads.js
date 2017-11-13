/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const editMysql = require('./../module/index');

const throttle = require('lodash.throttle');

const client = require('./../server/redis');

const updateDate = throttle(async (f,d,obj) => {
    let inc = await client.get(obj.channel);
    if (typeof f !== 'undefined' && f.plugAnListInfoId === d.id) { 
        new editMysql().updatePlugDownId(f.name, parseInt(inc), obj.projectId).then(() => {
            global.c = 0;
        })
    } else {
        new editMysql().plugDown(obj, d);
    }
}, 1000)

module.exports = async(ctx, obj, homeDir, next) => {

    if (obj && obj.channel) {

        let name = homeDir.split('/')[homeDir.split('/').length - 3];
        let version = homeDir.split('/')[homeDir.split('/').length - 2];

        global.c += 1;
        
        client.incr(obj.channel)

        if (parseInt(global.c) % 200 === 0) {
            
            let d = await new editMysql().getPlugAnListInfoId(name, version, obj.projectId);

            let f = await new editMysql().getPlugDownId(obj.channel, d);

            f = !f ? 'undefined' : f[0];

            updateDate(f, d, obj);
        }
    }
    ctx.body = {
        success: false,
        data: '暂无数据'
    };

};