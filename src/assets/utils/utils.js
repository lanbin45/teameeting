import md5 from 'md5';
import { Base64 } from 'js-base64';
import QRCode from 'qrcode';


export { md5, Base64, QRCode }

export function randomUserName (len) {
  !len && (len = 6);
  var str = "abcdefghijklmnopqrstuvwxyz", name = "用户_";
  for (var i=0;i<len;i++) {
    var strArr = str.split("");
    name += strArr[parseInt(Math.random()*strArr.length)];
  }
  return name
}

export function randomUserId (len) {
  !len && (len = 6);
  var str = "123456789", id = "";
  for (var i=0;i<len;i++) {
    var strArr = str.split("");
    id += strArr[parseInt(Math.random()*strArr.length)];
  }
  return 'guest_'+id;
}


// WEBPACK FOOTER //
// ./src/assets/utils/utils.js