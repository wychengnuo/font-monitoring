const redis = require('./../server/redis');
const crypt = require('./../ctypto/ctypto').crypt;

const {
    user,
    t,
    register
} = require('./../config/default');
const moment = require('moment');

/**
 * @param edit redis
 */

const editRedis = require('./../module/index');

class ApiUser {

    // 用户注册

    static async register(ctx) {

        let d = ctx.request.body;
        const time = moment().format('YYYY-MM-DD HH:mm:ss');
        d.time = time;

        if (!d) {
            ctx.body  = {
                msg: '失败',
                success: false,
                data: {}
            };
        }

        const token = crypt.creatToken(d);

        new editRedis().hset(register.register, d.username, JSON.stringify(d));

        new editRedis().set(token, d.password, 'EX', t.time);

        ctx.cookies.set('token', token);

        ctx.body  = {
            msg: '成功',
            success: true
        };
    }

    // 用户登录
    static async login(ctx) {

        const d = ctx.request.body;

        let isRegist = await isRegister(ctx);

        if (d.username == user.username && d.password == user.password) {

            const token = crypt.creatToken(user);

            new editRedis().set(token, user.username, 'EX', t.time);

            ctx.cookies.set('token', token);

            ctx.body  = {
                msg: '成功',
                success: true
            };

        } else if (isRegist) {

            isRegist = JSON.parse(isRegist);

            if (isRegist.username == d.username && isRegist.password == d.password) {

                const tdata = crypt.creatToken(d);

                new editRedis().set(tdata, d.username, 'EX', t.time);

                ctx.cookies.set('token', tdata);

                ctx.body = {
                    msg: '成功',
                    success: true
                };
            } else {
                ctx.body  = {
                    msg: '账号密码错误！！！',
                    success: false
                };
            }    

        } else {
            ctx.body  = {
                msg: '账号密码错误！！！',
                success: false
            };
        }
    }

    // 用户退出
    static async layOut(ctx) {

        const token = ctx.cookies.get('token');
        if (!token) {
            ctx.body  = {
                msg: '退出成功',
                success: true
            };
        }
        new editRedis().get(token + '_front_sam_zhang').then(function (value) {

            redis.del(token + '_front_sam_zhang');
            redis.del(value);

        });

        ctx.cookies.set('token', '');

        ctx.body  = {
            msg: '退出成功',
            success: true
        };
    }

    // 获取个人信心接口，只针对注册用户，除配置用户以外

    static async userInfo(ctx, next) {

        const token = ctx.cookies.get('token');

        if (token) {

            const userinfo = await new editRedis().get(token + '_front_sam_zhang');

            /**
             * 直接写死zhangsam超级账户
             */

            if (userinfo == 'zhangsam') {
                return ctx.body  = {
                    success: true,
                    msg: '成功',
                    data: {
                        username: 'Sam Zhang',
                        nickname: 'ZhangSam',
                        time: '2017-06-20'
                    }
                };
            }

            let data = await new editRedis().hget(register.register, userinfo);

            data = JSON.parse(data);

            delete data.password;

            if (data) {
                ctx.body  = {
                    success: true,
                    msg: '成功',
                    data: data
                };
            } else {
                ctx.body  = {
                    success: false,
                    msg: '失败'
                };
            }
        } else {
            ctx.body  = {
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

    const d = await new editRedis().hget(register.register, data.username);

    if (d) {
        return d;
    }

    return s;
};

module.exports = ApiUser;