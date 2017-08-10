
/**
 * 路由整体控制,重写第三次
 */

const router = require('koa-router')();
const api = require('./api');
const andirApi = require('./andirPlugin');
const user = require('./user');
const oauth = require('./../oauth/oauth');


const multer = require('koa-multer');


const storage = multer.diskStorage({
    //文件保存路径  
    destination: function (req, file, cb) {
        cb(null, 'public/download/');
    },
    //修改文件名称  
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split('.');
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

const upload = multer({ storage: storage });

/**
 * oauth 权限控制
 * 1、login 用户登录
 * 2、setBasic 存储用户版本信息
 * 3、getBasic 获取用户版本信息
 * 4、setHtmlError 存储端页面报错信息
 * 5、getHtmlError 获取前端页面报错信息
 * 6、getLogs 获取后端接口报错
 * 7、layOut  用户退出接口
 * 8、typeErr 页面js错误返回数据合并
 * 9、getUrlErr 接口错误返回数据合并
 */


router
    .post('/api/login', user.login)
    .post('/api/register', user.register)
    .get('/api/userInfo', oauth.user, user.userInfo)
    .post('/api/setBasic', oauth.pass, api.setBasic)
    .get('/api/getBasic', oauth.user, api.getBasic)
    .post('/api/setHtmlError', oauth.pass, api.setHtmlError)
    .get('/api/getHtmlError', oauth.user, api.getHtmlError)
    .get('/api/getLogs', oauth.user, api.getLogs)
    .get('/api/pageError', oauth.user, api.pageError)
    .get('/api/typeErr', oauth.user, api.getTypeErr)
    .get('/api/getUrlErr', oauth.user, api.getUrlErr)
    .post('/api/layout', user.layOut)
    .post('/api/setPlug', oauth.pass, api.setPlug)
    .get('/api/getPlug', oauth.pass, api.getPlug)
    .post('/api/settingPlug', oauth.pass, api.settingPlug)
    .post('/api/setPlugList', oauth.pass, api.setPlugList)
    .get('/api/getPlugList', oauth.pass, api.getPlugList)
    .post('/api/setPlugListInfo', upload.single('file'), api.setPlugListInfo)
    .get('/api/getPlugListInfo', oauth.pass, api.getPlugListInfo)
    .post('/api/delPlug', oauth.pass, api.delPlug)
    .get('/api/getPlugDownloads', oauth.pass, api.getPlugDownloads)
    .post('/api/isLogin', api.isLogin);


/**
 * andir app端单独提出来
 */

router
    .get('/api/andirApi', oauth.pass, andirApi.andirAppPlugin);



module.exports = router;