import * as utils from '@/assets/utils/utils';

export default {
  data() {
    return {
      mGuest: null,
      mGuestInfo: {},
      
      // anyPlayer: null,              //video player 实例对象
      // flashvars: {},                //video player 参数
      videoObject: {},

      applyState: 0,                //申请连麦状态 0默认 1申请中 2申请成功
      applyTimer: null,             //申请连麦计时器
      applySeconds: 29,             //申请连麦倒计时
    }
  },

  methods: {
    initGuester () {
      let that = this;

      //初始化播放器
      // that.anyPlayer = HLobj || window.HLobj;
      // that.anyPlayer = HLobj || window.HLobj;
      //实例
      that.mGuest = new (RTMPCGuestKit || window.RTMPCGuestKit)();
      //初始化
      that.mGuest.initEngineWithAnyRTCInfo(DEV_ID, APP_ID, APP_KEY, APP_TOKEN, DOMAIN);
      //配置私有云
      that.mGuest.configServerForPriCloud(RTC_URL, RTC_PROT);
      //连接RTC
      if (that.ssuc) {//登录
        that.jUserData["devType"] = 3;
        that.jUserData["isHost"] = 0;
        that.jUserData["userId"] = that.userInfo.userid;
        that.jUserData["nickName"] = that.userNickName ? that.userNickName : that.userInfo.userNickName;
        that.jUserData["headUrl"] = that.userInfo.userIcon || USER_HD_URL;
      } else {
        that.jUserData["devType"] = 3;
        that.jUserData["isHost"] = 0;
        that.jUserData["userId"] = utils.randomUserId();
        that.jUserData["nickName"] = that.userNickName ? that.userNickName : utils.randomUserName();
        that.jUserData["headUrl"] = USER_HD_URL;
      }

      that.mGuest.joinRTCLine(that.mId, that.jUserData["userId"], JSON.stringify(that.jUserData));
      //播放RTMP
      that.displayPlayer();

      //采集摄像头成功
      that.mGuest.on('onSetLocalVideoCapturerResult', (nCode, dRender, stream) => {
        if (nCode === 0) {
          let openVideo = that.ssuc ? (that.userInfo.videoEnabled == 0 ? true : false) : true;
          let openAudio = that.ssuc ? (that.userInfo.audioEnabled == 0 ? true : false) : true;
          that.micEnabled = openAudio;
          that.cameraEnabled = openVideo;
          that.mGuestInfo = {
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
          };
          //游客端打开摄像都需要申请连麦
          that.mGuest.applyRTCLine(JSON.stringify(that.jUserData));
        } else if (nCode == 7) {
          //重置连麦申请
          that.applyState = 0;
          
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
      that.mGuest.on('onRTCJoinLineResult', (nCode) => {
        Logger('加入RTC服务连接结果', nCode);
        if (nCode === 0) {//成功
          Logger('onRTCCreateLineResult OK');
          //注册监听事件，防止误操作导致浏览器关闭刷新
          that.registerUnload();
        } else if (nCode === 605) {
          that.$alert('会议未开始！请等待房主进入房间后再试！', '系统提示', {
            confirmButtonText: '确定',
            callback: action => {
              //离开页面不需要在验证
              that.leaveVerify = false;
              that.back();
            }
          });
        } else {
          that.$message.error('创建RTC服务连接异常：：' + nCode);
        }
      });
      //游客连麦加入rtcPeerID, pubId, dRemder, rtcUserData
      that.mGuest.on("onRTCOpenVideoRender", (strPeerId, strPubId, dVideoRender, strUserData) => {
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
          that.shareType = 2;
          that.shareResult = true;//shareResult是共享的样式标识
          that.sharerName = JSON.parse(strUserData).nickName;
          
          var video = document.createElement('video');
          video.id = strPubId;
          video.autoplay = "autoplay";
          video.style.width = "100%";
          video.style.height = "auto";
          //重新设置视频窗口大小
          that.$nextTick(() => {
            document.getElementById("shareScreenView").appendChild(video);
            that.resizeVideos();
          });
        }
      });
      //游客连麦退出
      that.mGuest.on("onRTCCloseVideoRender", (strPeerId, strPubId, strUserData) => {
        Logger('onRTCCloseVideoRender', strPeerId, strPubId, strUserData);

        if (strPubId.indexOf('X100') != -1) {
          that.shareType = 0;
          that.sharerName = "";
          that.shareResult = false;//shareResult是共享的样式标识
          that.$nextTick(() => {
            that.resizeVideos();
          });
          return
        }
        //删除视频窗口&&删除参会人员列表
        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList.splice(index, 1);
          }
        });
        //重新设置视频窗口大小
        that.$nextTick(() => {
          that.resizeVideos();
        });
      });
      //收到游客连麦的视频流
      that.mGuest.on('onRTCRemoteStream', (stream, strPeerId, strPubId) => {
        Logger('onRTCRemoteStream', stream, strPubId);

        if (strPubId.indexOf("X100") == -1) { //不是屏幕共享
          that.mConnectList.map((item, index) => {
            if (item.pubId == strPubId) {
              that.mConnectList[index].src = window.URL.createObjectURL(stream)
            }
          });
        } else {
          //设置远程视频窗口视频流
          that.mGuest.setRTCVideoRender(stream, document.getElementById(strPubId));
        }
      });
      // 监听视频窗口码率
      that.mGuest.on("onRTCPeerVideoBytes", (strPubId, videoBytes) => {
        // Logger("onRTCPeerVideoBytes", strPubId, videoBytes);

        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].videoBytes = videoBytes;
          }
        });
      });
      // 监听视频窗口音量
      that.mGuest.on("onRTCPeerAudioDetect", (strPubId, nAudioLevel) => {
        // Logger("onRTCPeerAudioDetect", strPubId, nAudioLevel);
        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].audioLevel = nAudioLevel < 2 ? 0 : nAudioLevel;
          }
        });
      });
      // 监听视频窗口网络状态
      that.mGuest.on("onRTCNetworkStatus", (strPubId, nNetBytes, nPktLost) => {
        // Logger("onRTCNetworkStatus", strPubId, nNetBytes, nPktLost);
        
        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].netBytes = nNetBytes;
            that.mConnectList[index].pkgLost = nPktLost;
          }
        });
      });
      //申请连麦结果
      that.mGuest.on("onRTCApplyLineResult", (nCode, strLivePeerId) => {
        Logger('onRTCApplyLineResult', nCode, strLivePeerId);
        if (nCode === 0) {//主播接受连麦申请
          //会议是否开始标识、用于显示隐藏工具栏视频和音频开关
          that.mIsStart = true;
          //设置连麦状态为成功
          that.applyState = 2;
          // 添加视频显示窗口
          that.createVideo(that.mGuestInfo);
          //把自己从参会人员移到连麦列表
          that.$nextTick(() => {
            that.getMemberList();
          });
        } else if (nCode === 601) {//主播拒绝连麦申请
          that.$message.error("主播拒绝连麦申请！");
          //设置连麦状态为默认
          that.applyState = 0;
          //会议是否开始标识、用于显示隐藏工具栏视频和音频开关
          that.mIsStart = false;
        } else if (nCode === 602) {//连麦人数已满
          that.$message.error("连麦人数已满！");
          //设置连麦状态为默认
          that.applyState = 0;
        }
      });
      //主播挂断游客连麦
      that.mGuest.on("onRTCHangupLine", () => {
        //
        that.$message("主播已经挂断了与您的连麦");
        //连麦状态从成功到默认接着播放
        that.applyState = 0;
        that.mIsStart = false;
        //删除视频窗口&&删除参会人员列表
        that.mConnectList.map((item, index) => {
          if (item.pubId == "myself") {
            that.mConnectList.splice(index, 1);
          }
        });
      });
      //主播断开RTC服务连接
      that.mGuest.on("onRTCLineLeave", () => {
        Logger('onRTCLineLeave');
        that.$alert('房主已退出！', '系统提示', {
          confirmButtonText: '确定',
          callback: action => {
            window.onunload = null;
            window.onbeforeunload = null;
            //离开页面不需要在验证
            that.leaveVerify = false;
            that.back();
          }
        });
      });
      //收到消息回调
      that.mGuest.on("onRTCUserMessage", (nType, strUserId, strUserName, strUserHeaderUrl, strMessage) => {
        Logger('onRTCUserMessage', nType, strUserId, strUserName, strUserHeaderUrl, strMessage);

        if (nType == 0) {
          var userData = JSON.parse(strMessage);
          switch (userData.mType) {
            case 0://普通消息
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
            case 2:
              if (that.jUserData["userId"] == userData.userid) {
                if (that.inviteTimer) {
                  clearInterval(that.inviteTimer);
                  that.inviteModel = false;
                  that.inviteSeconds = 29;
                }
                that.mGuest.clear();
                that.$alert('你已被房主请离房间', '系统', {
                  confirmButtonText: '确定',
                  callback: action => {
                    window.onbeforeunload = null;
                    window.onunload = null;
                    //离开页面不需要在验证
                    that.leaveVerify = false;
                    that.back();
                  }
                });
              }
              break;
            case 5://房主邀请连麦（反向邀请）
              if (that.jUserData["userId"] == userData.userid) {

                if (that.inviteTimer) {
                  clearInterval(that.inviteTimer);
                  that.inviteModel = false;
                  that.inviteSeconds = 29;
                }
                if (!that.inviteModel) {
                  that.inviteModel = true;
                }

                that.inviteTimer = setInterval(() => {
                  if (that.inviteSeconds == 1) {
                    clearInterval(that.inviteTimer);
                    that.inviteModel = false;
                    that.inviteSeconds = 29;
                    that.mGuest.sendUserMessage(0, that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
                      "mType": 6,
                      "userid": that.jUserData["userId"],
                      "guestName": that.jUserData["nickName"]
                    }));
                  }
                  that.inviteSeconds--;
                }, 1000);
              }
              break;
          }
        }
      });
      //收到消息回调
      that.mGuest.on("onRTCMemberListNotify", (nTotalMember, RoomID, RoomSvrID) => {
        Logger('onRTCMemberListNotify', nTotalMember);

        that.RoomSvrID = RoomSvrID;
        that.RoomID = RoomID;
        that.getMemberList();
      });
    },

    handleApplyLine (nState) {
      let that = this;

      that.applyState = nState;
      switch (nState) {
        case 0: //取消连麦
          that.mGuest.hangupRTCLine();
          that.mGuestInfo = {};
          that.mIsStart = false;
          //主动移除自己像
          that.mConnectList.map((item, index) => {
            if (item.pubId == "myself") {
              that.mConnectList.splice(index, 1)
            }
          });
          break;
        case 1: //申请连麦
          that.mGuest.setLocalVideoCapturer();
          break;
      }
    },
    
    agreeLine() {
      let that = this;

      clearInterval(that.inviteTimer);
      that.inviteModel = false;
      that.inviteSeconds = 29;

      that.applyState = 2;
      that.mGuest.setLocalVideoCapturer();
    },

    rejectLine() {
      let that = this;

      if (that.inviteTimer) {
        clearInterval(that.inviteTimer);
        that.inviteModel = false;
        that.inviteSeconds = 29;
        that.mGuest.sendUserMessage(0, that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
          "mType": 6,
          "userid": that.jUserData["userId"],
          "guestName": that.jUserData["nickName"]
        }));
      }
    },

    displayPlayer() {
      let that = this;

      setTimeout(() => {
        // that.anyPlayer.embedSWF("/static/player/HLPlayer.swf", "hostVideo", 'hostVideo_view', '100%', '100%', that.flashvars);
        var player = new ckplayer(that.videoObject);
      }, 0);
    },
    
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
// ./src/components/pages/Meeting/mixins/guestMeet.js