import dateFormat from 'dateformat'
import axios from 'axios';
// import Qs from 'qs';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 6000;
axios.defaults.retry = 2;
axios.defaults.retryDelay = 1000;

let baseUrl = null, wsUrl = null, rtcUrl = null, rtcProt = null, rtcHttpUrl  = null, rtcHttpProt = null, vdnToken = "TOgIDRgAWN1xvJXrcwQsEHnEZNRL5Zwv", vdnUrl = null;
let flag = 2;

if (flag === 0) {//debug
  // wsUrl = "http://192.168.1.111:2662";
  // baseUrl = "http://192.168.1.111:8899/teameeting/api/v1/";

  wsUrl = "http://board.anyrtc.cc:2662";
  baseUrl = "http://restful.api.teameeting.cn:8899/teameeting/api/v1";

  // rtcUrl = "192.168.199.219";
  // rtcUrl = "teameeting.anyrtc.io";
  rtcUrl = "cloud.anyrtc.io";
  rtcProt = 9091;
  //推拉流
  vdnUrl = "http://vdn.anyrtc.cc:27093/oauth/anyapi/v1/vdnUrlSign/getWebVdnUrl";

  // rtcHttpUrl = "teameeting.anyrtc.io";//获取直播列表、获取直播在线人数URL
  rtcHttpUrl = "cloud.anyrtc.io";//���取直播列表、获取直播在线人数URL
  rtcHttpProt = 9090;//获取直播列表、获取直播在线人数端口
} else if (flag === 1) {//公网测试
  wsUrl = "https://board.teameeting.cn";
  baseUrl = "https://www.teameeting.cn/teameeting/api/v1/";

  rtcUrl = "tt.teameeting.cn";
  rtcProt = null;
  rtcHttpUrl = "https://" + rtcUrl;
  rtcHttpUrl = rtcUrl;
  rtcHttpProt = null;
  //推拉流
  vdnUrl = "https://www.teameeting.cn/oauth/anyapi/v1/vdnUrlSign/getWebVdnUrl";
} else if (flag === 2) {//公网
  wsUrl = "https://board.teameeting.cn";
  baseUrl = "https://www.teameeting.cn/teameeting/api/v1/";

  // rtcUrl = "www.teameeting.cn";
  rtcUrl = "www.anyrtc.io";
  rtcProt = null;
  rtcHttpUrl = "https://" + rtcUrl;
  rtcHttpProt = null;
  //推拉流
  vdnUrl = "https://www.teameeting.cn/oauth/anyapi/v1/vdnUrlSign/getWebVdnUrl";
}

axios.defaults.baseURL = baseUrl;

//日志
//不能重新声明、删除或重写eval和arguments这两个标示符
const Logger = (...args) => {
  // let debug = false;
  let debug = true;
  if (debug) {
    let _args = args;
    _args.unshift('[Teameeting]: ');
    console.log.apply(console, _args);
  }
};

global.Logger = Logger;
//
global.__WSURL = wsUrl;

//工具
global.AX = axios;
global.dateFormat = dateFormat;

//APP INFO
//------------------------
// global.DEV_ID = "16864513";
// global.APP_ID = "RTMPC_Line";
// global.APP_KEY = "VR8+6yxQh83+66kV27gJzoGqvMedd+kIQ6ImAmn6AeU";
// global.APP_TOKEN = "fd990746efad2f63016d31b3a68f4cf6";
// global.DOMAIN = "";
//------------------------
global.DEV_ID = "95878050";
global.APP_ID = "anyrtc5FrikUFHlNal";
global.APP_KEY = "LuPdDV6dO4bxHTKazezxLMNFSI2FJ8G9entqoM8McT0";
global.APP_TOKEN = "dfca4c8bc6884f513942155469022393";
global.DOMAIN = "";
//------------------------
// global.DEV_ID = "19765119";
// global.APP_ID = "anyrtcfMjWmQqh2ekP";
// global.APP_KEY = "SYFfyl/dz1oCd8WqVama+m24z9HnsenAnl6LRizzI/Q";
// global.APP_TOKEN = "c5e57932d727de98cc14880d6e27bc88";
// global.DOMAIN = "";
// vdnToken = "rsPAkGhaSJS2pJh4mqRRz5ztrGUkKCHs";

//基本常量
global.RTC_URL = rtcUrl;
global.RTC_PROT = rtcProt;
global.RTC_HTTP_URL = rtcHttpUrl;
global.RTC_HTTP_PROT = rtcHttpProt;
global.VDN_URL = vdnUrl;
global.VDN_TOKEN = vdnToken;


global.USER_HD_URL = "http://oss.teameeting.cn/teameeting/header.png";
global.DOC_ICON_URL = "http://oss.teameeting.cn/teameeting/docs.png";

global.OPEN_SCHEME = "teameeting://";
global.IOS_DOWNLOAD = "https://itunes.apple.com/cn/app/Teameeting/id1336805351?mt=8";
global.ANDROID_DOWNLOAD = "https://www.pgyer.com/MoGY ";


// WEBPACK FOOTER //
// ./src/config.js