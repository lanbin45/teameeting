import io from "socket.io-client";

import * as utils from '@/assets/utils/utils';
import Canvas from '@/assets/board/newdraw';
import anyRTCDetect from '@/assets/RTCDetect/anyRTCDetect';

export default {
  data () {
    return {
      Meet: null,

      uploading: false, 
      loadingDoc: false,

      docsList: [],                 //文档列表
      fileId: '',                     //当前共享的文档id
      fileType: '',                   //文档的分类（0/1/2/3:图片/word/xls/ppt/pdf）

      //画板服务---------------------
      socket: null,
      pen: null,
      penType: 0,                   //画笔type null说明不可编辑 0涂鸦 1箭头 2直线 3矩形
      openPenOps: false,            //画笔选项是否显示
      boardLoading: false,          //是否显示画板加载
      nBgIndex: 1,                  //当前画板index
      nBgTotal: 0,                  //画板最大数量
      allowDraw: false,             //允许所有人是否可画
      allboardInfo: [],             //所有画板的信息，画板index对应画板信息
      currentBoardInfo: [],         //当前画板的信息
      boardLocalIdList: [],         //画板index对应的本地画笔id数组
      backgroundList: [],                   //画板背景列表

    }
  },

  methods: {
    changeDevice() {
      let that = this;
 
      that.Meet.switchDevice(that.cameraValue, that.micValue);
    },
    initMeet () {
      let that = this;

      that.Meet = new (RTMeetKit || window.RTMeetKit)();
      that.Meet.initEngineWithAnyRTCInfo(DEV_ID, APP_ID, APP_KEY, APP_TOKEN, DOMAIN);
      that.Meet.configServerForPriCloud(RTC_URL, RTC_PROT);
      that.Meet.getDevices(devices => {
        that.cameraList = devices.videoinput;
        that.micList = devices.audioinput;
        that.cameraValue = that.cameraList[that.cameraList.length - 1].deviceId;
        that.micValue = that.micList[that.cameraList.length - 1].deviceId;

        that.Meet.setLocalVideoCapturer({
          needCamera: that.hasWebcam,
          needMicrophone: that.hasMicrophone,
          cameraDeviceId: that.cameraValue,
          microphoneDeviceId: that.micValue
        });
      });
      //会议的视频质量0（流畅）:320240/128 1（标清）:352288/256 2（高清）:640480/512 3（超高清）:web中使用分辨率(1280720/1024),app中使用分辨率(960540/768) 4（超级会议仅在pc中web和终端中使用）:19201080分辨率（H264编解码：码率2048，VP9编解码：码率1024（VP9编解码仅在chrome,firefox中使用）
      var meetQuality = "";
      switch (that.mQuality) {
        case 0:
          meetQuality = "RTCMeet_Videos_Flow";
          break;
        case 1:
          meetQuality = "RTCMeet_Videos_Low";
          break;
        case 2:
          meetQuality = "RTCMeet_Videos_SD";
          break;
        case 3:
          meetQuality = "RTCMeet_Videos_HD";
          break;
        case 4:
          meetQuality = "RTCMeet_Videos_HHD";
          break;
        default:
          meetQuality = "RTCMeet_Videos_Flow";
          break;
      }
      that.Meet.setVideoMode(meetQuality);
      
      // that.Meet.setLocalVideoCapturer({
      //   needCamera: that.hasWebcam,
      //   needMicrophone: that.hasMicrophone,
      //   cameraDeviceId: that.cameraValue,
      //   microphoneDeviceId: that.micValue
      // });
      that.Meet.on('onSetLocalVideoCapturerResult', (nCode, videoRender, stream) => {
        Logger('onSetLocalVideoCapturerResult', nCode, videoRender, stream);

        that.jUserData["MaxJoiner"] = that.mMaxMember;
        if (nCode === 0) {
          if (that.ssuc) {//登录
            that.jUserData["devType"] = 3;//devType 0/1/2/3/4/5 android/ios/windows/web/tv/h5
            that.jUserData["userId"] = that.userInfo.userid;
            that.jUserData["nickName"] = that.userNickName ? that.userNickName : that.userInfo.userNickName;
            that.jUserData["headUrl"] = that.userInfo.userIcon ? that.userInfo.userIcon : USER_HD_URL;
          } else {
            that.jUserData["devType"] = 3;
            that.jUserData["userId"] = utils.randomUserId();
            that.jUserData["nickName"] = that.userNickName ? that.userNickName : utils.randomUserName();
            that.jUserData["headUrl"] = USER_HD_URL;
          }
          //会议是否开始标识、用于显示隐藏工具栏视频和音频开关
          that.mIsStart = true;
          that.Meet.joinRTC(that.mId, true, that.jUserData["userId"], JSON.stringify(that.jUserData));

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
        } else if (nCode == 7) {
          if (videoRender === "NotFoundMicrophone") {
            that.$message.error("打开摄像头错误：：没有找到麦克风");
          } else if (videoRender === "DevicesNotFoundError" || videoRender === "NotFoundError") {
            that.$message.error("打开摄像头错误：：请检查你的摄像头和音频权限");
          } else if (videoRender === "NotReadableError" || videoRender === "TrackStartError") {
            that.$message.error("打开本地摄像失败");
          } else if (videoRender === "OverconstrainedError" || videoRender === "ConstraintNotSatisfiedErrror") {
            that.$message.error("打开摄像头错误：：本地摄像头不满足当前会议设置的分辨率");
          } else if (videoRender === "NotAllowedError" || videoRender === "PermissionDeniedError") {
            that.$message.error("打开摄像头错误：：未允许浏览器打开您的摄像头");
          }
        }
      });

      that.Meet.on('onLocalStreamUpdated', (stream, src) => {
        that.mConnectList.map(item => {
          if (item.isSelf) {
            item.src = src;
          }
        });
      });

      that.Meet.on('onRTCJoinMeetOK', () => {
        Logger('onRTCJoinMeetOK');
        //注册监听事件，防止误操作导致浏览器关闭刷新
        that.registerUnload();
        //通知其他人员
        /**
         *    发送消息
         *    @params strUserName           业务平台的用户昵称       （Max 256字节）
         *    @params strUserHeaderUrl      业务平台的用户头像       （Max 512字节）
         *    @params strContent            业务平台自定义消息内容   （Max 1024字节）
         *    mTYpe                         0 普通消息
         *    mContent                      消息内容
         *    返回值 bollean
         **/
        that.Meet.sendUserMessage(that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
          mType: 4,
          userid: that.jUserData["userId"],
          name: that.jUserData["nickName"]
        }));
      });

      that.Meet.on("onRTCJoinMeetFailed", nCode => {
        Logger("onRTCJoinMeetFailed", nCode);
        switch (nCode) {
          case 701:
            that.$alert('当前会议人数已满！', '系统提示', {
              confirmButtonText: '确定',
              callback: action => {
                window.onbeforeunload = null;
                window.onunload = null;
                //离开页面不需要在验证
                that.leaveVerify = false;
                that.back();
              }
            });
            break;
          default:
            that.$message.error("连接RTC异常，请稍后重试！");
            break;
        }
      });
      //需要升级适配SDK
      that.Meet.on("onRTCOpenScreenRender", (strPeerId, strPubId, dRander, strUserData) => {
        that.shareResult = true;//shareResult是共享的样式标识
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
      });
      // 远程人员加入
      that.Meet.on("onRTCOpenVideoRender", (strPeerId, strPubId, dRander, strUserData) => {
        Logger("onRTCOpenVideoRender", strPeerId, strPubId, dRander, strUserData);

        let openVideo = true;
        let openAudio = true;
        if (strPubId != "mySelf") {
          if (that.peerAVState[strPubId]) {
            openVideo = that.peerAVState[strPubId].openVideo;
            openAudio = that.peerAVState[strPubId].openAudio;
          }
        }
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
          camera: openVideo,
          microphone: openAudio,
          width: '100%',
          height: '100%',
          src: ""
        });
      });
      // 收到远程人员视频流
      that.Meet.on("onRTCRemoteStream", (oStream, strPeerId, strPubId) => {
        Logger("onRTCRemoteStream", oStream, strPeerId, strPubId);

        if (strPubId.indexOf("X100") == -1) { //不是屏幕共享
          that.mConnectList.map((item, index) => {
            if (item.pubId == strPubId) {
              that.mConnectList[index].src = window.URL.createObjectURL(oStream)
            }
          });
        } else {
          //设置远程视频窗口视频流
          that.Meet.setRTCVideoRender(oStream, document.getElementById(strPubId));
        }
      });
      // 监听视频窗口码率
      that.Meet.on("onRTCPeerVideoBytes", (strPubId, videoBytes) => {
        // Logger("onRTCPeerVideoBytes", strPubId, videoBytes);

        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].videoBytes = videoBytes;
          }
        });
      });
      // 监听视频窗口音量
      that.Meet.on("onRTCPeerAudioDetect", (strPubId, nAudioLevel) => {
        // Logger("onRTCPeerAudioDetect", strPubId, nAudioLevel);

        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].audioLevel = nAudioLevel < 2 ? 0 : nAudioLevel;
          }
        });
      });
      // 监听视频窗口网络状态
      that.Meet.on("onRTCNetworkStatus", (strPubId, nNetBytes, nPktLost) => {
        // Logger("onRTCNetworkStatus", strPubId, nNetBytes, nPktLost);

        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList[index].netBytes = nNetBytes;
            that.mConnectList[index].pkgLost = nPktLost;
          }
        });
      });
      // 远程人员离开
      that.Meet.on("onRTCCloseVideoRender", (strPeerId, strPubId) => {
        if (strPubId.indexOf('X100') != -1) {
          return
        }
        //删除视频窗口&&删除参会人员列表
        that.mConnectList.map((item, index) => {
          if (item.pubId == strPubId) {
            that.mConnectList.splice(index, 1)
          }
        });
        //删除入会时存储的音视频状态
        if (that.peerAVState[strPubId]) {
          delete that.peerAVState[strPubId]
        }
        //重新设置视频窗口大小
        that.$nextTick(() => {
          that.resizeVideos();
        });
      });
      //收到消息回调
      that.Meet.on("onRTCUserMessage", (strUserId, strUserName, strUserHeaderUrl, strMessage) => {
        Logger("onRTCUserMessage", strUserId, '::', strUserName, '::', strUserHeaderUrl, '::', strMessage);

        let msgData;
        if (typeof strMessage === "string") {
          msgData = JSON.parse(strMessage);
        } else if (typeof strMessage === "object") {
          msgData = strMessage;
        }

        switch (msgData.mType) {
          case 0: //普通消息
            if (that.siderShow && that.currentSiderName == "message") {
              that.hasNewMsg = false;
            } else {
              that.hasNewMsg = true;
            }
            that.addMsgList(strUserName, strUserHeaderUrl, strUserId, utils.Base64.decode(msgData.mContent), msgData.mTime * 1000);
            break;
          case 1: //开关音视频
            if (msgData.userid === that.jUserData["userId"]) {
              if (msgData.type == 0) {
                let openAudio = msgData.state == 1 ? true : false;
                // that.Meet.setLocalAudioEnable(openAudio);
                that.micEnabled = openAudio;
                //别人关闭自己的音频
                that.mConnectList.map((item, index) => {
                  if (item.userId == msgData.userid) {
                    item.microphone = openAudio;
                  }
                });
              } else if (msgData.type == 1) {
                let openVideo = msgData.state == 1 ? true : false;
                // that.Meet.setLocalVideoEnable(openVideo);
                that.cameraEnabled = openVideo;
                //别人关闭自己的视频
                that.mConnectList.map((item, index) => {
                  if (item.userId == msgData.userid) {
                    item.camera = openVideo;
                  }
                });
              }
            }
            break;
          case 2: //踢人
            if (msgData.userid === that.jUserData["userId"]) { // 如果是自己
              that.Meet.leaveRTC();
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
          case 3: //文档系统是否可操作
            // that.allowDraw = msgData.value == 1 ? true : false;
            if (msgData.value == 1) {
              that.$message.success(`当前画板可以编辑`);
            } else {
              that.$message.error(`当前画板不允许编辑`);
            }
            break;
          case 4: //进会提醒
            if (that.ssuc) {
              if (!!that.userInfo.roomNotify) {
                that.$notify({
                  title: '提示',
                  message: msgData.name + "加入会议！",
                  duration: 2000
                });
              }
            } else {
              that.$notify({
                title: '提示',
                message: msgData.name + "加入会议！",
                duration: 2000
              });
            }
            break;
        }
      });
      //收到消息回调
      that.Meet.on('onRTCAVStatus', (strPubId, bAudioEnable, bVideoEnable) => {
        Logger('onRTCAVStatus', strPubId, bAudioEnable, bVideoEnable);

        //入会成功存储状态，因为这时还没有视频流
        that.peerAVState[strPubId] = {
          openVideo: bVideoEnable,
          openAudio: bAudioEnable
        };
        //音视频状态包括参会人员
        that.mConnectList.map((item, index) => {
          if (item.pubId === strPubId) {
            item.camera = bVideoEnable;
            item.microphone = bAudioEnable;
          }
        });
      });
      /**
       *  收到其他人员开启共享
       *  @params nType                分享的类型  1文档共享 2屏幕共享 3媒体共享
       *  @params strWBInfo            文档共享传文档id || 屏幕共享视频流的chanId
       *  @params strUserId            自定义用户id
       *  @params strUserData          自定义用户信息
       **/
      that.Meet.on("onRTCUserShareOpen", (nType, strWBInfo, strUserId, strUserData) => {
        Logger("onRTCUserShareOpen", nType, strWBInfo, strUserId, strUserData);

        that.shareType = nType;
        that.sharerName = JSON.parse(strUserData).nickName;

        switch (nType) {
          case 1://文档
            let shareInfo = JSON.parse(strWBInfo);
            that.fileId = shareInfo.fileid;
            that.fileMId = shareInfo.meetid;
            //和pc通道时候再加
            that.getFileInfo(that.fileId, that.fileMId, () => {
              that.shareResult = true;
              that.resizeVideos();

              that.$nextTick(() => {
                //实例化画板
                if (that.pen === null) {
                  that.pen = new Canvas(document.getElementById("myCanvas"), document.getElementById('myCanvas'));
                }
                //链接socket
                if (that.socket === null) {
                  that.socket = io(__WSURL);
                }
                //
                // 画板不可编辑的回调
                that.pen.on("onBoardDisabled", () => {
                  that.$message.error("当前画板不可编辑");
                });
                // 绘画结束的回调
                that.pen.on("done", (data, localBID) => {
                  // Logger(data, localBID);

                  //存储各个白板的本地画笔id
                  (typeof that.boardLocalIdList[that.nBgIndex] === "undefined") && (that.boardLocalIdList[that.nBgIndex] = []);
                  that.boardLocalIdList[that.nBgIndex].push(localBID);

                  var bdata = {
                    board_seqid: that.fileId,
                    board_localid: localBID,
                    board_anyrtcid: that.mId,
                    board_number: that.nBgIndex,
                    board_data: data
                  };
                  /**
                   *  socket
                   *  上传自己的画笔
                   **/
                  that.socket.emit('push_board', JSON.stringify(bdata));
                });
                // socket连接服务成功
                that.socket.on('connect', () => {
                  Logger('connect');

                  /**
                   *  初始化anyrtc信息
                   **/
                  that.socket.emit('init_anyrtc', {
                    anyrtc_developerid: DEV_ID,
                    anyrtc_appid: APP_ID,
                    anyrtc_appkey: APP_KEY,
                    anyrtc_apptoken: APP_TOKEN
                  });

                  /**
                   *  初始化anyrtc成功
                   **/
                  that.socket.on('init_anyrtc_success', (res) => {
                    if (res.code === 0) {
                      /**
                       *  初始化画板
                       **/
                      that.socket.emit('init_all_board', {
                        board_seqid: that.fileId,
                        board_anyrtcid: that.mId,
                        board_array: that.backgroundList
                      });
                    }
                  });

                  /**
                   *  初始化anyrtc失败
                   **/
                  that.socket.on('init_anyrtc_failed', (res) => {
                    Logger('初始化anyrtc失败', res);
                    if (res.code === 201) {
                      // 获取appkey和apptoken失败

                    }
                  });

                  /**
                   *  画板初始化成功 从这里开始
                   **/
                  that.socket.on('init_all_board', (req) => {
                    // Logger('init_all_board', req);

                    if (req.code === 0) {
                      let boardInfo = req.board_info,
                        docInfo = req.doc_info;

                      //当前画板id
                      that.nBgIndex = docInfo.sys_docs_curt_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
                      //画板是否可编辑
                      that.allowDraw = docInfo.sys_docs_is_edit == 1 ? true : false;
                      //设置画板是否可编辑
                      if (that.mSharer) {
                        that.pen.switchEdit(true);
                      } else {
                        if (that.ssuc) {
                          that.pen.switchEdit(that.allowDraw);
                        } else {
                          that.pen.switchEdit(false);
                          that.allowDraw = false;
                        }
                      }
                      //设置最大页数
                      that.nBgTotal = boardInfo.length;
                      that.backgroundList = [];
                      //
                      for (let i in boardInfo) {
                        //存储每页的画板信息
                        that.allboardInfo.push(JSON.parse(boardInfo[i]['board_info_list']));
                        that.backgroundList.push({
                          board_number: boardInfo[i]['sys_board_number'],
                          board_background: boardInfo[i]['sys_board_background']
                        });
                      }
                      //当前页面的数据
                      that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
                      //根据当前数据绘画当前页面
                      that.pen.strokeBoard(that.currentBoardInfo);
                    }
                  });
                  /**
                   *  画板背景更新
                   *  update_board_background
                   * */
                  // socket.emit('update_board_background', {
                  //  board_anyrtcid: "",
                  //  board_number: "",
                  //  board_background：""
                  // });
                  /**
                   *  socket
                   *  监听画笔更新（自己）
                   **/
                  that.socket.on("push_board", (req) => {
                    Logger("push_board", req);
                    if (req.code === 0) {
                      let res = req.result;
                      //存储当前画笔数据至当前画板数据中
                      that.currentBoardInfo.push(res[0]);
                      that.allboardInfo[that.nBgIndex - 1].push(res[0]);
                    } else if (req.code === 300) {
                      // 参数为空
                    }
                  });

                  /**
                   *  socket
                   *  画板画笔更新（其他人员）
                   **/
                  that.socket.on('update_board', (req) => {
                    Logger('update_board', req);
                    if (req.code === 0) {
                      let res = req.result;
                      if (res[0].board_number == that.nBgIndex) { //如果是别人画的是当前画板则添加至当前画板否则不添加
                        //将其他与会者画的画笔添加到当前画板数据中
                        that.currentBoardInfo.push(res[0]);
                        that.allboardInfo[that.nBgIndex - 1] = that.currentBoardInfo;
                        //重画当前画板
                        that.pen.strokeBoard(that.currentBoardInfo);
                      } else {
                        that.allboardInfo[res[0].board_number - 1].push(res[0]);
                      }
                    }
                  });

                  /**
                   *  socket
                   *  监听撤销
                   **/
                  that.socket.on('revoke_board', (req) => {
                    Logger(req);

                    if (req.code === 0) {
                      let res = req.result;
                      let newData = res.all_board_info;

                      //替换所有画板中撤销画板的数据
                      that.allboardInfo[that.nBgIndex - 1] = newData;
                      that.currentBoardInfo = newData;
                      that.pen.strokeBoard(newData);
                    }
                  });

                  /**
                   *  socket
                   *  监听清屏
                   **/
                  that.socket.on('clear_board', () => {
                    that.pen.clear();
                    //删除画板(当前)
                    that.currentBoardInfo = [];
                    that.allboardInfo[that.nBgIndex - 1] = [];
                    that.boardLocalIdList[that.nBgIndex] = [];
                    that.$message('清屏成功！');
                  });

                  /**
                   *  socket
                   *  监听添加画板
                   **/
                  that.socket.on('add_board', (res) => {
                    Logger('add_board', res);
                    if (res.code === 0) {
                      let boardInfo = res.board_info;
                      let docInfo = res.doc_info;

                      //重置所有画板信息
                      that.allboardInfo = [];
                      //重置所有背景图
                      that.backgroundList = [];
                      //
                      for (let i in boardInfo) {
                        //存储每页的画板信息
                        that.allboardInfo.push(JSON.parse(boardInfo[i]['board_info_list']));
                        //存储每页的画板背景图
                        that.backgroundList.push({
                          board_number: boardInfo[i]['sys_board_number'],
                          board_background: boardInfo[i]['sys_board_background']
                        });
                      }
                      //设置当前画板id
                      that.nBgIndex = docInfo.sys_docs_curt_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
                      //设置画板总页
                      that.nBgTotal = boardInfo.length;
                      //当前页面的数据
                      that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
                      //根据当前数据绘画当前页面
                      that.pen.strokeBoard(that.currentBoardInfo);
                      //----------
                      //画板是否可编辑
                      // that.allowDraw = docInfo.sys_docs_is_edit == 1 ? true : false;
                      // //设置画板是否可编辑
                      // if (that.mSharer)
                      //   that.pen.switchEdit(true)
                      // else
                      //   that.pen.switchEdit(that.allowDraw);
                      //
                    }
                  });

                  /**
                   *  socket
                   *  监听画板删除
                   **/
                  that.socket.on('delete_board', (res) => {
                    Logger('delete_board', res);
                    if (res.code == 0) {
                      let boardInfo = res.board_info;
                      let docInfo = res.doc_info;

                      //重置所有画板信息
                      that.allboardInfo = [];
                      //重置所有背景图
                      that.backgroundList = [];
                      //
                      for (let i in boardInfo) {
                        //存储每页的画板信息
                        that.allboardInfo.push(JSON.parse(boardInfo[i]['board_info_list']));
                        //存储每页的画板背景图
                        that.backgroundList.push({
                          board_number: boardInfo[i]['sys_board_number'],
                          board_background: boardInfo[i]['sys_board_background']
                        });
                      }
                      //设置当前画板id
                      that.nBgIndex = docInfo.sys_docs_curt_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
                      //设置画板总页
                      that.nBgTotal = boardInfo.length;
                      //当前页面的数据
                      that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
                      //根据当前数据绘画当前页面
                      that.pen.strokeBoard(that.currentBoardInfo);
                    }
                    // that.pen.clear();
                    //删除画板(当前)
                    // that.currentBoardInfo = [];
                    // that.$message('清屏成功！');
                  });

                  /**
                   *  socket
                   *  监听切换画板
                   **/
                  that.socket.on("switch_board", (res) => {
                    if (res.code === 0) {
                      Logger(res);
                      let boardInfo = res.board_info,
                        switchInfo = res.switch_info;

                      //重画
                      let bInfoList = JSON.parse(boardInfo[0]['board_info_list']);
                      // that.currentBoardInfo = [];
                      that.currentBoardInfo = bInfoList;
                      that.pen.doneQueue = [];//先清除队列的画笔
                      that.pen.strokeBoard(bInfoList);

                      //设置当前页
                      that.nBgIndex = switchInfo.board_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (switchInfo.board_number - 1)) * 100 + "%)";
                    }
                  });

                  /**
                   * 监听开启或者关闭白板
                   * */
                  that.socket.on("update_board_edit", (res) => {
                    Logger(res);
                    if (res.code === 0) {
                      let docInfo = res.doc_info,
                        edit = docInfo.sys_docs_is_edit;

                      if (that.ssuc) {
                        that.allowDraw = edit === 1 ? true : false;
                        if (that.allowDraw) {
                          that.$message.success(`当前画板可以编辑`);
                        } else {
                          that.$message.error(`当前画板不允许编辑`);
                        }
                        that.pen.switchEdit(that.allowDraw);
                      }
                    }
                  });

                  /**
                   *  socket      disconnect
                   *  重连
                   **/
                  that.socket.on('disconnect', () => {
                    Logger('disconnect');
                    that.socket = null;
                    that.socket = io(__WSURL);
                    that.boardLocalIdList = [];
                    that.currentBoardInfo = [];
                    that.allboardInfo = [];
                  });
                });
              });
            });
            break;
          case 2://屏幕
            
            break;
          case 3://限window端

            break;
        }
      });
      /**
       *  收到其他人员关闭共享
       **/
      that.Meet.on("onRTCUserShareClose", () => {
        Logger("onRTCUserShareClose");
        if (that.shareType == 1) {
          //清除画板等状态
          that.backgroundList = [];
          that.nBgTotal = 0;
          that.fileId = '';
          that.fileMId = '';
          if (that.socket !== null) {
            that.socket = null;
          }
          if (that.pen !== null) {
            that.pen = null;
            that.penType = 0;
            that.allboardInfo = [];
            that.currentBoardInfo = [];
            that.boardLocalIdList = [];
          }
        } else if (that.shareType == 2) {
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
      that.Meet.on("onRTCSetUserShareEnableResult", OK => {
        Logger("onRTCSetUserShareEnableResult", OK);
        if (OK) {
          //模板4
          //标识分享者
          that.mSharer = true;
          that.sharerName = that.jUserData['nickName'];
          
          if (that.shareType == 1) {//文档共享
            that.getFileInfo(that.fileId, that.fileMId, () => {
              //通知其他与会人员共享结果  // 文档共享
              that.Meet.setUserShareInfo(JSON.stringify({
                fileid: that.fileId,
                meetid: that.fileMId
              }));
              that.shareResult = true;
              that.mSharer = true;
              that.resizeVideos();
              that.$nextTick(() => {
                //实例化画板
                if (that.pen === null) {
                  // that.pen = new Canvas(document.getElementById("myCanvas"), document.getElementById('meeting_container'));
                  that.pen = new Canvas(document.getElementById("myCanvas"), document.getElementById('myCanvas'));
                  // that.pen.addListener(document.getElementById('meeting_container'));
                }
                //链接socket
                if (that.socket === null) {
                  that.socket = io(__WSURL);
                }
                // 画板不可编辑的回调
                that.pen.on("onBoardDisabled", () => {
                  that.$message.error("当前画板不可编辑");
                });
                // 绘画结束的回调
                that.pen.on("done", (data, localBID) => {
                  Logger(data, localBID);

                  //存储各个白板的本地画笔id
                  (typeof that.boardLocalIdList[that.nBgIndex] === "undefined") && (that.boardLocalIdList[that.nBgIndex] = []);
                  that.boardLocalIdList[that.nBgIndex].push(localBID);

                  var bdata = {
                    board_seqid: that.fileId,
                    board_localid: localBID,
                    board_anyrtcid: that.mId,
                    board_number: that.nBgIndex,
                    board_data: data
                  };
                  /**
                   *  socket
                   *  上传自己的画笔
                   **/
                  that.socket.emit('push_board', JSON.stringify(bdata));
                });
                // socket 连接服务成功
                that.socket.on('connect', () => {
                  Logger('connect');

                  /**
                   *  初始化anyrtc信息
                   **/
                  that.socket.emit('init_anyrtc', {
                    anyrtc_developerid: DEV_ID,
                    anyrtc_appid: APP_ID,
                    anyrtc_appkey: APP_KEY,
                    anyrtc_apptoken: APP_TOKEN
                  });

                  /**
                   *  初始化anyrtc成功
                   **/
                  that.socket.on('init_anyrtc_success', (res) => {
                    if (res.code === 0) {
                      /**
                       *  初始化画板
                       **/
                      that.socket.emit('init_all_board', {
                        board_seqid: that.fileId,
                        board_anyrtcid: that.mId,
                        board_array: that.backgroundList
                      });
                    }
                  });

                  /**
                   *  初始化anyrtc失败
                   **/
                  that.socket.on('init_anyrtc_failed', (res) => {
                    that.$message.error('初始化anyrtc失败');
                    if (res.code === 201) {
                      // 获取appkey和apptoken失败

                    }
                  });

                  /**
                   *  画板背景更新
                   *  update_board_background
                   * */
                  // socket.emit('update_board_background', {
                  //  board_anyrtcid: "",
                  //  board_number: "",
                  //  board_background：""
                  // });

                  /**
                   *  画板初始化成功 从这里开始
                   **/
                  that.socket.on('init_all_board', (req) => {
                    Logger('init_all_board', req);

                    if (req.code === 0) {
                      let boardInfo = req.board_info,
                        docInfo = req.doc_info;

                      //当前画板id
                      that.nBgIndex = docInfo.sys_docs_curt_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
                      //画板是否可编辑
                      that.allowDraw = docInfo.sys_docs_is_edit == 1 ? true : false;
                      //设置画板是否可编辑
                      //设置画板是否可编辑
                      if (that.mSharer) {
                        that.pen.switchEdit(true);
                      } else {
                        if (that.ssuc) {
                          that.pen.switchEdit(that.allowDraw);
                        } else {
                          that.allowDraw = false;
                          that.pen.switchEdit(false);
                        }
                      }
                      //设置最大页数
                      that.nBgTotal = boardInfo.length;
                      that.backgroundList = [];
                      //
                      for (let i in boardInfo) {
                        //存储每页的画板信息
                        that.allboardInfo.push(JSON.parse(boardInfo[i]['board_info_list']));
                        that.backgroundList.push({
                          board_number: boardInfo[i]['sys_board_number'],
                          board_background: boardInfo[i]['sys_board_background']
                        });
                      }
                      //当前页面的数据
                      that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
                      //根据当前数据绘画当前页面
                      that.pen.strokeBoard(that.currentBoardInfo);
                    }
                  });
                  /**
                   *  监听画板背景更新
                   *  update_board_background
                   * */
                  // that.socket.on('update_board_background', (req) => {
                  //   Logger("update_board_background", req);
                  //   if (req.code === 0) {
                  //     let res = JSON.parse(req.result);

                  //   }
                  // });
                  /**
                   *  socket
                   *  监听画笔更新（自己）
                   **/
                  that.socket.on("push_board", (req) => {
                    Logger("push_board", req);
                    if (req.code === 0) {
                      let res = req.result;
                      //存储当前画笔数据至当前画板数据中
                      that.currentBoardInfo.push(res[0]);
                      that.allboardInfo[that.nBgIndex - 1].push(res[0]);
                    } else if (req.code === 300) {
                      // 参数为空
                    }
                  });

                  /**
                   *  socket
                   *  画板画笔更新（其他人员）
                   **/
                  that.socket.on('update_board', (req) => {
                    Logger('update_board', req);
                    if (req.code === 0) {
                      let res = req.result;
                      if (res[0].board_number == that.nBgIndex) { //如果是别人画的是当前画板则添加至当前画板否则不添加
                        //将其他与会者画的画笔添加到当前画板数据中
                        that.currentBoardInfo.push(res[0]);
                        that.allboardInfo[that.nBgIndex - 1] = that.currentBoardInfo;
                        //重画当前画板
                        that.pen.strokeBoard(that.currentBoardInfo);
                      }
                    }
                  });

                  /**
                   *  socket
                   *  监听撤销
                   **/
                  that.socket.on('revoke_board', (req) => {
                    Logger(req);

                    if (req.code === 0) {
                      let res = req.result;
                      let newData = res.all_board_info;

                      //替换所有画板中撤销画板的数据
                      that.allboardInfo[that.nBgIndex - 1] = newData;
                      that.currentBoardInfo = newData;
                      that.pen.strokeBoard(newData);
                    }
                  });

                  /**
                   *  socket
                   *  监听清屏
                   **/
                  that.socket.on('clear_board', () => {
                    that.pen.clear();
                    //删除画板(当前)
                    that.currentBoardInfo = [];
                    that.allboardInfo[that.nBgIndex - 1] = [];
                    that.boardLocalIdList[that.nBgIndex] = [];
                    that.$message('清屏成功！');
                  });

                  /**
                   *  socket
                   *  监听添加画板
                   **/
                  that.socket.on('add_board', (res) => {
                    Logger('add_board', res);
                    if (res.code === 0) {
                      let boardInfo = res.board_info;
                      let docInfo = res.doc_info;

                      //重置所有画板信息
                      that.allboardInfo = [];
                      //重置所有背景图
                      that.backgroundList = [];
                      //
                      for (let i in boardInfo) {
                        //存储每页的画板信息
                        that.allboardInfo.push(JSON.parse(boardInfo[i]['board_info_list']));
                        //存储每页的画板背景图
                        that.backgroundList.push({
                          board_number: boardInfo[i]['sys_board_number'],
                          board_background: boardInfo[i]['sys_board_background']
                        });
                      }
                      //设置当前画板id
                      that.nBgIndex = docInfo.sys_docs_curt_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
                      //设置画板总页
                      that.nBgTotal = boardInfo.length;
                      //当前页面的数据
                      that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
                      //根据当前数据绘画当前页面
                      that.pen.strokeBoard(that.currentBoardInfo);
                      //----------
                      //画板是否可编辑
                      // that.allowDraw = docInfo.sys_docs_is_edit == 1 ? true : false;
                      // //设置画板是否可编辑
                      // if (that.mSharer)
                      //   that.pen.switchEdit(true)
                      // else
                      //   that.pen.switchEdit(that.allowDraw);
                      //
                    }
                  });

                  /**
                   *  socket
                   *  监听画板删除
                   **/
                  that.socket.on('delete_board', (res) => {
                    Logger('delete_board', res);
                    if (res.code == 0) {
                      let boardInfo = res.board_info;
                      let docInfo = res.doc_info;

                      //重置所有画板信息
                      that.allboardInfo = [];
                      //重置所有背景图
                      that.backgroundList = [];
                      //
                      for (let i in boardInfo) {
                        //存储每页的画板信息
                        that.allboardInfo.push(JSON.parse(boardInfo[i]['board_info_list']));
                        //存储每页的画板背景图
                        that.backgroundList.push({
                          board_number: boardInfo[i]['sys_board_number'],
                          board_background: boardInfo[i]['sys_board_background']
                        });
                      }
                      //设置当前画板id
                      that.nBgIndex = docInfo.sys_docs_curt_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
                      //设置画板总页
                      that.nBgTotal = boardInfo.length;
                      //当前页面的数据
                      that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
                      //根据当前数据绘画当前页面
                      that.pen.strokeBoard(that.currentBoardInfo);
                    }
                    // that.pen.clear();
                    //删除画板(当前)
                    // that.currentBoardInfo = [];
                    // that.$message('清屏成功！');
                  });

                  /**
                   *  socket
                   *  监听切换画板
                   **/
                  that.socket.on("switch_board", (res) => {
                    if (res.code === 0) {
                      Logger(res);
                      let boardInfo = res.board_info,
                        switchInfo = res.switch_info;

                      //重画
                      let bInfoList = JSON.parse(boardInfo[0]['board_info_list']);
                      that.currentBoardInfo = bInfoList;
                      that.pen.doneQueue = [];//先清除队列的画笔
                      that.pen.strokeBoard(bInfoList);

                      //设置当前页
                      that.nBgIndex = switchInfo.board_number;
                      // 滑动到具体当前画板的那一页
                      document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (switchInfo.board_number - 1)) * 100 + "%)";
                    }
                  });

                  /**
                   * 监听开启或者关闭白板
                   * */
                  that.socket.on("update_board_edit", (res) => {
                    Logger(res);
                    if (res.code === 0) {
                      let docInfo = res.doc_info,
                        edit = docInfo.sys_docs_is_edit;

                      if (that.ssuc) {
                        that.allowDraw = edit === 1 ? true : false;
                        if (that.allowDraw) {
                          that.$message.success(`当前画板可以编辑`);
                        } else {
                          that.$message.error(`当前画板不允许编辑`);
                        }
                        that.pen.switchEdit(that.allowDraw);
                      }
                    }
                  });

                  /**
                   *  socket      disconnect
                   *  重连
                   **/
                  that.socket.on('disconnect', () => {
                    Logger('disconnect');

                    that.socket = null;
                    that.socket = io(__WSURL);
                    that.boardLocalIdList = [];
                    that.currentBoardInfocurrentBoardInfo = [];
                    that.allboardInfo = [];
                  });
                });
              });
            });
          } else if (that.shareType == 2) {//屏幕共享
            // chrome extension is installed & enabled.
            if (anyRTCDetect.browser.name == 'Firefox') {
              navigator.mediaDevices.getUserMedia({
                video: { mediaSource: 'screen' },
                // video: {mediaSource:'window'}
                // video: {mediaSource:'application'}
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
                  //通知其他与会人员共享结果
                  // that.Meet.setUserShareInfo(null);
                  //共享屏幕的视频流
                  that.Meet.startScreenCap(stream);

                  that.resizeVideos();
                });
              }).catch(error => {
                Logger(error);
                if ((anyRTCDetect.browser.name == '360' && error.name === "NotReadableError") || (anyRTCDetect.browser.name == 'QQ' && error.name === "NotReadableError")) {
                  that.showScreenTip = true;
                } else if (error.name === "NotAllowedError") {
                  that.$message.error('当前域名未授权或您已取消共享');
                } else {
                  that.$message.error('打开屏幕共享插件失败！');
                }
                that.Meet.setUserShareEnable(0, false);
                that.shareResult = false;
                that.shareType = 0;
                throw error;
              });
            } else {
              getScreenConstraints((error, screen_constraints) => {
                if (error) {
                  that.Meet.setUserShareEnable(0, false);
                  return that.$message.warning("请安装'anyRTC-ScreenShare_publish'Chrome插件");
                }

                // navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                // navigator.getUserMedia({
                //   video: screen_constraints
                // }, function (stream) {
                //   }, function (error) {
                // });
                navigator.mediaDevices.getUserMedia({
                  video: screen_constraints
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
                    //通知其他与会人员共享结果
                    // that.Meet.setUserShareInfo(null);
                    //共享屏幕的视频流
                    that.Meet.startScreenCap(stream);
                    
                    that.resizeVideos();
                  });
                }).catch(error => {
                  Logger(error);
                  if ((anyRTCDetect.browser.name == '360' && error.name === "NotReadableError") || (anyRTCDetect.browser.name == 'QQ' && error.name === "NotReadableError")) {
                    that.showScreenTip = true;
                  } else if (error.name === "NotAllowedError") {
                    that.$message.error('当前域名未授权或您已取消共享');
                  } else {
                    that.$message.error('打开屏幕共享插件失败！');
                  }
                  that.Meet.setUserShareEnable(0, false);
                  that.shareResult = false;
                  that.shareType = 0;
                  throw error;
                });
              });
            }
          }
        }
        else {
          that.Meet.setUserShareEnable(0, false);
          if (that.shareType == 1) {
            that.fileId = "";
            that.fileMId = "";
          }
          that.shareType = 0;
          that.$message.warning("共享通道已被占用或释放!");
        }
      });
      /**
       *  监听SDK返回的错误
       *  @params strMethodName       发生错误的方法名
       *  @params res                 错误的返回的json对象
       **/
      that.Meet.on('onSDKError', (strMethodName, res) => {
        console.error(strMethodName, res.msg);
      });
    },
    //上传文档共享
    uploadDoc(e) {
      let that = this;

      let uploadBtn = document.createElement('input');
      uploadBtn.type="file";
      let uploadEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      uploadBtn.dispatchEvent(uploadEvent);
      uploadBtn.onchange = function (e) {
        let file = e.target.files[0];
        let mimetype = file.type;

        that.uploading = true;
        // (mimetype === 'image/jpeg' || mimetype === 'image/png' || mimetype === 'image/jpg')
        if (mimetype === 'application/pdf'
          || (mimetype === 'application/msword' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          || (mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || mimetype === 'application/vnd.ms-excel')
          || (mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || mimetype === 'application/vnd.ms-powerpoint')
          || (mimetype === 'image/jpeg' || mimetype === 'image/png' || mimetype === 'image/jpg')) {

        } else {
          that.$message.error("暂不支持该文档格式！");
          that.uploading = false;
          // e.target.value = "";
          return
        }

        if ((file.size / 1024 / 1024) >= 30) {
          that.$message.error("上传文档超过30M");
          that.uploading = false;
          // e.target.value = "";
          return
        }

        let formData = new FormData();
        formData.append('meetingid', that.mId);
        formData.append('document', file);

        that.$message.info('上传文档可能要花费几分钟时间，请耐心等待！');
        AX.post('uploads/upload_docs', formData, {
          timeout: 300 * 1000
        }).then((res) => {
          let data = res.data;

          // e.target.value = "";
          switch (data.code) {
            case 200:
              let docInfo = data.meeting_doc.file_info;

              that.$message.success('上传成功！');
              that.docsList.push({
                fileId: docInfo.fileid,
                fileMeetingId: docInfo.file_meetingid,
                fileName: docInfo.file_name,
                fileType: docInfo.file_type,
                fileState: docInfo.file_state       //文档的状态（-1/0/1/2/3:删除/默认/转码中/转码成功/转码失败）
              });
              break;
            case 100007:
              //session 不一致
              break;
            case 100017:
              that.$message.error('文档数量已达上限！（最多10个）');
              break;
          }
          that.uploading = false;
        }).catch(err => {
          // e.target.value = "";
        });
      }
    },
    //删除文档
    deleteDoc(fid) {
      let that = this;
      
      that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        AX.post('meetings/delete_user_file', {
          fileid: fid
        }).then(res => {
          for (var i in that.docsList) {
            if (that.docsList[i].fileId === fid) {
              //删除
              that.docsList.splice(i, 1);
            }
          }
        }).catch(err => { });
      }).catch(err => {
        Logger('delete_user_file', err);
      });
    },
    //获取自己的文档列表
    getDocsList() {
      let that = this;
      
      that.loadingDoc = true;
      AX.post('meetings/get_user_file_list').then((res) => {
        let data = res.data;

        that.loadingDoc = false;
        if (data.code === 200) {
          let fileList = data.file_list;

          that.docsList = [];
          fileList.map((item, index) => {
            that.docsList.push({
              fileId: item.fileid,
              fileMeetingId: item.file_meetingid,
              fileName: item.file_name,
              fileType: item.file_type,
              fileState: item.file_state       //文档的状态（-1/0/1/2/3:删除/默认/转码中/转码成功/转码失败）
            })
          });
        }
      }).catch(err => { });
    },
    //文档共享
    shareDocs (fid, fmid) {
      let that = this;

      if (that.shareType != 0) {
        that.$message.error(that.shareType == 1 ? '当前共享通道被占用：文档共享中' : that.shareType == 2 && '当前共享通道被占用：屏幕共享中');
      } else {
        that.$confirm('确实是否要共享该文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.siderShow = false;
          that.currentSiderName = "";

          let fState;
          for (let i in that.docsList) {
            if (fid === that.docsList[i].fileId) {
              fState = that.docsList[i].fileState;
            }
          }

          switch (fState) {
            case 0:
              break;
            case 1:
              that.$message("文档正在转码中,请稍后再试！");
              that.getDocsList();
              break;
            case 2:
              //设置文档共享
              that.shareType = 1;
              //共享文档共享
              that.Meet.setUserShareEnable(that.shareType, true);
              //设置当前需要共享的文件id
              that.fileId = fid;
              that.fileMId = fmid;
              break;
            case 3:
              that.$message.error("文档正在转码失败");
              break;
            default://-1
              that.$message.error("错误::文件状态" + fState);
              break;
          }
        }).catch(() => {

        });
      }
    },
    //获取文档信息
    getFileInfo(fid, fmid, cb) {
      let that = this;

      AX.post('meetings/get_meeting_doc_info', {
        meetingid: fmid,
        fileid: fid
      }).then(res => {
        let data = res.data;

        if (data.code === 200) {
          let imageInfo = data.meeting_doc.image_list;

          that.backgroundList = [];
          for (let i in imageInfo) {
            that.backgroundList.push({
              board_number: imageInfo[i].convert_page_num,
              board_background: imageInfo[i].convert_page_cloud_url
            });
          }
          cb(data);
        }
      }).catch(err => {
        Logger(err);
      })
    },
    //关闭文档共享
    closeDocShare() {
      let that = this;

      if (that.mSharer) {
        that.$confirm('确实是否关闭文档共享?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //共享文档共享
          that.Meet.setUserShareEnable(that.shareType, false);
        }).catch(() => { });
      } else {
        that.$message.error("只有文档分享者才可以关闭文档共享！");
      }
    },
    //------------------------------画板
    //设置画板是否可涂鸦
    switchBoardDraw() {
      let that = this;

      if (that.mSharer) {//分享者可以设置是否可以标注
        that.allowDraw = !that.allowDraw;
        that.socket.emit("update_board_edit", {
          board_seqid: that.fileId,
          board_anyrtcid: that.mId,
          board_is_edit: that.allowDraw ? 1 : 0
        });
      }
    },
    //画板移动
    scrollBoardLeft() {
      let that = this;

      that.nBgIndex--;
      if (that.mSharer) {  //如果是分享者
        /**
         * 切换画板
         * */
        that.socket.emit("switch_board", {
          board_seqid: that.fileId,
          board_anyrtcid: that.mId,
          board_number: that.nBgIndex
        });
      } else {
        that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
        that.pen.strokeBoard(that.currentBoardInfo);
        // 滑动到具体当前画板的那一页
        document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
      }
    },
    //画板移动
    scrollBoardRight() {
      let that = this;

      that.nBgIndex++;
      if (that.mSharer) {  //如果是分享者
        /**
         * 切换画板
         * */
        that.socket.emit("switch_board", {
          board_seqid: that.fileId,
          board_anyrtcid: that.mId,
          board_number: that.nBgIndex
        });
      } else {
        that.currentBoardInfo = that.allboardInfo[that.nBgIndex - 1];
        that.pen.strokeBoard(that.currentBoardInfo);
        // 滑动到具体当前画板的那一页
        document.getElementById("canvas_background").style.transform = "translateX(" + (-1 * (that.nBgIndex - 1)) * 100 + "%)";
      }
    },
    //
    setPenType(nType) {
      let that = this;

      // if (that.mSharer || (!that.mSharer && that.allowDraw)) {
        that.penType = nType;
        that.pen.setDrawType(nType);
      // }
    },
    //设置画笔的大小
    setPenWidth(nWidth) {
      let that = this;

      // if (that.mSharer || (!that.mSharer && that.allowDraw)) {
        that.pen.setLineWidth(nWidth);
      // }
    },
    //设置画笔的颜色
    setPenColor(strColor) {
      let that = this;

      // if (that.mSharer || (!that.mSharer && that.allowDraw)) {
        that.pen.setColor(strColor);
      // }
    },
    //撤销
    revokePen() {
      let that = this;

      // if (that.mSharer || (!that.mSharer && that.allowDraw)) {
        if (that.boardLocalIdList.length === 0 || !that.boardLocalIdList[that.nBgIndex]) {
          that.$message('当前画板未有你的画笔，先画一笔再来试试吧！');
        } else {
          //通知其他人员当前
          that.socket.emit('revoke_board', JSON.stringify({
            board_localid: that.boardLocalIdList[that.nBgIndex].pop()
          }));
        }
      // }
    },
    //清屏
    clearBoard() {
      let that = this;

      // if (that.mSharer || (!that.mSharer && that.allowDraw)) {
        that.$confirm('您要清除画板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.socket.emit('clear_board', JSON.stringify({
            board_seqid: that.fileId,
            board_anyrtcid: that.mId,
            board_number: that.nBgIndex
          }));
          that.allboardInfo[that.nBgIndex] = [];
          that.currentBoardInfo = [];
          that.boardLocalIdList = [];
          that.boardLocalIdList.length = 0;
        }).catch(() => { });
      // }
    },
  }
}


// WEBPACK FOOTER //
// ./src/components/pages/Meeting/mixins/meet.js