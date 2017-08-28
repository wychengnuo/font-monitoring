
/**
 * @param 进行orm实现
 * @param 处理数据库存储
 * @param 所有的数据库操作通过次类来进行
 * @param 对现有的‘表’存储，进行‘规范化’处理
 * @param 根据现有数据库存储结构
 */

const ormModel = require('./orm');

class editRedis {

    constructor(...args) {
        this.args = args;
    }

    /**
     * @param 登录方法操作
     */

    set(id, name, type, lengtTime) {

        this.id = id;
        this.name = name;
        this.type = type;
        this.lengtTime = lengtTime;

        new ormModel(`${id}_front_sam_zhang`, name, type, lengtTime).set();
    }

    /**
     * @param download 下载量统计
     */

    downSet(id, number = null) {

        this.id = id;
        this.number = number;

        if (number) {

            new ormModel(id, number).downSet();

        } else {

            new ormModel(id).downIncr();

        }

    }

    /**
     * @param 数据库查询方法
     */

    get(id, name = null, type = null, lengtTime = null) {

        this.id = id;
        this.name = name;
        this.type = type;
        this.lengtTime = lengtTime;

        return new ormModel(id).get();
    }

    /**
     * @param hash 存储数据
     */
    
    hset(id, name, value) {

        this.id = id;
        this.name = name;
        this.value = value;

        new ormModel(id, name, value).hset();
    }

    /**
     * @param hvals 获取数据
     */

    hvals(id, name = null, value = null) {

        this.id = id;
        this.name = name;
        this.value = value;

        return new ormModel(id).hvals();
    }

    /**
     * @param hget 
     */
    
    hget(id, name) {

        this.id = id;
        this.name = name;

        return new ormModel(id, name).hget();
    }

    /**
     * @param 根据索引查询数据
     */

    lrange(id, fir, send) {

        this.id = id;
        this.fir = fir;
        this.send = send;

        return new ormModel(id, fir, send).lrange();
    }

    /**
     * @param set集合
     */

    sadd(id, name) {

        this.id = id;
        this.name = name;

        new ormModel(id, name).sadd();
    }

    /**
     * @param 创建空列表
     */

    rpush(id, value) {

        this.id = id;
        this.value = value;

        new ormModel(id, value).rpush();
    }

    /**
     * @param  获取集合数据
     */

    smembers(id) {
        
        this.id = id;

        return new ormModel(id).smembers();
    }

    /**
     * @param length
     */
    
    llen(key) {
        
        this.key = key;

        return new ormModel(key).llen();
    }

    /**
     * @param 根据索引更新数据
     */

    lset(id, order, value) {
        
        this.id = id;
        this.order = order;
        this.value = value;

        new ormModel(id, order, value).lset();
    }

    /**
     * @param del 
     */

    lrem(id, order, value) {

        this.id = id;
        this.order = order;
        this.value = value;

        new ormModel(id, order, value).lrem();
    }

    /**
     * @param hdel
     */

    hdel(id, value) {
        
        this.id = id;
        this.value = value;

        return new ormModel(id, value).hdel();
    }

    /**
     * @param all keys
     */

    keys(id) {

        this.id = id;

        return new ormModel(id).keys();
    }
   
}

module.exports = exports = editRedis;