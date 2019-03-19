var getOSName = require("./getOSName");
var getBrowserInfo = require('./getBrowserInfo');
var checkGetUserMedia = require("./checkGetUserMedia");
var checkRTCPeerConnection = require("./checkRTCPeerConnection");
var checkDataChannel = require("./checkDataChannel");
var checkDeviceSupport = require("./checkDeviceSupport");

var anyRTCDetect = {};

var isHTTPs = location.protocol === 'https:';

// anyRTCDetect.browser.name || anyRTCDetect.browser.version || anyRTCDetect.browser.fullVersion
anyRTCDetect.browser = getBrowserInfo();

// anyRTCDetect.isChrome || anyRTCDetect.isFirefox || anyRTCDetect.isOpera etc
anyRTCDetect.browser['is' + anyRTCDetect.browser.name] = true;

// 获取操作系统名称
anyRTCDetect.osName = getOSName();

// WebRTC相关检测
//===================================

//检测是否支持getUserMedia
anyRTCDetect.getUserMediaSupport = checkGetUserMedia();

//检���是否支持RTCPeerConnection
anyRTCDetect.RTCPeerConnectionSupport = checkRTCPeerConnection();

//检测是否支持DataChannel
anyRTCDetect.dataChannelSupport = checkDataChannel();

//检测是否支持Promise
// anyRTCDetect.WebSocketSupport = 'WebSocket' in window && 2 === window.WebSocket.CLOSING;

//检测是否支持WebSocket
// anyRTCDetect.WebSocketSupport = 'WebSocket' in window && 2 === window.WebSocket.CLOSING;

//检测是否支持屏幕分享功能
//目前只有https下的35版本以上的chrome可以分享屏幕
anyRTCDetect.screenCaputringSupport = false;
if (anyRTCDetect.browser.isChrome && anyRTCDetect.browser.version >= 42) {
    //获取屏幕共享状态
    getChromeExtensionStatus('daiabbkkhgegdmhfpocaakcgbajnkgbp', function(status) {
      if(status == 'installed-enabled') {
        anyRTCDetect.screenCaputringSupport = true;
      } else {
        anyRTCDetect.screenCaputringSupport = false;
      }
    });
}
// if (!isHTTPs) {
//     anyRTCDetect.screenCaputringSupport = false;
// }

// anyRTC相关
//==================================
//检查设备支持情况
anyRTCDetect.checkDeviceSupport = checkDeviceSupport;

//检测浏览器版本是否支持anyRTC
anyRTCDetect.anyRTCBrowserSupport = false;
//42版以上的chrome
if(anyRTCDetect.browser.isChrome && anyRTCDetect.browser.version >= 42){
    anyRTCDetect.anyRTCBrowserSupport = true;
}
//38版以上的firefox
else if ( anyRTCDetect.browser.isFirefox && anyRTCDetect.browser.version >= 38) {
    anyRTCDetect.anyRTCBrowserSupport = true;
}
//30版以上的Opera
else if (anyRTCDetect.browser.isOpera && anyRTCDetect.browser.version >= 30){
    anyRTCDetect.anyRTCBrowserSupport = true;
}
else if (anyRTCDetect.browser.name == 'Safari' && anyRTCDetect.browser.version >= 11){
    anyRTCDetect.anyRTCBrowserSupport = true;
}
// //7以上的百度
// else if(anyRTCDetect.browser.isBaidu && anyRTCDetect.browser.version >= 7){
//     anyRTCDetect.anyRTCSupport = true;
// }

//检测是否支持anyRTC
anyRTCDetect.anyRTCSupport = false;
if (anyRTCDetect.anyRTCBrowserSupport) {
    if (anyRTCDetect.getUserMediaSupport && anyRTCDetect.RTCPeerConnectionSupport && anyRTCDetect.dataChannelSupport) {
        anyRTCDetect.anyRTCSupport = true;
    }
}

module.exports = anyRTCDetect;


// WEBPACK FOOTER //
// ./src/assets/RTCDetect/anyRTCDetect.js