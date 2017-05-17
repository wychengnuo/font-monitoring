const fs = require('fs');
const path = require('path');
const redis = require('./server/redis');
const crypt = require('./ctypto/ctypto').crypt;

module.exports = function (router, koaBody) {
    var errToken;
    router.post('/index', koaBody, function () {
        var ctx = this;

        var m = JSON.stringify(ctx.request.body);

        if (ctx.request.body.localData.localOne) {
            delete ctx.request.body.localData.localOne;

            errToken = crypt.creatToken(m);

            redis.incr('loanid');
            redis.sadd('mset', m);

            return ctx.body = {
                msg: '成功',
                success: true
            };
        } else {
            return ctx.body = {
                msg: '失败',
                success: false
            };
        }
    });

    router.get('/getError', function* () {

        var ctx = this;

        var data = yield redis.smembers('mset');

        // var data = async () => {
        //     await redis.smembers('mset');
        // }


        if (data && data.length > 0) {

            ctx.body = {
                code: '0000',
                data: data,
                msg: '成功',
                success: true
            };

        } else {
            ctx.body = {
                code: '1111',
                data: '',
                msg: '失败',
                success: false
            };
        }

    });

};