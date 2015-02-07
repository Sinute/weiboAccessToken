var system = require('system');
if (system.args.length < 4) {
    console.log('Usage: weiboAccessToken.js <APP_URL> <ACCOUNT> <PASSWORD>');
    phantom.exit(1);
}

var page = require('webpage').create(),
    url = system.args[1],
    pageVar = {},
    tokenInfo = {};

if (!url.match(/^https?:\/\//)) {
    console.log('Not a valid url');
    phantom.exit(1);
};

pageVar["userId"] = system.args[2];
pageVar["password"] = system.args[3];

page.onError = function(msg, trace) {
    // ignore
};

page.onCallback = function(info) {
    return pageVar[info];
};

setTimeout(function() {
    page.open(url);
}, 0);

setTimeout(function() {
    page.evaluate(function() {
        document.getElementById("userId").value = window.callPhantom("userId");
        document.getElementById("passwd").value = window.callPhantom("password");
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        document.querySelector(".WB_btn_login").dispatchEvent(ev);
    });
}, 1000);

setTimeout(function() {
    page.cookies.forEach(function(cookie) {
        if (cookie.name.match(/weibojs_\d+/)) {
            cookie.value.split("%26").forEach(function(value){
                var v = value.split("%3D");
                tokenInfo[v[0]] = v[1];
            });
        };
    });
    console.log(JSON.stringify(tokenInfo));
    phantom.exit();
}, 3000);
