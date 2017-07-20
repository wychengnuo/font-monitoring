
/**
 * 定时任务，每天输出错误日志
 */
module.exports = function () {
    const fs = require('fs');
    const iconv = require('iconv-lite');
    const path = require('path');
    const redis = require('./../server/redis');
    const moment = require('moment');
    const { keys, stop } = require('./../config/default');

    const baseUrl = path.join(__dirname, '../logText/');

    if (!fs.existsSync(baseUrl)) {
        fs.mkdirSync(baseUrl);
    }

    if (!keys && typeof keys !== 'object') {
        return;
    }

    let hasHeaders = false;
    let headers;


    for (var i in keys) {

        const k = keys[i];

        /**
         * exists 判断数据库是否有值
         * @param v === 1 key存在
         * @param v === 0 key不存在
         */

        redis.exists(k).then(v => {

            if (v === 1) {

                /**
                 * 集合中的所有的成员，写入文件
                 */
                redis.smembers(k).then(vs => {

                    vs = vs.map(JSON.parse);

                    if (!hasHeaders) {
                        headers = Object.keys(vs[0]);
                    }

                    vs = vs.map(v => Object.values(v).map(v => `"${v}",`).join(''));
                    
                    fs.writeFile(path.join(baseUrl + 'logs_' + moment().format('YYYY-MM-DD HH:mm:ss') + '_' + k + '.csv'), iconv.encode(headers + '\n' + vs.join('\n'), 'gbk'), 'binary', (err) => {
                        if (err) throw err;
                    });
                });
            }
        });
    }
};
/**
 * 延时时间停止, 使用服务器定时任务的时候会用到
 */

// const time = setTimeout(function() {
//     process.exit(0);
// }, stop.time);

// clearInterval(time);