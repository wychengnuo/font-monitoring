// const fs = require('fs');
// const path = require('path');
const redis = require('./server/redis');
// const crypt = require('./ctypto/ctypto').crypt;

module.exports = function (router) {
    // var errToken;
    router.post('/basic', function* () {
        
        var ctx = this;
        
        var m = JSON.stringify(ctx.request.body);

        var data = yield redis.smembers('mset');
        
        var isSet = (data.length == 0 || (JSON.parse(data[0]).account !== ctx.request.body.account)) ? true : false;
        
        if (isSet) {
            if (ctx.request.body) {
                // errToken = crypt.creatToken(m);

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
        } else {
            return ctx.body = {
                msg: '失败',
                success: false
            };
        }
        
    });

    router.post('/setError', function* () {
        
        var ctx = this;
        
        var m = JSON.stringify(ctx.request.body);
  
        redis.sadd('msets', m);

        return ctx.body = {
            msg: '成功',
            success: true
        };
        
    });

    router.get('/getError1', function* () {

        var ctx = this;

        var data = yield redis.smembers('msets');

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


    router.get('/getError', function* () {

        var ctx = this;

        var data = yield redis.smembers('mset');

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