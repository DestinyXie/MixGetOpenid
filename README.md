前端获取微信用户openid

## Installation

    npm i mix-get-openid

## Usage

```js
var getOpenid = require('mix-get-openid');
getOpenid({
    openidCookieName: 'xxx', // 保存openid的cookie名字
    appName: 'xxx', // 公众号名字，后台需要有存他的appid和appsecret
    appId: 'xxx', // 公众号id
    baseRedirectUrl: 'xxx', // 回调url，即当前页面访问地址
    scope: 'snsapi_base', // snsapi_base 或者 snsapi_userinfo， 默认snsapi_base
    projectName: 'xxx', // 项目名称，统计记录用
    openidCb: function (openid, newShareLink) {
        // to be override
    }
});

```

## License
<a href="http://nate.mit-license.org">MIT</a>