/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const editMysql = require('./../module/index');

const throttle = require('lodash.throttle');

const client = require('./../server/redis');

const updateDate = throttle(async (f, d, obj) => {
    await date(f, d, obj);
}, 1000);

const date = async (f, d, obj) => {
    let inc = await client.get('gm_front_' + obj.channel);
    if (typeof f !== 'undefined' && f.plugAnListInfoId === d.id) { 
        new editMysql().updatePlugDownId(f.name, parseInt(inc), obj.projectId).then(() => {
            global.c = 0;
        })
    } else {
        new editMysql().plugDown(obj, d);
    }
}

module.exports = async (ctx, obj, homeDir, next) => {
    
    let set;

    if (obj && obj.channel) {

        let name = homeDir.split('/')[homeDir.split('/').length - 3];
        let version = homeDir.split('/')[homeDir.split('/').length - 2];

        global.c += 1;
        
        client.incr('gm_front_' + obj.channel)

        if (parseInt(global.c) < 200) {

            // clearInterval(set)

            let inc = await client.get('gm_front_' + obj.channel);

            set = setInterval(async () => {

                let incr = await client.get('gm_front_' + obj.channel);

                if (parseInt(inc) === parseInt(incr)) {

                    let d = await new editMysql().getPlugAnListInfoId(name, version, obj.projectId);
                    
                    let f = await new editMysql().getPlugDownId(obj.channel, d);
        
                    f = !f ? 'undefined' : f[0];

                    date(f, d, obj);

                    clearInterval(set);
                }
            },3000)
        }

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