// 获取浏览器信息 UA sniffing
//==============================================

module.exports = function () {
  var UA = navigator.userAgent;
  var browserName = navigator.appName;
  var fullVersion = '' + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix, isMobile, isPC;

  // In Opera 15+, the true version is after "OPR/"
  if ((verOffset=UA.indexOf("OPR/"))!=-1) {
      browserName = "Opera";
      fullVersion = UA.substring(verOffset+4);
  }
  // In older Opera, the true version is after "Opera" or after "Version"
  else if ((verOffset = UA.indexOf('Opera')) !== -1) {
      browserName = 'Opera';
      fullVersion = UA.substring(verOffset + 6);

      if ((verOffset = UA.indexOf('Version')) !== -1) {
          fullVersion = UA.substring(verOffset + 8);
      }
  }
  // In MSIE, the true version is after 'MSIE' in userAgent
  else if ((verOffset = UA.indexOf('MSIE')) !== -1) {
      browserName = 'IE';
      fullVersion = UA.substring(verOffset + 5);
  }
  // In Chrome, the true version is after 'Chrome'
  else if ((verOffset = UA.indexOf('Chrome')) !== -1) {
      browserName = 'Chrome';
      fullVersion = UA.substring(verOffset + 7);
  }
  // In Safari, the true version is after 'Safari' or after 'Version'
  else if ((verOffset = UA.indexOf('Safari')) !== -1) {
      browserName = 'Safari';
      fullVersion = UA.substring(verOffset + 7);

      if ((verOffset = UA.indexOf('Version')) !== -1) {
          fullVersion = UA.substring(verOffset + 8);
      }
  }
  // In Firefox, the true version is after 'Firefox'
  else if ((verOffset = UA.indexOf('Firefox')) !== -1) {
      browserName = 'Firefox';
      fullVersion = UA.substring(verOffset + 8);
  }
  // In most other browsers, 'name/version' is at the end of userAgent
  else if ((nameOffset = UA.lastIndexOf(' ') + 1) < (verOffset = UA.lastIndexOf('/'))) {
      browserName = UA.substring(nameOffset, verOffset);
      fullVersion = UA.substring(verOffset + 1);

      if (browserName.toLowerCase() === browserName.toUpperCase()) {
          browserName = navigator.appName;
      }
  }

  // MS Edge
  var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
  // 国产浏览器
  var isQQ = /QQBrowser/.test(navigator.userAgent);
  var isSougou = /MetaSr/.test(navigator.userAgent);
  var isBaidu = /BIDUBrowser/.test(navigator.userAgent);
  var isLiebao = _testExternal(/^liebao/i, 0);
  // 360浏览器
  var isEE360 = false;
  var isSE360 = _mime("type", "application/vnd.chromium.remoting-viewer");//安全浏览器

  function _mime(option, value) {
      if (UA.indexOf('Chrome') === -1) {
          return false;
      }
      var mimeTypes = navigator.mimeTypes;
      for (var mt in mimeTypes) {
          if (mimeTypes[mt][option] == value) {
              return true;
          }
      }
      return false;
  }

  function _testExternal(reg, type) {
      var external = window.external || {};
      for (var i in external) {
          if (reg.test(type ? external[i] : i)) {
              return true;
          }
      }
      return false;
  }

  if (isEdge) {
      browserName = 'Edge';
      // fullVersion = navigator.userAgent.split('Edge/')[1];
      fullVersion = parseInt(navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)[2], 10).toString();
  }

  if(isQQ){
      browserName = 'QQ';
      fullVersion = parseInt(navigator.userAgent.match(/QQBrowser\/(\d+).(\d+)/)[2], 10).toString();
  }

  if(isSougou){
      browserName = 'Sougou';
      fullVersion = parseInt(navigator.userAgent.match(/MetaSr (\d+).(\d+)/)[2], 10).toString();
  }

  if(isBaidu){
      browserName = 'Baidu';
      fullVersion = parseInt(navigator.userAgent.match(/BIDUBrowser\/(\d+).(\d+)/)[1], 10).toString();
  }

  if(isLiebao){
      browserName = 'Liebao';
      fullVersion = "";
  }

  if (isSE360) {
      browserName = '360';
      fullVersion = UA.substring(verOffset + 7);
  }

  // trim the fullVersion string at semicolon/space if present
  if ((ix = fullVersion.indexOf(';')) !== -1) {
      fullVersion = fullVersion.substring(0, ix);
  }

  if ((ix = fullVersion.indexOf(' ')) !== -1) {
      fullVersion = fullVersion.substring(0, ix);
  }

  majorVersion = parseInt('' + fullVersion, 10);

  if (isNaN(majorVersion)) {
      fullVersion = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
  }

  const ua = UA.toLowerCase();

  if (ua.indexOf('window nt') > -1 || (ua.indexOf('macintosh') > -1 && ua.indexOf('intel mac os x') > -1)) {
      //
      isPC = true;
  } else {
      isPC = false;
  }
  if ((ua.indexOf('mobile') > -1 && ua.indexOf('linux') > -1 && ua.indexOf('android') > -1) || (ua.indexOf('iphone') > -1 && ua.indexOf('mobile') > -1)) {
      //
      isMobile = true;
  } else {
      isMobile = false;
  }

  return {
      fullVersion: fullVersion,
      version: majorVersion,
      name: browserName,
      isMobile: '',
      isPC: ''
  };
};


// WEBPACK FOOTER //
// ./src/assets/RTCDetect/getBrowserInfo.js