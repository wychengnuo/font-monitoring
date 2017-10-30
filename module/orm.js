
/**
 * @param rom 通过次类对数据库进行操作
 */

const redis = require('./../server/redis');
const db = require('./orm/concat.js');

class ormModel {

    constructor(...args) {
        this.args = args;
    }

    /**
     * @param 增加数据方法
     */

    returnCreat(str) {
        return db[str].create(...this.args);
    }

    creat(str) {
        db[str].create(...this.args);
    }

    /**
     * @param 查询方法
     */

    select(str, name) {
        return db[str].findOne({ where: { name } });
    }

    /**
     *@param 查询user信息
     */

    selectUser(str, username) {
        return db[str].findOne({ where: { username } });
    }

    /**
     * 
     * @param 1对1查询
     */

    selectUserInfo(str, id) {
        return db[str].findOne({ where: { id } });
    }

    /**
     * @param 查询account
     */

    selectAccount(str, account) {
        return db[str].findOne({ where: { account } });
    }

    /**
     * @param 查询插件列表id
     */

    selectPlugAnListInfoId(str, plugListName) {
        return db[str].findOne({ where: { plugListName } });
    }

    /**
     * @param 查找设置插件列表id
     */

    selectPlugAnListInfoIds(str, plugName) {
        return db[str].findOne({ where: { plugName: { '$like': '%' + plugName} } });
    }

    /**
     * @param 更新插件版本详细信息状态
     */

    setPlugupdate(str, plugName, isEnable) { 
        db[str].update({ isEnable: isEnable }, { where: { plugName: { '$like': '%' + plugName } } });
    }

    /**
     * @param 更新长连接信息状态
     */

    setMessageupdate(str, id, isEnable) { 
        db[str].update({ isEnable: isEnable }, { where: { id } });
    }

    /**
     * @param 删除插件数据
     */

    delPlugAnListInfo(str, id) { 
        db[str].destroy({ where: { id: id } });
    }

    /**
     * @param 更新插件下载量
     */

    update(str, sum, name) { 
        db[str].update({ sum: sum }, { where: { name } });
    }
    
    /**
     * @param 删除数据方法
     */

    delete(str, token) {
        db[str].destroy({ where: { id: token } });
    }

    /**
     * @param 根据name删除插件列表
     */

    deletePlugAnList(str, name) {
        db[str].destroy({ where: { plugListName: name } });
    }

    /**
     * @param 根据plugAnListId删除插件列表
     */

    deletePlugAnListId(str, id) {
        db[str].destroy({ where: { plugAnListId: id } });
    }

    /**
     * @param 查看分页数据
     */

    findAndCountAll(str, currentPage, countPerPage, id) {
        return db[str].findAndCountAll({ where: { plugAnListId: id }, 'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
    }

    /**
     * @param 利用id查看分页数据
     */

    idFindAndCountAll(str, currentPage, countPerPage) {
        return db[str].findAndCountAll({'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
    }

    /**
     * @param 查看所有数据
     */

    findAll(str) {
        return db[str].findAll();
    }
    
    /**
     * @param 联合查询插件版本
     */

    plugFindAndCountAll(str, plugAnId) {
        return db[str].findAll({ where: { plugAnId } });
    }

    /**
     * @param 查询插件版本详细信息
     */
    getPlugAnListInfoIdAll(str, plugAnListId) {
        return db[str].findAll({ where: { plugAnListId } });
    }

    /**
     * @param 插件对外下载接口
     */

    plugPlugAnInfo(str, version, channl, systemVer) {
        return db[str].findAll({ where: { channl, version, systemVer } });
    }
    
    
    
    
    
    
    
    
    
    
    

    /**
     * @param 下载量统计 存储操作
     */
    
    downSet() {
        redis.set(...this.args);
    }

    /**
     * @param 下载量统计++ 自增id
     */
    
    downIncr() {
        redis.incr(...this.args);
    }

    /**
     * @param 查找值
     */

    get() {
        return redis.get(...this.args);
    }

    /**
     * @param hset 
     */

    hset() {
        redis.hset(...this.args);
    }

    /**
     * @param hvals
     */

    hvals() {
        return redis.hvals(...this.args);
    }

    /**
     * @param hget 
     */
    
    hget() {
        return redis.hget(...this.args);
    }

    /**
     * @param 根据索引查询数据
     */

    lrange() {
        return redis.lrange(...this.args);
    }

    /**
     * @param set集合
     */

    sadd() {
        redis.sadd(...this.args);
    }

    /**
     * @param 创建空列表
     */

    rpush() {
        redis.rpush(...this.args);
    }

    /**
     * @param  获取集合数据
     */

    smembers() {
        return redis.smembers(...this.args);
    }

    /**
     * @param length
     */
    
    llen() {
        return redis.llen(...this.args);
    }

    /**
     * @param 根据索引更新数据
     */

    lset() {
        redis.lset(...this.args);
    }

    /**
     * @param del 
     */

    lrem() {
        redis.lrem(...this.args);
    }

    /**
     * @param hdel
     */

    hdel() {
        return redis.hdel(...this.args);
    }

    /**
     * @param all keys
     */

    keys() {
        return redis.keys(...this.args);
    }

}

module.exports = ormModel;

