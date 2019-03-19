import * as utils from '@/assets/utils/utils';
import anyRTCDetect from '@/assets/RTCDetect/anyRTCDetect';
import RTMixer from '@/assets/rtmixer/rtmixer';

export default {
  data () {
    return {
      mHoster: null,

      jLiveInfo: {},                //互动直播自定义消息
      inviteList: [],               //邀请参会人员列表
      applyList: [],                //连麦会议的请求列表
    }
  },

  methods: {
    //检测RTMixer
    checkRTMixer() {
      let that = this;
      return new Promise(resolve => {
        if (anyRTCDetect.osName == "Windows") {
          that.detectRTMixer = 1;
          RTMixer.pcClientOn(that.mId, {
            'DevId': DEV_ID,
            'AppId': APP_ID,
            'Key': APP_KEY,
            'Token': APP_TOKEN
          }, (nCode, nVersion) => {
            switch (nCode) {
              case 0://打开成功
                (async () => {
                  let version = await that.checkRTMixerVersion();
                  if (nVersion < version) {
                    that.detectRTMixer = 5;
                    resolve(false);
                    return
                  }
                  //显示页面
                  that.detectRTMixer = 0;
                  clearInterval(that.tipTimer);
                  resolve(true);
                })();
                break;
              case -1: //服务异常
                that.$message.error('培训助手连接服务异常请关闭助手后重试');
                that.detectRTMixer = 3;
                clearInterval(that.tipTimer);
                resolve(false);
                break;
              case -2: //未安装
                that.checkRTMixerVersion();
                that.detectRTMixer = 2;
                clearInterval(that.tipTimer);
                that.tipTimer = setInterval(() => {
                  if (that.aState == 2) {
                    that.aState = -1;
                  }
                  that.aState++;
                }, 2500);
                resolve(false);
                break;
            }
          });
        } else {
          that.detectRTMixer = 4;
          resolve(false);
          return false
        }
      });
    },
    //检测RTMixer版本
    checkRTMixerVersion() {
      let that = this;

      return new Promise((resolve, reject) => {
        AX.post('help/get_recent_app_info', {
          app_type: '3'
        }).then(res => {
          let data = res.data;
          that.RTMixerDownUrl = data.appinfo.t_app_url;
          resolve(data.appinfo.t_app_update_version)
        }).catch(err => {
          that.$message.error('获取培训助手版本错误！');
          that.$router.push('/console');
        });
      })
    },
    RTMixerListener () {
      let that = this;
      return new Promise(resolve => {
        RTMixer.pcListener(code => {
          resolve(code);
        });
      });
    },
    //
    initHoster () {
      let that = this;
      
      that.mHoster = new (RTMPCHosterKit || window.RTMPCHosterKit)();
      //初始化
      that.mHoster.initEngineWithAnyRTCInfo(DEV_ID, APP_ID, APP_KEY, APP_TOKEN, DOMAIN);
      that.mHoster.configServerForPriCloud(RTC_URL, RTC_PROT);
      //设置视频分辨率
      var meetLineQuality = "";
      switch (that.mLineQuality) {
        case 0:
          meetLineQuality = "RTMPC_Video_Low";
          break;
        case 1:
          meetLineQuality = "RTMPC_Video_SD";
          break;
        case 2:
          meetLineQuality = "RTMPC_Video_QHD";
          break;
        case 3:
          meetLineQuality = "RTMPC_Video_HD";
          break;
        case 4:
          meetLineQuality = "RTMPC_Video_1080P";
          break;
        default:
          meetLineQuality = "RTMPC_Video_SD";
          break;
      }
      that.mHoster.setVideoMode(meetLineQuality);
      //采集摄像头
      that.mHoster.setLocalVideoCapturer();
      //采集摄像头成功
      that.mHoster.on('onSetLocalVideoCapturerResult', (nCode, dRender, stream) => {
        if (nCode === 0) {
          var randomString = (customNum) => {
            customNum = customNum || parseInt(Math.random() * 6 + 4);
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var randomStr = '';
            for (let i = 0; i < customNum; i++) {
              randomStr += $chars.split('')[parseInt(Math.random() * $chars.length)];
            }
            return randomStr;
          }

          var randomStr = randomString(),
            timestamp = Date.parse(new Date());

          // AX.post(VDN_URL, {
          //   'appid': APP_ID, //应用 id，官网创建 app 获取
          //   'stream': that.mId,    //视频流名称
          //   'random': randomStr,  //随机字符串，4～10 个字符
          //   'signature': utils.md5(APP_ID + timestamp + VDN_TOKEN + randomStr),   //签名 
          //   'timestamp': timestamp,   //毫秒时间戳
          // }).then(res => {
          //   Logger(res);
          //   let data = res.data;
          //   switch (data.code) {
          //     case 200:
                // let pushUrl = data.push_url,
                //   pullUrl = data.pull_url,
                //   hlsUrl = data.hls_url;

                let pushUrl = that.pushUrl,
                  pullUrl = that.pullUrl,
                  hlsUrl = that.hlsUrl;

                //创建RTC链接
                {
                  that.jUserData["devType"] = 3;
                  that.jUserData["isHost"] = 1;
                  that.jUserData["userId"] = that.userInfo.userid;
                  that.jUserData["nickName"] = that.userNickName ? that.userNickName : that.userInfo.userNickName;
                  that.jUserData["headUrl"] = that.userInfo.userIcon || USER_HD_URL;
                }
                {
                  that.jLiveInfo['rtmpUrl'] = pullUrl;        // RTMP拉流地址
                  that.jLiveInfo['hlsUrl'] = hlsUrl;          // HLS拉流地址
                  that.jLiveInfo['anyrtcId'] = that.mId;
                  that.jLiveInfo['hosterName'] = that.userNickName ? that.userNickName : that.userInfo.userNickName;
                  that.jLiveInfo['liveTopic'] = that.mTitle;
                  that.jLiveInfo['isLiveLandscape'] = 1;  // 0 竖屏     1 横屏
                  that.jLiveInfo['isAudioLive'] = 0;      // 0 音视频   1 音频
                };
                that.mHoster.createRTCLine(that.mId, pushUrl, that.jUserData["userId"], JSON.stringify(that.jUserData), JSON.stringify(that.jLiveInfo));
                //会议是否开始标识、用于显示隐藏工具栏视频和音频开关
                that.mIsStart = true;
                let openVideo = that.ssuc ? (that.userInfo.videoEnabled == 0 ? true : false) : true;
                let openAudio = that.ssuc ? (that.userInfo.audioEnabled == 0 ? true : false) : true;
                // 添加视频显示窗口
                that.createVideo({
                  isSelf: true,
                  userType: 3,//['android', 'ios', 'win', 'chrome', 'tv', 'h5'] 
                  userId: that.jUserData["userId"],
                  userName: that.jUserData["nickName"],
                  userIcon: that.jUserData["headUrl"],
                  peerId: '',
                  pubId: 'myself',
                  camera: openVideo,
                  microphone: openAudio,
                  width: '100%',
                  height: '100%',
                  src: window.URL.createObjectURL(stream)
                });
                //后续通过events Bus 通知
                that.micEnabled = openAudio;
                that.cameraEnabled = openVideo;
            //     break;
            //   default:
            //     that.$message.error('获取到推流地址失败');
            //     console.log('获取到推流地址失败', data);
            //     setTimeout(() => {
            //       //离开页面不需要在验证
            //       that.leaveVerify = false;
            //       that.back();
            //     }, 2500);
            //     break;
            // }
          // }).catch(err => {
          //   Logger(err);
          //   console.log('获取推流地址异常', err);
          //   that.$alert('获取推流地址异常，请稍后再试!', '系统提示', {
          //     confirmButtonText: '确定',
          //     callback: () => {
          //       //离开页面不需要在验证
          //       that.leaveVerify = false;
          //       that.back();
          //     }
          //   });
          // });
        } else if (nCode == 7) {
          if (dRender === "DevicesNotFoundError" || dRender === "NotFoundError") {
            that.$message.error("打开摄像头错误：：请检查你的摄像头和音频权限");
          } else if (dRender === "NotReadableError" || dRender === "TrackStartError") {
            that.$message.error("打开摄像头错误：：本地摄像头被占用");
          } else if (dRender === "OverconstrainedError" || dRender === "ConstraintNotSatisfiedErrror") {
            that.$message.error("打开摄像头错误：：本地摄像头不满足当前会议设置的分辨率");
          } else if (dRender === "NotAllowedError" || dRender === "PermissionDeniedError") {
            that.$message.error("打开摄像头错误：：未允许浏览器打开您的摄像头");
          }
        }
      });
      //连接RTC结果
      that.mHoster.on('onRTCCreateLineResult', nCode => {
        Logger('创建RTC服务连接结果', nCode);
        if (nCode === 0) {//成功
          Logger('onRTCCreateLineResult OK');
          //注册监听事件，防止误操作导致浏览器关闭刷新
          that.registerUnload();
        } else {
          that.$message.error('创建RTC链接失败');
          throw new Error('onRTCCreateLineResult faild', nCode);
        }
      });
      //游客连麦加入
      that.mHoster.on("onRTCOpenVideoRender", (strPeerId, strPubId, dVideoRender, strUserData) => {
        Logger('onRTCOpenVideoRender', strPeerId, strPubId, dVideoRender, strUserData);
        
        if (strPubId.indexOf("X100") == -1) { //不是屏幕共享

          //设置视频窗口
          that.createVideo({
            userType: JSON.parse(strUserData).devType,//['android', 'ios', 'win', 'chrome', 'tv', 'h5'] 
            userId: JSON.parse(strUserData).userId,
            userName: JSON.parse(strUserData).nickName,
            userIcon: JSON.parse(strUserData).headUrl ? JSON.parse(strUserData).headUrl : USER_HD_URL,
            netBytes: 0,
            audioLevel: 0,
            videoBytes: 0,
            pkgLost: 0,
            peerId: strPeerId,
            pubId: strPubId,
            width: '100%',
            height: '100%',
            src: ""
          });

          //遍历邀请列表如果是刚连麦的用户则设置邀请状态为2
          that.inviteList.map((item, index) => {
            if (item.userId == JSON.parse(strUserData).userId) {
              that.inviteList.splice(index, 1);
            }
          });
          that.memberList.map((mitem, mindex) => {
            if (mitem.userId == JSON.parse(strUserData).userId) {
              that.memberList.splice(mindex, 1);
            }
          });
        } else {
          var video = document.createElement('video');
          video.id = strPubId;
          video.autoplay = "autoplay";
          video.style.width = "100%";
          video.style.height = "auto";
          //重新设置视频窗口大小
          that.$nextTick(() => {
            document.getElementById("shareScreenView").appendChild(video);
            that.shareResult = true;//shareResult是共享的样式标识
            that.resizeVideos();
          });
        }
      });
      //游客连麦退出
      that.mHoster.on("onRTCCloseVideoRender", (strPeerId, strPubId) => {
        Logger('onRTCCloseVideoRender', strPeerId, strPubId);
        
        //删除视频窗口&&删除参会人员列表
        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList.splice(index, 1)
          }
        });
        that.getMemberList();
        //重新设置视频窗口大小
        that.$nextTick(() => {
          that.resizeVideos();
        });
      });
      //收到游客连麦的视频流
      that.mHoster.on('onRTCRemoteStream', (stream, strPeerId, strPubId) => {
        Logger('onRTCRemoteStream', stream, strPeerId, strPubId);

        if (strPubId.indexOf("X100") == -1) { //不是屏幕共享
          that.mConnectList.map((item, index) => {
            if (item.pubId == strPubId) {
              that.mConnectList[index].src = window.URL.createObjectURL(stream)
            }
          });
        } else {
          //设置远程视频窗口视频流
          that.mHoster.setRTCVideoRender(stream, document.getElementById(strPubId));
        }
      });
      // 监听视频窗口码率
      that.mHoster.on("onRTCPeerVideoBytes", (strPubId, videoBytes) => {
        // Logger("onRTCPeerVideoBytes", strPubId, videoBytes);

        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].videoBytes = videoBytes;
          }
        });
      });
      // 监听视频窗口音量
      that.mHoster.on("onRTCPeerAudioDetect", (strPubId, nAudioLevel) => {
        // Logger(strPubId, nAudioLevel);
        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].audioLevel = nAudioLevel < 2 ? 0 : nAudioLevel;
          }
        });
      });
      // 监听视频窗口网络状态
      that.mHoster.on("onRTCNetworkStatus", (strPubId, nNetBytes, nPktLost) => {
        // Logger(strPubId, nNetBytes, nPktLost);

        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].netBytes = nNetBytes;
            that.mConnectList[index].pkgLost = nPktLost;
          }
        });
      });
      //游客申请连麦
      that.mHoster.on("onRTCApplyToLine", (strLivePeerId, strUserId, strUserData) => {
        Logger('onRTCApplyToLine', strLivePeerId, strUserId, strUserData);

        //添加到连麦申请列表
        let jUserData = JSON.parse(strUserData);

        if (that.inviteList.some((item, index) => {//如果连麦者在主播预约列表中直接同意连卖申请
          return item.userId == strUserId
        })) {
          that.inviteList.map((item, index) => {
            if (item.userId == strUserId) {
              that.mHoster.acceptRTCLine(strLivePeerId);
              that.inviteList[index].peerId = strLivePeerId;
              that.inviteList[index].invited = 2;
              if (that.inviteList[index].timer) {
                that.inviteList[index].timer.destroyInterval();
              }
            }
          });
          that.memberList.map((mitem, mindex) => {
            if (mitem.userId == strUserId) {
              that.memberList[mindex].invited = 2;
            }
          });
        } else {
          that.$notify({
            title: '提示',
            message: jUserData.nickName + " 申请连麦!",
            duration: 2000
          });
          // let newInviteItem = {
          //   peerId: strLivePeerId,
          //   userId: strUserId,
          //   invited: 1
          // };
          // that.inviteList.push(newInviteItem);
          let thisReady = true;
          if (that.siderShow && that.currentSiderName == "linelist") {
            that.hasNewApply = false;
            thisReady = true;
          } else {
            that.hasNewApply = true;
            thisReady = false;
          }
          that.memberList.map((mitem, mindex) => {
            if (mitem.userId == strUserId) {
              that.memberList[mindex].invited = 1;
            }
          });
          that.applyList.push({
            peerId: strLivePeerId,
            userId: jUserData.userId,
            userIcon: jUserData.headUrl ? jUserData.headUrl : USER_HD_URL,
            userName: jUserData.nickName,
            isReady: thisReady
          });
        }
      });
      //游客取消（或挂断）连麦
      that.mHoster.on("onRTCCancelLine", (strLivePeerId, strUserId, strUserData) => {
        Logger('onRTCCancelLine', strLivePeerId, strUserId, strUserData);
        
        //申请连麦列表（游客）
        that.applyList.map((item, index) => {
          if (item.peerId === strLivePeerId) {
            let uName = item.userName;
            that.$notify({
              title: '提示',
              message: uName + " 取消连麦!",
              duration: 2000
            });
            //删除连麦列表
            that.applyList.splice(index, 1);
            //
            if (that.applyList.some(item => {
              return item.isReady == false
            })) {
              that.hasNewApply = true;
            } else {
              that.hasNewApply = false;
            }
          }
        });

        //删除参会人员列表
        that.memberList.map((mitem, mindex) => {
          if (mitem.userId == strUserId) {
            that.memberList[mindex].invited = 0;
          }
        });

        //邀请列表（主播反向邀请）
        // that.inviteList.map((item, index) => {
        //   if (item.peerId == strLivePeerId) {
        //     if (that.inviteList[index].timer) {
        //       that.inviteList[index].timer.destroyInterval();
        //     }
        //     //删除邀请列表
        //     that.inviteList.splice(index, 1);
        //   }
        // });
      });
      //收到消息回调
      that.mHoster.on("onRTCUserMessage", (nType, strUserId, strUserName, strUserHeaderUrl, strMessage) => {
        Logger('onRTCUserMessage', nType, strUserId, strUserName, strUserHeaderUrl, strMessage);

        if (nType === 0) {//普通消息
          var userData = JSON.parse(strMessage);

          switch (userData.mType) {
            case 0://普通消息
              //新消息提示
              if (that.siderShow && that.currentSiderName == "message") {
                that.hasNewMsg = false;
              } else {
                that.hasNewMsg = true;
              }

              let msgData;
              if (typeof strMessage === "string") {
                msgData = JSON.parse(strMessage);
              } else if (typeof strMessage === "object") {
                msgData = strMessage;
              }

              that.addMsgList(strUserName, strUserHeaderUrl, strUserId, utils.Base64.decode(msgData.mContent), msgData.mTime * 1000);
              break;
            case 6://拒绝邀请入会
              that.$message.error(strUserName + "拒绝邀请入会");
              //删除邀请队列
              that.inviteList.map((item, index) => {
                if (item.userId == strUserId) {
                  that.inviteList.splice(index, 1);
                }
              });
              that.memberList.map((iitem, index) => {
                if (iitem.userId == strUserId) {
                  that.memberList[index].invited = 0;
                }
              })
              break;
            case 999://网络管理员监控结束会议
              that.mHoster.clear();
              that.$alert('您的会议涉嫌违规，会议已被强制关闭', '系统提示', {
                confirmButtonText: '确定',
                callback: () => {
                  window.onbeforeunload = null;
                  window.onunload = null;
                  //离开页面不需要在验证
                  that.leaveVerify = false;
                  that.back();
                }
              });
              break;
          }
        }
      });
      /**
       *  收到其他人员开启共享
       *  @params nType                分享的类型  1文档共享 2屏幕共享 3媒体共享
       *  @params strWBInfo            文档共享传文档id || 屏幕共享视频流的chanId
       *  @params strUserId            自定义用户id
       *  @params strUserData          自定义用户信息
       **/
      that.mHoster.on("onRTCUserShareOpen", (nType, strWBInfo, strUserId, strUserData) => {
        Logger("onRTCUserShareOpen");

        that.shareType = nType;
        that.sharerName = JSON.parse(strUserData).nickName;
        if (nType == 2) {//屏幕共享
          
        }
      });
      /**
       *  收到其他人员开启共享
       *  @params nType                分享的类型  1文档共享 2屏幕共享 3媒体共享
       *  @params strWBInfo            文档共享传文档id || 屏幕共享视频流的chanId
       *  @params strUserId            自定义用户id
       *  @params strUserData          自定义用户信息
       **/
      that.mHoster.on("onRTCUserShareClose", () => {
        Logger("onRTCUserShareClose");
        
        if (that.shareType == 2) {
          //移除屏幕流
          if (document.querySelector("#shareScreenView > video")) {
            document.querySelector("#shareScreenView > video").remove();
          }
        }
        that.shareType = 0;
        that.sharerName = "";
        if (that.mSharer) that.mSharer = false;
        that.shareResult = false;
        that.$nextTick(() => {
          that.resizeVideos();
        });
      });
      /**
       *  打开屏幕共享结果
       *  @params OK                  共享是否成功
       **/
      that.mHoster.on("onRTCSetUserShareEnableResult", (OK) => {
        Logger("onRTCSetUserShareEnableResult");
        if (OK) {
          that.mSharer = true;
          that.sharerName = that.jUserData['nickName'];

          if (that.shareType == 2) {//屏幕共享
            if (anyRTCDetect.browser.name == 'Firefox') {
              navigator.mediaDevices.getUserMedia({
                video: { mediaSource: 'screen' },
                // video: {mediaSource:'window'}
              }).then(stream => {
                that.shareResult = true;
                
                that.$nextTick(() => {
                  // 屏幕共享的视频流添加到页面中
                  var video = document.createElement('video');
                  video.src = URL.createObjectURL(stream);
                  video.autoplay = "autoplay";
                  video.style.width = "100%";
                  video.style.height = "auto";
                  document.getElementById("shareScreenView").appendChild(video);
                  //通知其他与会人员共享结果  // 文档共享
                  // that.mHoster.setUserShareInfo(null);
                  //共享屏幕的视频流
                  that.mHoster.startScreenCap(stream);

                  that.resizeVideos();
                });
              }).catch(error => {
                Logger(error);
                if ((anyRTCDetect.browser.name == '360' && error.name === "NotReadableError") || (anyRTCDetect.browser.name == 'QQ' && error.name === "NotReadableError")) {
                  that.showScreenTip = true;
                }
                that.mHoster.setUserShareEnable(0, false);
                that.$message.error('打开屏幕共享插件失败！');
                that.shareResult = false;
                that.shareType = 0;
                throw error;
              });
            } else {
              // chrome extension is installed & enabled.
              getScreenConstraints((error, screen_constraints) => {
                if (error) {
                  that.mHoster.setUserShareEnable(0, false);
                  return that.$message.warning("请安装'anyRTC-ScreenShare_publish'Chrome插件");
                }

                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                navigator.getUserMedia({
                  video: screen_constraints
                }, (stream) => {
                  that.shareResult = true;
                  
                  that.$nextTick(() => {
                    // 屏幕共享的视频流添加到页面中
                    var video = document.createElement('video');
                    video.src = URL.createObjectURL(stream);
                    video.autoplay = "autoplay";
                    video.style.width = "100%";
                    video.style.height = "auto";
                    document.getElementById("shareScreenView").appendChild(video);
                    //通知其他与会人员共享结果  // 文档共享
                    // that.mHoster.setUserShareInfo(null);
                    //共享屏幕的视频流
                    that.mHoster.startScreenCap(stream);

                    that.resizeVideos();
                  });
                }, (error) => {
                  Logger(error);
                  if ((anyRTCDetect.browser.name == '360' && error.name === "NotReadableError") || (anyRTCDetect.browser.name == 'QQ' && error.name === "NotReadableError")) {
                    that.showScreenTip = true;
                  }
                  that.mHoster.setUserShareEnable(0, false);
                  that.$message.error('打开屏幕共享插件失败！');
                  that.shareResult = false;
                  that.shareType = 0;
                  throw error;
                });
              });
            }
          }
        } else {
          if (that.shareType == 1) {
            that.fileId = "";
            that.fileMId = "";
          }
          that.shareType = 0;
          that.mHoster.setUserShareEnable(0, false);
          that.$message.warning("共享通道已被占用或释放!");
        }
      });
      //直播间实时在线人数变化通知
      that.mHoster.on("onRTCMemberListNotify", (nTotalMember, RoomID, RoomSvrID) => {
        Logger('onRTCMemberListNotify', nTotalMember);

        that.RoomSvrID = RoomSvrID;
        that.RoomID = RoomID;
        that.getMemberList();
      });
      //连麦列表人员
      that.mHoster.on("onRTCChatList", (UserId, NickName, UserData) => {
      });
      that.mHoster.on("onSDKError", (mName, mMsg) => {
        Logger('error from ' + mName, mMsg);
      });
    },
    //连麦主播邀请游客
    inviteUser(item, index) {
      let that = this;

      let strUserid = item.userId;

      if (item.invited != 0)
        return;

      // if (that.applyList.some(item => {//反向邀请时如果用户在连麦申请列表中
      //   return item.userId == strUserid
      // })) {
      //   that.applyList.map((item, iindex) => {//如果在连麦申请列表中
      //     if (item.userId == strUserid) {
      //       that.acceptLine(iindex);
      //       //邀请列表userid对应邀请状态 0/1/2 未邀请/邀请中/邀请成功
      //       let newInviteItem = {
      //         peerId: item.strLivePeerId,
      //         userId: strUserid,
      //         invited: 1
      //       };
      //       that.inviteList.push(newInviteItem);
      //       //
      //       that.memberList.map((mitem, mindex) => {
      //         if (mitem.userId == strUserid) {
      //           that.memberList[mindex].invited = 1;
      //         }
      //       });
      //     }
      //   });
      // } else {
        that.$confirm('邀请该用户参加会议？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //邀请列表userid对应邀请状态 0/1/2 未邀请/邀请中/邀请成功
          let newInviteItem = {
            peerId: "",
            userId: strUserid,
            invited: 1,
            timer: {
              seconds: 34,
              timer: null,
              createInterval: function () {
                this.timer = setInterval(() => {
                  if (this.seconds == 1) {
                    this.destroyInterval();
                    //更新反向邀请列表邀请状态
                    that.inviteList.map((item, index) => {
                      if (item.userId == strUserid) {
                        that.inviteList.splice(index, 1);
                      }
                    });
                    //更新参会人员列表邀请状态
                    that.memberList.map((item, index) => {
                      if (item.userId == strUserid) {
                        that.memberList[index].invited = 0;
                      }
                    });
                    return
                  }
                  this.seconds--;
                }, 1000);
              },
              destroyInterval: function () {
                this.seconds = 29;
                clearInterval(this.timer);
                this.timer = null;
              }
            }
          };
          that.inviteList.push(newInviteItem);
          //开始倒计时，设置用户连麦状态
          newInviteItem.timer.createInterval();
          //
          that.memberList.map((mitem, mindex) => {
            if (mitem.userId == strUserid) {
              that.memberList[mindex].invited = 1;
            }
          });
          that.mHoster.sendUserMessage(0, that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
            mType: 5,//邀请
            userid: strUserid
          }));
        }).catch(er => { });
      // }
    },
    //主播接受连麦申请
    acceptLine(index) {
      let that = this;

      that.mHoster.acceptRTCLine(that.applyList[index].peerId);
      that.applyList.splice(index, 1);
    },
    //主播拒绝连麦申请
    refuseLine(nIndex) {
      let that = this;

      that.mHoster.rejectRTCLine(that.applyList[nIndex].peerId);
      //删除申请连麦列表
      that.applyList.splice(nIndex, 1);
    },
    //主播挂断连麦申请
    hangupUserLine (userId, userName, strPubId) {
      let that = this;

      that.$confirm('您要挂断与' + userName + '的连麦吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Logger("挂断的连麦" + strPubId);
        that.mHoster.hangupRTCLine(strPubId);
        //清空邀请人员、重置参会人员邀请状态
        // that.inviteList.map((item, index) => {
        //   if (item.userId == userId) {
        //     that.memberList.map((iitem, iindex) => {
        //       if (iitem.userId == userId) {
        //         that.memberList[iindex].invited = 0;
        //       }
        //     });
        //     //
        //     that.inviteList.splice(index, 1);
        //   }
        // });
      }).catch(() => { });
    },
    //
    getMemberList() {
      let that = this;

      //获取人员列表
      that.mHttp.getLiveMemberList(that.RoomSvrID, that.linePageIndex, that.RoomID, that.mId, (errCode, data) => {
        Logger(errCode, data);
        if (errCode == 0) {
          that.lineTotalMember = data.Total;
          // that.roomMember = data.Total;

          let onlineArr = [];
          that.mConnectList.map((item, index) => {
            onlineArr.push(item.userId);
          });

          that.memberList = [];
          for (let i in data.UserData) {
            let invited = 0;
            // that.inviteList.map((item, index) => {
            //   if (item.userId == data.UserId[i]) {
            //     invited = item.invited;
            //   }
            // });
            if (onlineArr.indexOf(data.UserId[i]) == -1) {
              //添加人员列表
              that.memberList.push({
                userId: data.UserId[i],
                userType: JSON.parse(data.UserData[i]).devType,
                userIcon: JSON.parse(data.UserData[i]).headUrl ? JSON.parse(data.UserData[i]).headUrl : USER_HD_URL,
                userName: JSON.parse(data.UserData[i]).nickName,
                invited: invited
              });
            }
          }
        }
      });
    }
  }
}


// WEBPACK FOOTER //
// ./src/components/pages/Meeting/mixins/hostMeet.js