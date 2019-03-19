//检测是否支持getUserMedia
//==============================================
module.exports = function () {

  var getUserMediaSupport = false;

  //Chrome与Firefox
  if (typeof navigator.webkitGetUserMedia !== 'undefined' || typeof navigator.mozGetUserMedia !== 'undefined') {
      getUserMediaSupport = true;
  }
  //Firefox已支持
  else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      getUserMediaSupport = true;
  }

  return getUserMediaSupport;

};


// WEBPACK FOOTER //
// ./src/assets/RTCDetect/checkGetUserMedia.js