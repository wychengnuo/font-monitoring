
const redis = require('./../server/redis');
const crypt = require('./../ctypto/ctypto').crypt;

const { user, t } = require('./../config/default');

class ApiUser {

    // 用户登录
    static async login(ctx) {
        
        if (ctx.request.body.username == user.username && ctx.request.body.password == user.password) {

            const token = crypt.creatToken(user);
            
            redis.set(token, user.password, 'EX', t.time);
            
            ctx.cookies.set('token', token);

            return ctx.body = {
                msg: '成功',
                success: true,
                data: {
                    username: user.username
                }
            };
        } else {
            return ctx.body = {
                msg: '账号密码错误！！！',
                success: false
            };
        }
    }

    // 用户退出
    static async layOut(ctx) {
        
        const token = ctx.cookies.get('token');
        if (!token) {
            return ctx.body = {
                msg: '退出成功',
                success: true
            };
        }
        redis.get(token).then(function (value) {
            
            redis.del(token);
            redis.del(value);

        });

        ctx.cookies.set('token', '');

        return ctx.body = {
            msg: '退出成功',
            success: true
        };
    }


}

module.exports = ApiUser;