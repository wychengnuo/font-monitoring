(function () {
    var w = window;
    /**
     * @param 记录日期
     */

    var getTime = new Date(),
        m = getTime.getMonth() + 1;

    var t = getTime.getFullYear() + '-' + m + '-' +
        getTime.getDate() + ' ' + getTime.getHours() + ':' +
        getTime.getMinutes() + ':' + getTime.getSeconds();

    /**
     * @param 配置文件
     */

    var packJSON = {
        'jfVersion': '1.0.0',
        'openTime': t,
        'httpUrlBasic': 'http://10.143.108.100:3002/plugin/api/setBasic',
        'httpUrl': 'http://10.143.108.100:3002/plugin/api/setHtmlError'
    };

    var _maq = window._maq || [];

    /**
     *  @param 判断解析_maq 配置
     */
     
    if (_maq) {
        for (var i in _maq) {
            switch (_maq[i][0]) {
            case '_setAccount':        
                packJSON.account = _maq[i][1];
                packJSON.source = _maq[i][2];      
                break;
            default:
                break;
            }
        }
    }

    /**
     *  @param document对象数据
     */

    if (document) {
        packJSON.domain = document.domain || '';
        packJSON.localUrl = document.URL || '';
        packJSON.title = document.title || '';
        packJSON.referrer = document.referrer || '';
    }

    /**
     *  @param 判断网站语言
     */

    if (navigator) {
        packJSON.lang = navigator.language || '';
        packJSON.userAgent = navigator.userAgent || '',
        packJSON.appVersion = navigator.appVersion || '',
        packJSON.appName = navigator.appName || '',
        packJSON.platform = navigator.platform || '';
    }

    /**
     *  @param 获取网站分辨率
     */

    if (w && w.screen) {
        packJSON.sh = w.screen.height || 0;
        packJSON.sw = w.screen.width || 0;
        packJSON.cd = w.screen.colorDepth || 0;
    }

    /**
     * @param {object}  传入的值
     */

    var ls = {
        set: function (key, value) {
            //在iPhone/iPad上有时设置setItem()时会出现诡异的QUOTA_EXCEEDED_ERR错误
            //这时一般在setItem之前，先removeItem()就ok了
            if (this.get(key) !== null) {
                this.remove(key, false);
            }
            localStorage.setItem(key, value);
        },
        //查询不存在的key时，有的浏览器返回undefined，这里统一返回null
        get: function (key) {
            var v = localStorage.getItem(key);
            return v === undefined ? null : v;
        },
        remove: function (key, bool) {
            if (!bool)
                localStorage.removeItem(key);
        },
        clear: function () {
            localStorage.clear();
        }
    };

    /**
     * @param error 分类
     */

    function errTy(sMsg) {
        var et;
        if (sMsg.indexOf('SyntaxError') > 0) {
            et = 'SyntaxError';
        }
        if (sMsg.indexOf('ReferenceError') > 0) {
            et = 'ReferenceError';
        }
        if (sMsg.indexOf('RangeError') > 0) {
            et = 'RangeError';
        }
        if (sMsg.indexOf('TypeError') > 0) {
            et = 'TypeError';
        }
        if (sMsg.indexOf('URLError') > 0) {
            et = 'URLError';
        }
        if (sMsg.indexOf('EvalError') > 0) {
            et = 'EvalError';
        }
        return et;
    }

    /**
     * @param {String}  sMsg   错误信息
     * @param {String}  sUrl   出错的文件
     * @param {Long}    sLine  出错代码的行号
     * @param {Long}    sColu  出错代码的列号
     * @param {Object}  eObj   错误的详细信息，Anything
     */

    w.onerror = function geterrorTrap(sMsg, sUrl, sLine, sColu, eObj, err) {
        var eMs = {};
        eMs.sMsg = sMsg;
        eMs.sUrl = sUrl;
        eMs.sLine = sLine;
        eMs.sColu = sColu;
        eMs.eObj = eObj;
        eMs.type = errTy(sMsg);
        setMsg(eMs);
        return eMs;
    };

    /**
     * @param {Object}  eMs   错误信息统计
     * 存入本地缓存中
     */

    function setMsg(o) {
        if (typeof o == 'object') {

            if (!w.localStorage) {
                alert('浏览器不支持localStorage');
                return;
            }

            var data = {
                type: o.type,
                sMsg: o.sMsg,
                sUrl: o.sUrl,
                sLine: o.sLine,
                sColu: o.sColu,
                eObj: o.eObj ? o.eObj.stack : ''
            };
            var d = JSON.stringify(data);
            var t = 'err_' + (new Date() - 0);

            /**
             * 这里有个问题，已经存在的、相同的问题也统计了（）
             */
            ls.set(t, d);
        }
    }

    /**
     * 检测用户的网络状态
     * return @param { boolean } wife
     * 这个不兼容性不是很好
     */

    function netState() {

        var wifi = true;
        var ua = w.navigator.userAgent;
        var con = w.navigator.connection;
        // 如果是微信
        if (/MicroMessenger/.test(ua)) {
            // 如果是微信6.0以上版本，用UA来判断
            if (/NetType/.test(ua)) {
                var result = ua.match(/NetType\/(\S)+/)[0].replace('NetType/', '');
                if (result && result != 'WIFI') {
                    wifi = false;
                }
                // 如果是微信6.0以下版本，调用微信私有接口WeixinJSBridge
            } else {
                document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        if (e.err_msg != 'network_type:wifi') {
                            wifi = false;
                        }
                    });
                });
            }
            // 如果支持navigator.connection
        } else if (con) {
            var network = con.type;
            if (network != 'wifi' && network != '2' && network != 'unknown') { // unknown是为了兼容Chrome Canary
                wifi = false;
            }
        }

        w.networkWIFI = wifi;

        return w.networkWIFI;
    }

    /**
     * @param request 
     */

    var Ajax = {
        get: function (url, fn) {
            var obj = new XMLHttpRequest(); // XMLHttpRequest对象用于在后台与服务器交换数据          
            obj.open('GET', url, true);
            obj.onreadystatechange = function () {
                if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState==4说明请求已完成                    
                    fn.call(this, obj.responseText); //从服务器获得数据
                }
            };
            obj.send(null);
        },
        post: function (url, data, fn) {
            var obj = new XMLHttpRequest();
            obj.open('post', url, true);
            obj.setRequestHeader('Content-type', 'application/json'); // 发送信息至服务器时内容编码类型
            obj.onreadystatechange = function () {
                if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) { // 304未修改
                    if (fn)
                        fn.call(this, obj.responseText);
                }
            };
            obj.send(data);
        }
    };

    /**
     * @param 处理上传数据
     */

    function screening(obj) {
        
        var o;
        if (obj === 'undefied' && typeof obj !== 'object') {
            return;
        }
        for (var i in obj) {
            if (i.charAt(1) === 'r') {
                o = {};
                o[i] = obj[i];
            }
        }
        return o;
    }

    /**
     * @param 数据交互，前端发送的
     */
     
    var localData = screening(localStorage);
    
    var dataBody = {
        'account': packJSON.account,
        'jfVersion': packJSON.jfVersion,
        'openTime': packJSON.openTime,
        'source': packJSON.source,
        'userAgent': packJSON.userAgent,
        'appName': packJSON.appName,
        'platform': packJSON.platform,
        'appVersion': packJSON.appVersion,
        'domain': packJSON.domain,
        'localUrl': packJSON.localUrl,
        'title': packJSON.title,
        'referrer': packJSON.referrer,
        'lang': packJSON.lang,
        'sh': packJSON.sh,
        'sw': packJSON.sw,
        'cd': packJSON.cd
    };
    dataBody = JSON.stringify(dataBody);
    var dataErrorBody = JSON.stringify(localData);
    Ajax.post(packJSON.httpUrlBasic, dataBody);
    if (typeof dataErrorBody !== 'undefined') {
        Ajax.post(packJSON.httpUrl, dataErrorBody, function (data) {
            var date = JSON.parse(data);
            if (date.success) {
                ls.clear();
            }
        });   
    }


})();