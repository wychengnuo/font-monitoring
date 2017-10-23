

const editRedis = require('./../module/index');

const { keys } = require('./../config/default');

const brower = async (type) => {

    if (!type) {
        return;
    }

    const time = new Date() - 0;
    
    let obj = {};
    
    obj.time = time;

    var explorer = type;

    let browType = ['MSIE', 'Firefox', 'Chrome', 'Opera', 'Safari', 'Netscape', 'otherBrowser'];

    //ie 
    if (explorer.indexOf(browType[0]) >= 0) {
        
        obj['type'] = browType[0];

        new editRedis().sadd(keys.browserType, JSON.stringify(obj));
    }
    //firefox 
    else if (explorer.indexOf(browType[1]) >= 0) {

        obj['type'] = browType[1];


        new editRedis().sadd(keys.browserType, JSON.stringify(obj));    
    }
    //Chrome
    else if (explorer.indexOf(browType[2]) >= 0) {
        
        obj['type'] = browType[2];

        new editRedis().sadd(keys.browserType, JSON.stringify(obj));
    }
    //Opera
    else if (explorer.indexOf(browType[3]) >= 0) {
        
        obj['type'] = browType[3];

        new editRedis().sadd(keys.browserType, JSON.stringify(obj));
    }
    //Safari
    else if (explorer.indexOf(browType[4]) >= 0) {
        
        obj['type'] = browType[4];

        new editRedis().sadd(keys.browserType, JSON.stringify(obj));
    } 
    //Netscape
    else if (explorer.indexOf(browType[5]) >= 0) { 
        
        obj['type'] = browType[5];

        new editRedis().sadd(keys.browserType, JSON.stringify(obj));

    } else {

        obj['type'] = browType[6];
        
        new editRedis().sadd(keys.browserType, JSON.stringify(obj));
    }
    
};

module.exports = brower;