const redis = require('./../server/redis');
const crypt = require('./../ctypto/ctypto').crypt;

const {
    user,
    t,
    register
} = require('./../config/default');
const moment = require('moment');

class ApiUser {

    // 用户注册

    static async register(ctx) {

        let d = ctx.request.body;
        const time = moment().format('YYYY-MM-DD HH:mm:ss');
        d.time = time;

        if (!d) {
            return ctx.body = {
                msg: '失败',
                success: false,
                data: {}
            };
        }

        const token = crypt.creatToken(d);

        redis.hset(register.register, d.username, JSON.stringify(d));

        redis.set(token + '_front_sam_zhang', d.password, 'EX', t.time);

        ctx.cookies.set('token', token);

        return ctx.body = {
            msg: '成功',
            success: true
        };
    }

    // 用户登录
    static async login(ctx) {

        const d = ctx.request.body;

        const isRegist = await isRegister(ctx);

        if (d.username == user.username && d.password == user.password) {

            const token = crypt.creatToken(user);

            redis.set(token + '_front_sam_zhang', user.username, 'EX', t.time);

            ctx.cookies.set('token', token);

            return ctx.body = {
                msg: '成功',
                success: true
            };

        } else if (isRegist) {

            const d = ctx.request.body;

            const tdata = crypt.creatToken(d);

            redis.set(tdata + '_front_sam_zhang', d.username, 'EX', t.time);

            ctx.cookies.set('token', tdata);

            return ctx.body = {
                msg: '成功',
                success: true
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
        redis.get(token + '_front_sam_zhang').then(function (value) {

            redis.del(token + '_front_sam_zhang');
            redis.del(value);

        });

        ctx.cookies.set('token', '');

        return ctx.body = {
            msg: '退出成功',
            success: true
        };
    }

    // 获取个人信心接口，只针对注册用户，除配置用户以外

    static async userInfo(ctx, next) {

        const token = ctx.cookies.get('token');

        if (token) {

            const userinfo = await redis.get(token + '_front_sam_zhang');

            /**
             * 直接写死zhangsam超级账户
             */

            if (userinfo == 'zhangsam') {
                return ctx.body = {
                    success: true,
                    msg: '成功',
                    data: {
                        username: 'Sam Zhang',
                        nickname: 'ZhangSam',
                        time: '2017-06-20'
                    }
                };
            }

            let data = await redis.hget(register.register, userinfo);

            data = JSON.parse(data);

            delete data.password;

            if (data) {
                return ctx.body = {
                    success: true,
                    msg: '成功',
                    data: data
                };
            } else {
                return ctx.body = {
                    success: false,
                    msg: '失败'
                };
            }
        } else {
            return ctx.body = {
                success: false,
                msg: '请登录'
            };
        }
    }
}

//判断是否注册的用户
const isRegister = async(ctx) => {

    let s = false;

    const data = ctx.request.body;

    const d = await redis.hget(register.register, data.username);

    if (d) {
        s = true;
    }

    return s;
};

module.exports = ApiUser;