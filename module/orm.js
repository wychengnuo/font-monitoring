
/**
 * @param rom 通过次类对数据库进行操作
 */

const redis = require('./../server/redis');

class ormModel {

    constructor(...args) {
        this.args = args;
    }

    /**
     * @param loginSet  登录存储操作
     */

    set() {
        redis.set(...this.args);
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

