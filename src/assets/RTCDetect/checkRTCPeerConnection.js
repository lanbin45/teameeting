//检测是否支持RTCPeerConnection
//===================================================
module.exports = function () {
  var RTCPeerConnectionSupport = false;
  RTCPeerConnectionSupport = ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection'].some(function (item) {
      return (item in window);
  });
  return RTCPeerConnectionSupport;
};


// WEBPACK FOOTER //
// ./src/assets/RTCDetect/checkRTCPeerConnection.js