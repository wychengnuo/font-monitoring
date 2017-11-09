
/**
 * @param 进行orm实现
 * @param 处理数据库存储
 * @param 所有的数据库操作通过次类来进行
 * @param 对现有的‘表’存储，进行‘规范化’处理
 * @param 根据现有数据库存储结构
 */

const ormModel = require('./orm');

class editMysql {

    constructor(...args) {
        this.args = args;
    }

    /**
     * @param 部门分类
     */

    roleSet(department) {
        return new ormModel({ 'roleName': department }).creat('role');
    }

    /**
     * @param 权限分类
     */

    projectsSet(id) {
        new ormModel({ 'permissionsId': '1','roleId': id }).creat('projects');
    }

    /**
     * @param 查看权限分类
     */

    selectProjects(id) {
        return new ormModel().select('projects', { where: { roleId: id } });
    }

    /**
     * @param 登录方法操作
     */

    userSet(name, nickname, password, roleId) {
        return new ormModel({ 'username': name, 'nickname': nickname, 'password': password, 'roleId': roleId }).creat('user');
    }

    /**
     * @param 登录态方法操作
     */

    tokenSet(token, userId, roleId) {
        new ormModel({ 'id': token, 'userId': userId, 'roleId': roleId }).creat('token');
    }

    /**
     * @param 查看部门是否存在
     */

    selectRole(name) {
        return new ormModel().select('role', { where: { roleName: name } });
    }

    /**
     * @param 查询用户是否存在，单表查询
     */

    selectUser(name) {
        return new ormModel().select('user', { where: { username: name } });
    }

    /**
     * @param 1对1数据表查询
     */

    selectToken(token) {
        return new ormModel().select('token', { where: { id: token } });
    }

    /**
     * @param 根据token id 查询用户信息
     */
    
    selectTokenIdUser(id) {
        return new ormModel().select('user', { where: { id: id } });
    }
    
    /**
     * @param 退出删除登录态方法
     */

    userLayout(token) {
        new ormModel().delete('token', { where: { id: token } });
    }

    /**
     * @param 返回浏览器account 
     */

    getBrowerSet(account) {
        return new ormModel().select('browser', { where: { account: account } });
    }

    /**
     * @param browser 用户浏览器信息
     */

    browerSet(data) {
        new ormModel({
            account: data.account,
            jfVersion: data.jfVersion,
            openTime: data.openTime,
            source: data.source,
            userAgent: data.userAgent,
            appName: data.appName,
            platform: data.platform,
            appVersion: data.appVersion,
            domain: data.domain,
            localUrl: data.localUrl,
            title: data.title,
            referrer: data.referrer,
            lang: data.lang,
            sh: data.sh,
            sw: data.sh,
            cd: data.sh,
            projectId: data.id
        }).creat('browser');
    }

    /**
     * @param getErrorMessageSet
     */

    getErrorMessageSet() {
        return new ormModel().query("select source, method, originalUrl, status, t, time from netErrorMessages where DATE_FORMAT(time, '%Y-%m-%d') >=  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 DAY), '%Y-%m-%d')");
    }

    /**
     * @param getErrorMessageCount
     */

    getErrorMessageCount() {
        return new ormModel().query("SELECT type, DATE_FORMAT(sTime, '%Y-%m-%d') AS sTime, count(*) AS count FROM `errorMessages` AS `errorMessage` where DATE_FORMAT(sTime, '%Y-%m-%d') >=  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 DAY), '%Y-%m-%d') GROUP BY DATE_FORMAT(sTime, '%Y-%m-%d') ,type ORDER BY type, DATE_FORMAT(sTime, '%Y-%m-%d') asc");
    }

    /**
     * @param errorMessage
     */

    errorMessageSet(data) {
        let msg = [];
        let oArr = [];
        if (data.sMsg.length > 244) {
            msg.push(data.sMsg.split('at')[3]);
            msg.push(data.sMsg.split('at')[5]);
        }
        if (data.eObj.length > 244) {
            oArr.push(data.eObj.split('at')[3]);
            oArr.push(data.eObj.split('at')[5]);
        }
        msg = msg.toString();
        oArr = oArr.toString();
        new ormModel({
            type: data.type,
            sMsg: msg || data.sMsg,
            sUrl: data.sUrl,
            sLine: data.sLine,
            sColu: data.sColu,
            eObj: oArr || data.eObj,
            sTime: data.sTime,
            browerType: data.browerType,
            projectId: data.id
        }).creat('errorMessage');
    }

    /**
     * @param netMessageSet
     */

    netMessageSet(data) {
        new ormModel({
            source: data.source||'management',
            method: data.method,
            originalUrl: data.originalUrl,
            status: data.status,
            t: data.t,
            time: data.time,
            msg: data.msg,
            projectId: data.id
        }).creat('netErrorMessage');
    }

    /**
     * @param 分页查看message
     */

    messageFindAll(currentPage, countPerPage) {
        return new ormModel().findAndCountAll('messPush', { 'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
    }

    /**
     * @param messagePush
     */

    messPush(data) {
        new ormModel({
            channl: data.channl,
            content: data.content,
            isEnable: data.isEnable,
            time: data.time,
            uerTypes: data.uerTypes,
            projectId: data.id
        }).creat('messPush');
    }

    /**
     * @param 获取所有安卓插件项目
     */

    getPlugAnAll() {
        return new ormModel().findAll('plugAn');
    }

    /**
     * @param andir 插件项目查询
     */

    getPlugAn(name) {
        return new ormModel().select('plugAn', { where: { name: name } });
    }

    /**
     * @param andir 插件项目管理
     */

    plugAnSet(data) {
        return new ormModel({
            name: data.account,
            version: data.version,
            time: data.time,
            projectId: data.id
        }).creat('plugAn');
    }

    /**
     * @param andir 插件列表id
     */
    
    getPlugAnListId(name) {
        return new ormModel().select('plugAnList', { where: { plugListName: name } });
    }

    /**
     * @param 查询所有插件列表
     */

    getPlugFindAndCountAll(id) {
        return new ormModel().findAll('plugAnList', { where: { plugAnId: id } });
    }

    /**
     * @param andir 插件列表
     */
    
    plugAnList(data) {
        new ormModel({
            plugListName: data.plugName,
            describe: data.describe,
            category: data.category,
            time: data.time,
            plugAnId: data.plugAnId,
            projectId: data.id
        }).creat('plugAnList');
    }

    /**
     * @param 删除插件数据
     */
    
    deletePlugAnList(id) {
        return new ormModel().delete('plugAnList', { where: { id: id } });
    }

    /**
     * @param andir 插件列表id
     */

    getPlugAnListInfoId(name, version) {
        return new ormModel().select('plugAnListInfo', { where: { name: name, plugVersion: version } });
    }

    /**
     * @param andir 设置插件列表id
     */

    getPlugAnListInfoIds(plugName) {
        return new ormModel().select('plugAnListInfo', { where: { plugName: { '$like': '%' + plugName} } });
    }
    
    /**
     * @param 根据插件列表id，查询其所有列表详情插件
     */

    getPlugAnListInfoAll(id) {
        return new ormModel().findAll('plugAnListInfo', { where: { plugAnListId: id } });
    }

     /**
     * @param 设置插件版本插件的状态
     */

    updatePlugAnListId(id, isEnable) {
        new ormModel().update('plugAnListInfo', { isEnable: isEnable }, { where: { id: id } });
    }

    /**
     * @param 设置长连接信息状态
     */

    updateMessage(id, isEnable) {
        new ormModel().update('messPush', { isEnable: isEnable }, { where: { id } });
    }

    /**
     * @param 根据id删除插件数据
     */

    deletePlugAnListId(id) {
        new ormModel().delete('plugAnListInfo', { where: { id: id } });
    }

    /**
     * @param 根据id删除下载量统计
     */

    deletePlugDownId(id) {
        new ormModel().delete('plugDown', { where: { id: id } });
    }

    /**
     * @param 根据id删除长连接信息
     */

    deleteMessageId(id) {
        new ormModel().delete('messPush', { where: { id: id } });
    }

    /**
     * @param 根据plugAnId 删除插件数据
     */

    deletePlugAnId(id) {
        new ormModel().delete('plugAnListInfo', { where: { id: id } });
    }

    /**
     * @param andir 插件列表版本
     */
  
    plugAnListInfo(data) {
        new ormModel({
            channl: data.channl,
            fileSize: data.fileSize,
            isEnable: data.isEnable,
            name: data.name,
            optionsRadios: data.optionsRadios,
            path: data.path,
            plugName: data.plugName,
            plugVersion: data.plugVersion,
            systemVer: data.systemVer,
            textarea: data.textarea,
            time: data.time,
            version: data.version,
            plugAnListId: data.plugAnListId,
            projectId: data.id
        }).creat('plugAnListInfo');
    }

    /**
     * @param 下载量累加
     */

    getPlugDownId(where) {
        return new ormModel().findAll('plugDown', { where: where });
    }

    /**
     * @param 插件下载量统计
     */

    async plugDown(data, id) {
        new ormModel({
            name: data.channel,
            sum: 1,
            mobileModel: data.mobileModel,
            mobileVersion: data.mobileVersion,
            networkType: data.networkType,
            romInfo: data.romInfo,
            appVersion: data.appVersion,
            imei: data.imei,
            plugAnListInfoId: id
        }).creat('plugDown');
    }

    /**
     * @param 更新下载量id
     */

    updatePlugDownId(data, a) {
        return new ormModel().update('plugDown',  { sum: data.sum + a }, { where: { name: data.name } });  
    }

	/**
     * 获取一周内下载量
     * @returns {*}
     */
    getPlugDownLoads() {
        return new ormModel().query("select name, DATE_FORMAT(utime, '%Y-%m-%d') as time, sum from plugDowns where DATE_FORMAT(utime, '%Y-%m-%d') >=  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 DAY), '%Y-%m-%d')");
    }

    /**
     * @param 分页查看
     */

    getFindAllData(str, currentPage, countPerPage, id) {
        if (id) {
            return new ormModel().findAndCountAll(str, { where: { plugAnListId: id }, 'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
        } else {
            return new ormModel().findAndCountAll(str, {'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
        }
    }

    /**
     * @param 插件下载对外地址
     */

    getPlugAnListInfoData(version, channl, systemVer) {
        return new ormModel().findAll('plugAnListInfo', { where: { channl, version, systemVer } });
    }


	/**
     * 根据状态和平台获取数据
     * @param plant
     * @returns {*}
     */
    getMessageByStatus(plant) {
        return new ormModel().query('select content from messPushes where isEnable = TRUE and ' + plant + ' in (plant)');
    }

	/**
     * 根据where条件查询数据
     * @param str
     * @param where
     * @returns {*}
     */
    getData(str, where) {
        return new ormModel().findAll(str, { where: where });
    }
   
}

module.exports = exports = editMysql;