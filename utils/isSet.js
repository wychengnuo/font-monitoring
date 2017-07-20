
/**
 * 判断是否符合条件存库
 * @param obj === undefied 或者 不是对象的时候，直接return false，不可放入数据库
 * @param obj 没有长度的时候，直接return true，可以放入数据库
 * @param obj 去重处理
 */

function isSet(obj, ctx) {

    const account = ctx.request.body.account;
    let o = {};
    let r = [];
    if (obj === 'undefied' && typeof obj !== 'object') {
        return false;
    }
    if (!obj.length) {
        return true;
    }
    for (let i in obj) {
        let e = JSON.parse(obj[i]);
        if (!o[e.account]) {
            o[e.account] = true;
            r.push(e.account);
        }
    }

    let i = r.length; 
    
    while (i--) {  
        if (r[i] === account) {  
            return false;  
        }
    }
    return true;
}

module.exports = isSet;