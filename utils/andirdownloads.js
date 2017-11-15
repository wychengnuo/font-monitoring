/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const editMysql = require('./../module/index');

const throttle = require('lodash.throttle');

const client = require('./../server/redis');

const updateDate = throttle(async (d, obj) => {
    await date(d, obj);
}, 1000);

const date = async (d, obj) => {

    let incrDate = await client.lrange('gm_front_' + obj.channel, 0, -1);
    incrDate = incrDate.map(JSON.parse);

    new editMysql().plugDown(incrDate, d).then(() => {
        global.c = 0;
        clearInterval(set);
        client.del('gm_front_' + obj.channel);
    })
}

let set;

module.exports = async (ctx, obj, homeDir, next) => {
     
    if (obj) {

        let name = homeDir.split('/')[homeDir.split('/').length - 3];
        let version = homeDir.split('/')[homeDir.split('/').length - 2];

        global.c += 1;
        
        client.lpush('gm_front_' + obj.channel, JSON.stringify(obj));

        if (parseInt(global.c) < 500) {

            set = setInterval(async () => {

                let d = await new editMysql().getPlugAnListInfoId(name, version, obj.projectId);

                date(d, obj);

            },5000)
        }

        if (parseInt(global.c) % 500 === 0) {
            
            let d = await new editMysql().getPlugAnListInfoId(name, version, obj.projectId);

            updateDate(d, obj);
        }
    }
    ctx.body = {
        success: false,
        data: '暂无数据'
    };

};