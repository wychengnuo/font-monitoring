
/**
 * 对前端请求进行拦截，实现一个最垃圾的拦截器
 * 权限控制
 * 1、直接通过，不需要登录    pass
 * 2、需要登录， user
 */

const redis = require('./../server/redis');

class oauth {

    // 不需要登录
    static async pass(ctx, next) {

        try {
            await next();
        } catch (error) {
            throw error;
        }
    }

    // 需要登录
    static async user(ctx, next) {

        const token = ctx.cookies.get('token');

        if (!token) {
            return ctx.body = {
                msg: '请登录',
                success: false
            };
        }

        const val = await redis.get(token);
        
        if (!val) {
            return ctx.body = {
                msg: '请登录',
                success: false
            };
        }

        await next();
    }

}


module.exports = oauth;