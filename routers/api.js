const isSet = require('./../utils/isSet');
const {
    keys,
    longTimeKeys
} = require('./../config/default');

const redis = require('./../server/redis');
const moment = require('moment');

const fs = require('fs');
const path = require('path');

/**
 * @param edit redis
 */

const editRedis = require('./../module/index');

/**
 * @param 接口暂时统一处理
 */

class ApiController {

    // 存储用户版本信息
    static async setBasic(ctx) {

        const m = JSON.stringify(ctx.request.body);

        const data = await new editRedis().smembers(keys.mset);

        const isOk = isSet(data, ctx);

        if (isOk) {
            if (ctx.request.body) {

                new editRedis().sadd(keys.mset, m);

                ctx.body = {
                    msg: '成功',
                    success: true
                };
            } else {
                ctx.body = {
                    msg: '失败',
                    success: false
                };
            }
        } else {
            ctx.body = {
                msg: '失败',
                success: false
            };
        }
    }

    //获取用户版本信息    
    static async getBasic(ctx, next) {
        await getDate(ctx, next, keys.mset);
    }

    // 存储端页面报错信息
    static async setHtmlError(ctx) {

        const m = JSON.stringify(ctx.request.body);

        new editRedis().sadd(keys.msets, m);

        new editRedis().rpush(keys.msets+ '_list', m);

        ctx.body = {
            msg: '成功',
            success: true
        };
    }

    // 获取前端页面报错信息
    static async getHtmlError(ctx, next) {
        await paging(ctx, keys.msets+ '_list');

    }

    // 获取后端接口报错
    static async getLogs(ctx, next) {
        await getDate(ctx, next, keys.errlogs);
    }

    // 后端接口报错分页查询pageError

    static async pageError(ctx) {

        await paging(ctx, keys.pageError);
    }

    // 对返回错误信息进行处理 
    static async getTypeErr(ctx, next) {
        const d = await new editRedis().smembers(keys.msets);
        let a = [];
        for (let i in d) {
            const c = JSON.parse(d[i]);
            for (let e in c) {
                const f = JSON.parse(c[e]);
                a.push(f.type);
            }
        }
        const data = await type(a);
        ctx.body = {
            success: true,
            data: data,
            msg: '成功'
        };
        // await next();
    }

    // 对接口错误信息返回进行处理

    static async getUrlErr(ctx, next) {
        const d = await new editRedis().smembers(keys.errlogs);
        let a = [];
        for (let i in d) {
            const c = JSON.parse(d[i]);
            a.push(c.originalUrl);
        }
        const data = await type(a);
        ctx.body = {
            success: true,
            data: data,
            msg: '成功'
        };
    }

    // 添加项目

    static async setPlug(ctx, next) {

        const m = JSON.stringify(ctx.request.body);
        const data = await new editRedis().hvals('front_sam_zhang_plugList');
        const isOk = isSet(data, ctx);

        if (isOk) {
            if (ctx.request.body) {

                new editRedis().rpush(longTimeKeys.plug, m);
                
                new editRedis().hset('front_sam_zhang_plugList', ctx.request.body.account, m);

                ctx.body = {
                    msg: '成功',
                    success: true
                };
            } else {
                ctx.body = {
                    msg: '失败',
                    success: false
                };
            }
        } else {
            ctx.body = {
                msg: '失败',
                success: false
            };
        }
    }

    // 获取项目

    static async getPlug(ctx, next) {

        await getDate(ctx, next, 'front_sam_zhang_plugList', 1);
    }

    // 删除项目

    static async deleteAndirPlug(ctx, next) {

        const value = ctx.request.body.account;

        if (value) {
            const num = await new editRedis().hdel('front_sam_zhang_plugList', value);
            if (num === 1) {
                return ctx.body = {
                    success: true,
                    msg: '删除成功'
                };
            } else {
                return ctx.body = {
                    success: false,
                    msg: '删除失败'
                };
            }
        }
        return ctx.body = {
            success: false,
            msg: '删除失败'
        };

    }

    // 添加项目--添加分组项目

    static async setPlugList(ctx, next) {
        let m = {};
        m = ctx.request.body;
        m.time = moment().format('YYYY-MM-DD HH:mm:ss');
        m = JSON.stringify(ctx.request.body);

        if (ctx.request.body.plugName) {

            new editRedis().hset(ctx.request.body.category, ctx.request.body.plugName, m);

            ctx.body = {
                msg: '成功',
                success: true
            };
        } else {
            ctx.body = {
                msg: '失败',
                success: false
            };
        }
    }

    // 添加项目--获取分组项目

    static async getPlugList(ctx, next) {
        const str = ctx.query.category;
        await getDate(ctx, next, str, 1);
    }

    // 添加项目--添加分组项目--添加分组项目详情插件

    static async setPlugListInfo(ctx) {

        /**
         * 存储文件
         */
        

        const file = ctx.request.body.files.file;

        let version = ctx.request.body.fields.plugVersion;

        /**
         * 防止没有上传文件直接提交
         */

        if (!file.name) {

            ctx.redirect(ctx.headers.referer);

            ctx.body = {
                success: false,
                msg: '请选择上传文件'
            };
        }

        if (!version) {
            version = new Date() - 0;
        }

        const reader = fs.createReadStream(file.path);
        const homeDir = path.resolve(__dirname, '..');
        const baseUrl = homeDir + '/public/download/' + ctx.request.body.fields.name;
        let fileName = file.name.split('.');
        fileName = fileName[0] + '_' + version + '.' + fileName[1];
        let newpath = homeDir + '/public/download/' + ctx.request.body.fields.name + '/' + fileName;

        /**
         * 检查插件组文件夹是否存在，不存在创建
         */

        if (!fs.existsSync(baseUrl)) {
            fs.mkdirSync(baseUrl);
        }

        const stream = fs.createWriteStream(newpath);
        const fileSize = (file.size / 1024).toFixed(2);
        reader.pipe(stream);

        /**
         * 存储
         */

        let o = ctx.request.body.fields;
        o.time = moment().format('YYYY-MM-DD HH:mm:ss');
        o.plugName = fileName;
        o.fileSize = fileSize;
        o.path = '/public/download';

        /**
         * 用于分页，供前端分页查看
         */

        new editRedis().rpush(ctx.request.body.fields.name + '_plug', JSON.stringify(o));

        ctx.redirect(ctx.headers.referer);

    }

    /**
     * 查看项目 -- 分组项目 -- 详情插件
     */

    static async getPlugListInfo(ctx, next) {

        const keys = ctx.query.category + '_plug';

        await paging(ctx, keys);
    }

    /**
     * @param {obj} 项目--插件-控制
     * @param {num}
     * 1、停用 2、启用 3、删除
     */

    static async settingPlug(ctx, next) {

        const {
            num,
            order,
            name
        } = ctx.request.body;

        let data = await new editRedis().lrange(name + '_plug', order, order);
        let d;

        d = JSON.parse(data);
        d.time = moment().format('YYYY-MM-DD HH:mm:ss');

        if (num == '1') {

            d.isEnable = 'true';

        } else if (num == '2') {

            d.isEnable = 'false'; // 是否停用

        }

        /**
         * 根据num 来区分功能
         * 1、启用
         * 2、停用
         * 3、删除
         * 根据oeder 定位插件的位置
         * 进行插件属性修改以及删除操作
         */

        if (num == '1' || num == '2') {

            new editRedis().lset(name + '_plug', order, JSON.stringify(d));

            ctx.body = {
                success: true,
                msg: '操作成功',
                data: data
            };
        } else {

            /**
             * 删除数据库字段
             */

            const n = JSON.parse(data).plugName;

            const homeDir = path.resolve(__dirname, '..');
            const newpath = homeDir + '/public/download/' + ctx.request.body.name + '/' + n;
            fs.unlink(newpath);
            new editRedis().lrem(name + '_plug', order, data);
            ctx.body = {
                success: true,
                msg: '删除成功'
            };
        }
    }

    /**
     * del 删除分组项目
     */
    
    static async delPlug(ctx, next) {

        const name = ctx.request.body.name;
        const plugName = ctx.request.body.plugName;

        const homeDir = path.resolve(__dirname, '..');

        const newpath = homeDir + '/public/download/' + plugName;

        /**
         * 遍历删除文件
         */

        deleteFolder(newpath);

        const d = await new editRedis().hdel(name, plugName);

        redis.del(plugName + '_plug');

        if (d == 0) {
            ctx.body = {
                success: false,
                msg: '操作失败'
            };
        }

        ctx.body = {
            success: true,
            msg: '操作成功'
        };
    }

    /**
     * 判断登录
     */

    static async isLogin(ctx, next) {
        const token = ctx.cookies.get('token');

        if (!token) {
            ctx.body = {
                msg: '请登录',
                success: false
            };
        }

        const val = await new editRedis().get(token + '_front_sam_zhang');

        if (!val) {
            ctx.body = {
                msg: '请登录',
                success: false
            };
        } else {
            ctx.body = {
                msg: '成功',
                success: true
            };
        }
        // await next();
    }


    /**
     * 获取下载量
     */

    static async getPlugDownloads(ctx, next) {
        const d = await redis.keys('*front_sam_zhang_plugDownloads*');
        
        const data = await downloads(d);
        
        if (data) {
            ctx.body = {
                success: true,
                data: data,
                msg: '成功'
            };
        } else {
            ctx.body = {
                success: false,
                data: {},
                msg: '失败'
            };
        }
    }
}

/**
 * 默认获取参数的方法
 */

const getDate = async(ctx, next, str, num) => {

    let data;

    if (num) {
        data = await new editRedis().hvals(str);
    } else {
        data = await new editRedis().smembers(str);
    }

    if (data && data.length > 0) {

        ctx.body = {
            data: data,
            msg: '成功',
            success: true
        };

    } else {
        ctx.body = {
            data: [],
            msg: '成功',
            success: true
        };
    }
};

/**
 * err 分类返回
 */

const type = (d) => {
    const a = d.reduce((pre, cur) => {
        if (pre[cur]) {
            pre[cur].y++;
        } else {
            pre[cur] = {
                name: cur,
                y: 1
            };
        }
        return pre;
    }, {});

    return Object.values(a);
};

/**
 * 分页处理
 */

const paging = async(ctx, keys) => {

    let page = ctx.query.page ? ctx.query.page : 1;
    let pageSize = ctx.query.pageSize ? ctx.query.pageSize : 10;
    const dataLeng = await new editRedis().llen(keys);
    let data;

    if (dataLeng > 10) {
        page = page * 10 - 10;
        pageSize = (pageSize * ctx.query.page) - 1;
        data = await new editRedis().lrange(keys, page, pageSize);
    } else {
        data = await new editRedis().lrange(keys, 0, 9);
    }

    if (data) {
        ctx.body = {
            success: true,
            data: data,
            msg: '成功',
            pageSize: Math.ceil(dataLeng / 10)
        };
    } else {
        ctx.body = {
            success: false,
            data: {},
            msg: '失败',
            pageSize: 0
        };
    }

};

/**
 * delete files
 */

let deleteFolder = (newpath) => {

    let files = [];

    if (fs.existsSync(newpath)) {

        files = fs.readdirSync(newpath);

        files.forEach(function (file, index) {

            let curPath = newpath + '/' + file;

            if (fs.statSync(curPath).isDirectory()) { // recurse

                this.deleteFolter(curPath);

            } else {

                fs.unlinkSync(curPath);

            }
        });
        fs.rmdirSync(newpath);
    }
};

/**
 * 下载量处理
 */

const downloads = async (d) => {
    let arr = {};
    return (async () => {
        const b = d.map(async v => arr[v] = await new editRedis().get(v));
        const c = await Promise.all(b);
        return arr;
    })();
};

module.exports = ApiController;