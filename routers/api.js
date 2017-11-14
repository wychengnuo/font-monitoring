const moment = require('moment');

const fs = require('fs');
const path = require('path');

/**
 * @param edit redis
 */

const editMysql = require('./../module/index');

const client = require('./../server/redis');

/**
 * @param 接口暂时统一处理
 */

class ApiController {

    // 存储用户版本信息
    static async setBasic(ctx, next) {

        const dt = await new editMysql().selectProjects(ctx.request.body.departmentId);

        let data = await new editMysql().getBrowerSet(ctx.request.body.account, dt.id);

        let d = !data ? {} : data;

        if (ctx.request.body.account != d.account) {

            let da = ctx.request.body;

            da.id = dt.id;

            new editMysql().browerSet(da);

            ctx.body = {
                msg: '成功',
                success: true
            };
        }

        ctx.body = {
            msg: '失败',
            success: false
        };

        await next();
    }

    //获取用户版本信息    
    static async getBasic(ctx, next) {
        let project = await projectId(ctx);
        await paging(ctx, 'browser', project.id);
        await next();
    }

    // 存储端页面报错信息
    static async setHtmlError(ctx, next) {

        const data = ctx.request.body;

        if (!Object.keys(data).length || Object.keys(data)[0] === 'departmentId') {

            return ctx.body = {
                msg: '失败',
                success: false
            };

        }

        const dt = await new editMysql().selectProjects(data.departmentId);

        console.log(dt)

        delete data.departmentId;

        const browerType = require('./../utils/getBrowserType')(ctx.headers['user-agent']);

        for (let i in data) {

            let d = JSON.parse(data[i]);

            d.browerType = browerType;

            d.id = dt.id;

            new editMysql().errorMessageSet(d);
        }

        return ctx.body = {
            msg: '成功',
            success: true
        };
        await next();
    }

    // 获取前端页面报错信息
    static async getHtmlError(ctx, next) {
        let project = await projectId(ctx);
        await paging(ctx, 'errorMessage', project.id);
        await next();
    }

    // 后端接口报错分页查询pageError

    static async pageError(ctx, next) {
        let project = await projectId(ctx);
        await paging(ctx, 'netErrorMessage', project.id);
        await next();
    }

    // 对返回错误信息进行处理 
    static async getTypeErr(ctx, next) {
        let project = await projectId(ctx);
        const d = await new editMysql().getErrorMessageCount(project.id);

        let array, pieArray = [],
            obj = {};
        d.map((v) => {
            array = [];
            for (let j = 6; j >= 0; j--) {
                let date = moment().subtract(j, 'days').format('YYYY-MM-DD'),
                    count = 0;

                if (date == v.sTime) {
                    count = v.count;
                } else if (obj[v.type] && obj[v.type][6 - j] !== 0) {
                    count = obj[v.type][6 - j];
                }
                array.push(count);
            }
            obj[v.type] = array;
        })

        if (d && d.length > 0) {
            d.reduce((pre, cur, index, arr) => {
                if (pre.type === cur.type) {
                    cur.count = pre.count + cur.count;
                } else {
                    pieArray.push({
                        value: pre.count,
                        name: pre.type
                    });
                }

                if (index === arr.length - 1) {
                    pieArray.push({
                        value: cur.count,
                        name: cur.type
                    });
                }
                return cur;
            })

            obj['pieData'] = pieArray;
            ctx.body = {
                success: true,
                data: obj,
                msg: '成功'
            };
        } else {
            ctx.body = {
                success: false,
                data: {},
                msg: '失败'
            };
        }

        await next();
    }

    // 对接口错误信息返回进行处理

    static async getUrlErr(ctx, next) {

        let project = await projectId(ctx);

        const d = await new editMysql().getErrorMessageSet(project.id);

        let array, obj = {};
        d.map(v => {
            array = [];
            if (!obj[v.source]) {
                obj[v.source] = {};
            }
            if (!obj[v.source][v.method]) {
                obj[v.source][v.method] = [];
            }

            array.push(new Date(v.time).getTime());
            array.push(v.t.replace('ms', ''));
            array.push(v.status);
            array.push(v.method);
            array.push(v.originalUrl);

            obj[v.source][v.method].push(array);
        })

        ctx.body = {
            success: true,
            data: obj,
            msg: '成功'
        };
        await next();
    }

    // 添加项目

    static async setPlug(ctx, next) {

        let m = ctx.request.body;

        let project = await projectId(ctx);

        let data = await new editMysql().getPlugAn(m.account, project.id);

        data = !data ? {} : data;

        if (data.plugName != m.account) {

            m.id = data.projectId ? data.projectId : project.id;

            new editMysql().plugAnSet(m);

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
        await next();
    }

    // 获取项目

    static async getPlug(ctx, next) {

        let project = await projectId(ctx);

        const data = await new editMysql().getPlugAnAll(project.id);

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
        await next();
    }

    // 添加项目--添加分组项目

    static async setPlugList(ctx, next) {
        let m = {};
        m = ctx.request.body;
        m.time = moment().format('YYYY-MM-DD HH:mm:ss');

        if (m.plugName) {

            let project = await projectId(ctx);

            const data = await new editMysql().getPlugAn(m.category, project.id);

            const dt = await new editMysql().getPlugAnListId(ctx.request.body.plugName, project.id);

            m.plugAnId = data.id;

            m.id = dt && dt.projectId ? dt.projectId : data.projectId;

            if (dt && dt.plugListName == ctx.request.body.plugName) {
                return ctx.body = {
                    msg: '插件不能重复命名，请检查插件命名，重新输入。。',
                    success: false
                };
            } else {

                new editMysql().plugAnList(m);

                return ctx.body = {
                    msg: '成功',
                    success: true
                };
            }
        } else {
            ctx.body = {
                msg: '失败',
                success: false
            };
        }
        await next();
    }

    // 添加项目--获取分组项目

    static async getPlugList(ctx, next) {

        const str = ctx.query.category;

        let project = await projectId(ctx);

        const data = await new editMysql().getPlugAn(str, project.id);

        const d = await new editMysql().getPlugFindAndCountAll(data.id, project.id);

        if (d && d.length > 0) {

            ctx.body = {
                data: d,
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

        await next();
    }

    // 添加项目--添加分组项目--添加分组项目详情插件

    static async setPlugListInfo(ctx, next) {

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
        const baseUrla = homeDir + '/public/download/' + ctx.request.body.fields.name + '/' + version;
        let fileName = file.name;
        let newpath = homeDir + '/public/download/' + ctx.request.body.fields.name + '/' + version + '/' + fileName;

        /**
         * 检查插件组文件夹是否存在，不存在创建
         */

        if (!fs.existsSync(baseUrl)) {
            fs.mkdirSync(baseUrl);
            if (!fs.existsSync(baseUrla)) {
                fs.mkdirSync(baseUrla);
            }
        } else {
            if (!fs.existsSync(baseUrla)) {
                fs.mkdirSync(baseUrla);
            }
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

        let data = await new editMysql().getPlugAnListId(ctx.request.body.fields.name, ctx.request.body.fields.projectId);

        data = !data ? {} : data;

        if (data.id) {

            o.plugAnListId = data.id;
            o.id = data.projectId;

            new editMysql().plugAnListInfo(o);
        }

        ctx.redirect(ctx.headers.referer);

        await next();
    }

    // 查看项目 -- 分组项目 -- 详情插件

    static async getPlugListInfo(ctx, next) {

        let project = await projectId(ctx);
        const plugAnListId = ctx.query.id;

        await paging(ctx, 'plugAnListInfo', project.id, plugAnListId);
        await next();
    }

    /**
     * @param {obj} 项目--插件-控制
     * @param {num}
     * 1、停用 2、启用 3、删除
     */

    static async settingPlug(ctx, next) {

        const {
            num,
            pathName,
            id,
            version
        } = ctx.request.body;

        let project = await projectId(ctx);

        let isEnable = {};

        if (num == '1') {

            isEnable.isEnable = 'true';

        } else if (num == '2') {

            isEnable.isEnable = 'false'; // 是否停用

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

            new editMysql().updatePlugAnListId(id, isEnable, project.id);

            ctx.body = {
                success: true,
                msg: '操作成功'
            };
        } else {

            /**
             * 删除数据库字段
             */

            const data = await new editMysql().getData('plugAnListInfo', project.id);
            if (data && data.length > 0) {
                const homeDir = path.resolve(__dirname, '..');
                const newpath = homeDir + '/public/download/' + pathName + '/' + version + '/' + data[0].plugName;
                if (fs.existsSync(newpath)) {
                    fs.unlink(newpath);
                }

                let dt = await new editMysql().getPlugAnListInfoAll(id, project.id);

                if (dt && dt.length > 0) {
                    new editMysql().deletePlugDownId(dt[0].id, project.id);
                }

                new editMysql().deletePlugAnListId(id, project.id);

                ctx.body = {
                    success: true,
                    msg: '删除成功'
                };
            }
        }

        await next();
    }

    /**
     * del 删除分组项目
     */

    static async delPlug(ctx, next) {

        let project = await projectId(ctx);

        const plugName = ctx.request.body.plugName;

        const id = ctx.request.body.id;

        const homeDir = path.resolve(__dirname, '..');

        const newpath = homeDir + '/public/download/' + plugName;


        /**
         * 遍历删除文件
         */

        deleteFolder(newpath);
        const data = await new editMysql().getPlugAnListId(plugName, project.id);

        const dataAll = await new editMysql().getPlugAnListInfoAll(data.id, project.id);

        if (dataAll.length) {

            await new editMysql().deletePlugAnId(dataAll[0].plugAnListId, project.id);

            await new editMysql().deletePlugAnList(plugName, project.id);

        } else {
            await new editMysql().deletePlugAnList(id, project.id);
        }

        ctx.body = {
            success: true,
            msg: '操作成功'
        };

        await next();
    }

    /**
     * 判断登录
     */

    static async isLogin(ctx, next) {

        const token = ctx.cookies.get('token');

        if (!token) {
            return ctx.body = {
                msg: '请登录',
                success: false
            };
        }

        const val = await new editMysql().selectToken(token);

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
        await next();
    }

    // 获取下载量（一周）

    static async getPlugDownloads(ctx, next) {

        let project = await projectId(ctx);
        const data = await new editMysql().getPlugDownLoads(project.id);

        let arr, obj = {},
            pieArray = [];
        
        
        data.map(async (v) => {
            arr = [];
            for (let j = 6; j >= 0; j--) {
                
                let date = moment().subtract(j, 'days').format('YYYY-MM-DD'),
                    count = 0;
                
                if (date == v.time) {
                    count = v.sum + sumb;
                } else if (obj[v.name] && obj[v.name][6 - j] !== 0) {
                    count = obj[v.name][6 - j];
                }
                
                arr.push(count);
            }
            obj[v.name] = arr;
        })

        if (data && data.length > 0) {

            data.reduce(async (pre, cur, index, arr) => {
                if (pre.name === cur.name) {
                    cur.sum = pre.sum + cur.sum;
                } else {
                    pieArray.push({
                        value: pre.sum,
                        name: pre.name
                    });
                }

                if (index === arr.length - 1) {
                    pieArray.push({
                        value: cur.sum,
                        name: cur.name
                    });
                }
                return cur;
            })

            obj['pieData'] = pieArray;

            ctx.body = {
                success: true,
                data: obj,
                msg: '成功'
            };
        } else {
            ctx.body = {
                success: false,
                data: {},
                msg: '失败'
            };
        }

        await next();
    }

    static async getPlugSearch(ctx, next) {

        let project = await projectId(ctx);
        let channelList = await new editMysql().getPlugChannelList(project.id);
        let nameList = await new editMysql().getPlugNamelList(project.id);
        let versionList = await new editMysql().getPlugVersionlList(project.id);

        let data = {
            channelList: channelList || [],
            nameList: nameList || [],
            versionList: versionList || []
        }

        ctx.body = {
            success: true,
            data: data,
            msg: '成功'
        };

        next();
    }

    // 获取下载量（全部）

    static async getPlugDownList(ctx, next) {

        let project = await projectId(ctx);
        let currentPage = ctx.query.page ? ctx.query.page : 1;
        let countPerPage = ctx.query.pageSize ? ctx.query.pageSize : 10;
        let plugChannel = ctx.query.channel || '';
        let plugName = ctx.query.name || '';
        let plugVersion = ctx.query.version || '';

        let data = await new editMysql().getPlugDownList(Number(currentPage), Number(countPerPage), plugChannel,
            plugName, plugVersion, project.id);
        let obj = await new editMysql().getPlugDownList(Number(currentPage), Number(countPerPage), plugChannel,
            plugName, plugVersion, project.id, true);

        if (obj.length > 0 && obj[0].count > 0) {
            ctx.body = {
                success: true,
                data: {
                    list: data,
                    totalCount: Math.ceil(obj[0].count / Number(countPerPage))
                },
                msg: '成功',
                pageSize: Math.ceil(data.length / Number(countPerPage))
            };
        } else {
            ctx.body = {
                success: false,
                data: {
                    list: [],
                    totalCount: 0
                },
                msg: '失败'
            };
        }

        await next();
    }

}

/**
 * @param 返回权限id
 */

const projectId = async(ctx) => {

    const da = await new editMysql().selectToken(ctx.headers.cookie.split('=')[1])

    const dt = await new editMysql().selectProjects(da.roleId);

    return dt;
}

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

const paging = async(ctx, str, projectId, plugAnListId) => {

    let currentPage = ctx.query.page ? ctx.query.page : 1;
    let countPerPage = ctx.query.pageSize ? ctx.query.pageSize : 10;

    let data = await new editMysql().getFindAllData(str, Number(currentPage), Number(countPerPage), projectId, plugAnListId);

    if (data.rows.length) {
        ctx.body = {
            success: true,
            data: data.rows,
            msg: '成功',
            pageSize: Math.ceil(data.count / Number(countPerPage))
        };
    } else {
        ctx.body = {
            success: false,
            data: {},
            msg: '失败'
        };
    }

};

/**
 * delete files
 */

let deleteFolder = (newpath) => {

    let files = [];
    let filess = [];

    if (fs.existsSync(newpath)) {

        files = fs.readdirSync(newpath);

        if (fs.existsSync(newpath + '/' + files)) {

            filess = fs.readdirSync(newpath + '/' + files);

            filess.forEach(function (file, index) {

                let curPath = newpath + '/' + files + '/' + file;


                if (fs.statSync(curPath).isDirectory()) { // recurse

                    this.deleteFolter(curPath);

                } else {

                    fs.unlinkSync(curPath);

                }
            });
            fs.rmdirSync(newpath + '/' + files);
            fs.rmdirSync(newpath);
        }
    }
};

module.exports = ApiController;