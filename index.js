/**
 * @file index.js ~ 2016-10-20 10:34:15
 * @author DestinyXie (xber1986@gmail.com)
 * @description
 * 社交化日志工具
 */

var socialLog = require('mix-social-log'); // 直接引入js也可以

function getOpenid(custom_config) {
    // 配置项
    var appConfig = {
        openidCookieName: 'jjcj0926_openid', // 保存openid的cookie名字
        appName: 'jueji', // 公众号名字，后台需要有存他的appid和appsecret
        appId: 'wxfb62208194bb073a', // 公众号id
        baseRedirectUrl: location.href, // 回调url，即当前页面访问地址
        scope: 'snsapi_base',
        projectName: 'jjcj', // 项目名称，统计记录用
        openidCb: function (openid, newShareLink) {
            // to be override
        }
    };

    var util = {
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if(arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            }
            else {
                return null;
            }
        },

        setCookie: function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },

        getUrlQuery: function (opt_url) {
            var url = opt_url || location.href;
            var queryObj = {};

            if (url.lastIndexOf('?') < 0) {
                return queryObj;
            }
            var queryStr = url.substring(url.lastIndexOf('?') + 1);
            var queryArr = queryStr.split('&');

            var queryKV;
            for (var i = queryArr.length - 1; i >= 0; i--) {
                queryKV = queryArr[i].split('=');
                try {
                    queryObj[queryKV[0]] = decodeURIComponent(queryKV[1]);
                }
                catch (e) {
                    queryObj[queryKV[0]] = '';
                }
            }

            return queryObj;
        },
        extend: function (target, source, override) {
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    if (!override && target.hasOwnProperty(p)) {
                        continue;
                    }
                    target[p] = source[p];
                }
            }
            return target;
        }
    };

    appConfig = util.extend(appConfig, custom_config, true);

    // 判断cookie中的openid，如果没有则通过url上的code获取openid，如果openid过期则重新跳转获取code的授权链接
    var recordOpenid = util.getCookie(appConfig.openidCookieName);
    var redirectUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appConfig.appId 
        + '&redirect_uri=' + encodeURIComponent(appConfig.baseRedirectUrl) 
        + '&response_type=code&scope=' + appConfig.scope + '&state=STATE#wechat_redirect';

    var newShareLink; // 添加了新参数的分享链接
    if (recordOpenid) {
        newShareLink = socialLog(appConfig.projectName, recordOpenid, location.href);
        appConfig.openidCb(recordOpenid, newShareLink);
    }
    else {
        var params = util.getUrlQuery();
        var code;
        if (params) {
            code = params['code'];
        }

        if (code) {
            $.ajax({
                url: 'http://jishub.com/api/wxOpenId',
                data: {
                    code: code,
                    app_name: appConfig.appName
                },
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data && data.openid) {
                        util.setCookie(appConfig.openidCookieName, data.openid);
                        newShareLink = socialLog(appConfig.projectName, data.openid, location.href);
                        appConfig.openidCb(recordOpenid, newShareLink);
                    }
                    else {
                        appConfig.openidCb();
                    }
                },
                error: function (data) {
                    appConfig.openidCb();
                }
            });
        }
        else {
            location.href = redirectUrl;
        }
    }
}

module.exports = getOpenid;


