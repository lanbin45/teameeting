<template>
  <div id="app" class="app meeting_app flex flex-column flex-space-between" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- header -->
    <MeetHeader
      :isOwner.sync="mOwner"
      :type.sync="mType"
      :login.sync="ssuc"
      :applyStep.sync="applyState"
      :mIsStart.sync="mIsStart"
      :cameraEnabled.sync="cameraEnabled"
      :micEnabled.sync="micEnabled"
      :roomLock.sync="mLock"
      @onApplyLine="handleApplyLine"
      @onModuleChange="handleMoudleChange"
      @onSwitchCamera="handleCameraSwitch"
      @onSwitchAudio="handleMicSwitch"
      @onSwitchRoom="handleRoomLock"
      @onLeaveRoom="leaveRoom">
    </MeetHeader>
    <!--  -->
    <!-- content -->
    <div class="flex_auto_item flex">
      <!-- 左侧面板 -->
      <MeetSider 
        ref="mSider"
        v-model="siderBars"
        :siderShow="siderShow"
        :currentSiderName="currentSiderName"
        :hasNewMsg.sync="hasNewMsg"
        :hasNewApply.sync="hasNewApply"
        @onShareScreen="handleShareScreen"
        @onSiderChange="handleSiderChange">
        <!-- 人员列表 -->
        <div class="flex flex-column sider_content" slot="member">
          <!--  -->
          <div class="sider_content_title">
            <div class="sider_content_title_left">
              当前房间内： {{ roomMember }} 人
            </div>
          </div>
          <!--  -->
           <div class="sider_content_body">
              <div class="sider_content_body_box flex flex-column">
                <!-- 视频会议参会人员列表 -->
                <template v-if="mType==0||mType==1">
                  <p class="list_label">创建者</p>
                  <div class="list_box">
                    <div class="list_item" v-for="(item, index) in memberList" v-if="item.userId == mOwnerUserId" :key="index">
                      <div class="list_item_box">
                        <!--  -->
                        <div class="list_item_title">
                          <div class="list_item_icon_box">
                            <span class="list_item_icon">
                              <img :src="item.userIcon" alt="">
                              <span class="list_item_icon_subsript">
                                <i class="icon iconfont"></i>
                              </span>
                            </span>
                          </div>
                          <span class="list_item_name_box">{{ item.userName }}</span>
                        </div>
                        <!--  -->
                        <div class="list_item_controls">
                          <span class="list_controls_item" v-if="mOwner" @click="switchMic(item, index)">
                            <i :class="['icon', 'iconfont', item.microphone ? 'icon-mic_open' :'icon-mic_close']"></i>
                          </span>
                          <span class="list_controls_item" v-if="mOwner" @click="switchCamera(item, index)">
                            <i :class="['icon', 'iconfont', item.camera ? 'icon-camera_open' : 'icon-camera_close']"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="list_label">参会人员</p>
                  <div class="list_box">
                    <div class="list_item" v-for="(item, index) in mConnectList" v-if="item.userId != mOwnerUserId" :key="index">
                      <div class="list_item_box">
                        <!--  -->
                        <div class="list_item_title">
                          <div class="list_item_icon_box">
                            <span class="list_item_icon">
                              <img :src="item.userIcon" alt="">
                              <span class="list_item_icon_subsript">
                                <i class="icon iconfont" :class="item.userType == 0 ? 'icon-Android' : item.userType == 1 ? 'icon-iOS' : item.userType == 2 ? 'icon-win' : item.userType == 3 ? 'icon-chrome' : item.userType == 4 ? 'icon-tv' : (item.userType == 5 && 'icon-H5')"></i>
                              </span>
                            </span>
                          </div>
                          <span class="list_item_name_box">{{ item.userName }}</span>
                        </div>
                        <!--  -->
                        <div class="list_item_controls">
                          <span class="list_controls_item" v-if="mOwner" @click="switchMic(item, index)">
                            <i :class="['icon', 'iconfont', item.microphone ? 'icon-mic_open' :'icon-mic_close']"></i>
                          </span>
                          <span class="list_controls_item" v-if="mOwner" @click="switchCamera(item, index)">
                            <i :class="['icon', 'iconfont', item.camera ? 'icon-camera_open' : 'icon-camera_close']"></i>
                          </span>
                          <span v-if="mOwner" class="list_controls_item" @click="clearUser(item, index)">
                            <i class="icon iconfont icon-leave"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="mConnectList.length <= 1">
                      <!-- 无人 -->
                    </div>
                  </div>
                </template>

                <!-- 互动直播参会人员列表 -->
                <template v-if="mType==2">
                  <p class="list_label">创建者</p>
                  <div class="list_box">
                    <div class="list_item">
                      <div class="list_item_box">
                        <!--  -->
                        <div class="list_item_title">
                          <div class="list_item_icon_box">
                            <span class="list_item_icon">
                              <img :src="mOwnerUserIcon" alt="">
                              <span class="list_item_icon_subsript">
                                <i class="icon iconfont"></i>
                              </span>
                            </span>
                          </div>
                          <span class="list_item_name_box">{{ mOwnerUserName }}</span>
                        </div>
                        <!--  -->
                        <div class="list_item_controls">
                          <span class="list_controls_item" v-if="mOwner" @click="handleMicSwitch(!micEnabled)">
                            <i :class="['icon', 'iconfont', micEnabled ? 'icon-mic_open' :'icon-mic_close']"></i>
                          </span>
                          <span class="list_controls_item" v-if="mOwner" @click="handleCameraSwitch(!cameraEnabled)">
                            <i :class="['icon', 'iconfont', cameraEnabled ? 'icon-camera_open' : 'icon-camera_close']"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="list_label">连麦列表</p>
                  <div class="list_box">
                    <div class="list_item" v-for="(item, index) in mConnectList" v-if="item.userId != mOwnerUserId" :key="index">
                      <div class="list_item_box">
                        <!--  -->
                        <div class="list_item_title">
                          <div class="list_item_icon_box">
                            <span class="list_item_icon">
                              <img :src="item.userIcon" alt="">
                              <span class="list_item_icon_subsript">
                                <i class="icon iconfont" :class="item.userType == 0 ? 'icon-Android' : item.userType == 1 ? 'icon-iOS' : item.userType == 2 ? 'icon-win' : item.userType == 3 ? 'icon-chrome' : item.userType == 4 ? 'icon-tv' : (item.userType == 5 && 'icon-H5')"></i>
                              </span>
                            </span>
                          </div>
                          <span class="list_item_name_box">{{ item.userName }}</span>
                        </div>
                        <!--  -->
                        <div class="list_item_controls">
                          <span class="list_controls_item" v-if="mOwner" @click="hangupUserLine(item.userId, item.userName, item.pubId)">
                            <i class="icon iconfont icon-hangup"></i>
                          </span>
                          <span class="list_controls_item" v-if="mOwner" @click="clearUser(item, index)">
                            <i class="icon iconfont icon-leave"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="mConnectList.length <= 1">
                      <!-- 无人 -->
                    </div>
                  </div>
                  <p class="list_label">参会人员</p>
                  <div class="list_box">
                    <div class="list_item" v-for="(item, index) in memberList" v-if="item.userId != mOwnerUserId" :key="index">
                      <div class="list_item_box">
                        <!--  -->
                        <div class="list_item_title">
                          <div class="list_item_icon_box">
                            <span class="list_item_icon">
                              <img :src="item.userIcon" alt="">
                              <span class="list_item_icon_subsript">
                                <i class="icon iconfont" :class="item.userType == 0 ? 'icon-Android' : item.userType == 1 ? 'icon-iOS' : item.userType == 2 ? 'icon-win' : item.userType == 3 ? 'icon-chrome': item.userType == 4 ? 'icon-tv' : (item.userType == 5 && 'icon-H5')"></i>
                              </span>
                            </span>
                          </div>
                          <span class="list_item_name_box">{{ item.userName }}</span>
                        </div>
                        <!--  -->
                        <div class="list_item_controls">
                          <span class="list_controls_item" v-if="mOwner && item.invited == 0 && item.userType !=5" @click="inviteUser(item, index)">
                            <i class="icon iconfont icon-invite"></i>
                          </span>
                          <span class="list_controls_item" v-if="mOwner" @click="clearUser(item, index)">
                            <i class="icon iconfont icon-leave"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="memberList.length <= 1">
                      <!-- 无人 -->
                    </div>
                  </div>
                </template>
              </div>
           </div>
        </div>
        <!-- 聊天消息 -->
        <div class="flex flex-column sider_content" slot="message">
          <!--  -->
          <div class="sider_content_title">
            <div class="sider_content_title_left">
              当前房间内： {{ memberList.length }} 人
            </div>
          </div>
          <!--  -->
          <div class="sider_content_body" v-loading="loadingDoc">
            <div class="sider_content_body_box flex flex-column">
              <div class="chat_list_box">
                <!--  -->
                <div class="chat_list_wrap" ref="refChatListWrap">
                  <ul class="chat_list" ref="refChatList">
                    <li v-for="(item, index) in chatList" :key="index">
                      <div class="msg_box" :class="item.m_uid == jUserData['userId'] && 'self'">
                        <div class="msg_hd">
                          <img class="msg_hd_icon" :src="item.m_uhd" alt="">
                          <p class="msg_hd_name">{{ item.m_uname }}</p>
                        </div>
                        <div class="msg_bd">
                          <div class="msg_cnt">{{ item.m_cnt }}</div>
                          <div class="msg_time">{{ dFormt(item.m_time, "yyyy-mm-dd H:MM:ss") }}</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!--  -->
                <div class="chat_input_area">
                  <div class="chat_input_box">
                    <input type="text" class="chat_input" v-model="chatText" @keyup.enter="sendMsg()" placeholder="请输入...">
                    <el-button class="chat_btn" type="primary" :disabled="chatText.length === 0" @click="sendMsg()">{{ $t('meeting.sendMessage') }}</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 文档 -->
        <div class="flex flex-column sider_content" slot="doc">
          <!--  -->
          <div class="sider_content_title">
            <div class="sider_content_title_left">
              当前文件: {{ docsList.length }}/10
            </div>
            <div class="sider_content_title_right">
              <!-- <a href="javascript:;" @click="getDocsList"><i class="icon iconfont icon-refresh"></i></a> -->
              <a href="javascript:;" @click="getDocsList">刷新</a>
              <a href="javascript:;" @click="uploadDoc">上传文档 <input type="file" id="upload" style="display: none"></a>
            </div>
          </div>
          <!--  -->
          <div class="sider_content_body" v-loading="loadingDoc">
            <div class="sider_content_body_box flex flex-column">
              <div class="list_box">
                <div class="list_item" v-for="(item, index) in docsList" :key="index">
                  <div class="list_item_box">
                    <!--  -->
                    <div class="list_item_title doc_title" @click="shareDocs(item.fileId, item.fileMeetingId)">
                      <div class="list_item_icon_box">
                        <span class="list_item_icon"><img src="http://oss.teameeting.cn/teameeting/header.png" alt=""></span>
                        <span class="list_item_icon_subsript"></span>
                      </div>
                      <span class="list_item_name_box">{{ item.fileName }}</span>
                    </div>
                    <!--  -->
                    <div class="list_item_controls">
                      <span class="list_controls_item" @click="deleteDoc(item.fileId)">
                        <i class="icon iconfont icon-delete_doc"></i>
                      </span>
                    </div>
                  </div>
                </div>               
              </div>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="flex flex-column sider_content" slot="linelist">
          <!--  -->
          <div class="sider_content_title">
            <div class="sider_content_title_left">
              申请连麦列表: {{ applyList.length }} 人
            </div>
          </div>
          <!--  -->
          <div class="sider_content_body">
            <div class="sider_content_body_box flex flex-column">
              <div class="list_box">
                <div class="list_item" v-for="(item, index) in applyList" :key="index">
                  <div class="list_item_box">
                    <!--  -->
                    <div class="list_item_title">
                      <div class="list_item_icon_box">
                        <span class="list_item_icon">
                          <img :src="item.userIcon" alt="">
                          <span class="list_item_icon_subsript">
                            <i class="icon iconfont"></i>
                          </span>
                        </span>
                      </div>
                      <span class="list_item_name_box">{{ item.userName }}</span>
                    </div>
                    <!--  -->
                    <div class="list_item_controls">
                      <span class="list_controls_item" @click="acceptLine(index)">
                        <i class="icon iconfont icon-accept"></i>
                      </span>
                      <span class="list_controls_item" @click="refuseLine(index)">
                        <i class="icon iconfont icon-refuse"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="flex flex-column sider_content" slot="setting">
          <!--  -->
          <div class="sider_content_title">
            <div class="sider_content_title_left">
              设置中心 
            </div>
          </div>
          <!--  -->
          <div class="sider_content_body">
            <div class="sider_content_body_box flex flex-column device_box">
              <div class="flex flex-column">
                <p class="device_box_title">音视频设置</p>
                <div class="flex flex-column">
                  <el-select class="device_selection" v-model="cameraValue" placeholder="请选择摄像头">
                    <el-option v-for="item in cameraList" :key="item.deviceId" :label="item.label" :value="item.deviceId">
                    </el-option>
                  </el-select>
                </div>

                <div class="flex flex-column">
                  <el-select class="device_selection" v-model="micValue" placeholder="请选择麦克风">
                    <el-option v-for="item in micList" :key="item.deviceId" :label="item.label" :value="item.deviceId">
                    </el-option>
                  </el-select>
                </div>
                
                <el-button :style="{'margin-top': '10px'}" type="primary" @click="changeDevice">确认修改</el-button>
              </div>
              
              <div :style="{'margin-top': '20px'}" v-if="uType!=2">
                <p class="device_box_title">会议视频清晰度设置</p>

                <div class="device_quality">
                  <div :class="['device_quality_item', {'active': currentQuality == 0 }]">
                    <i class="iconfont icon-accept" v-if="currentQuality == 0"></i> 320P
                  </div>
                  <div :class="['device_quality_item', {'active': currentQuality == 1 }]">
                    <i class="iconfont icon-accept" v-if="currentQuality == 1"></i> 480P
                  </div>
                  <div :class="['device_quality_item', {'active': currentQuality == 2 }]">
                    <i class="iconfont icon-accept" v-if="currentQuality == 2"></i> 720P
                  </div>
                  <div :class="['device_quality_item', {'active': currentQuality == 3 }]">
                    <i class="iconfont icon-accept" v-if="currentQuality == 3"></i> 1080P
                  </div>
                  <p class="device_quality_tip">您当前不是vip，无法更改会议清晰度，请<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=2033817166&amp;site=qq&amp;menu=yes">联系客服</a>获取VIP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MeetSider>
      
      <!-- 视频&屏幕共享显示区域 -->
      <div class="meet_content flex_auto_item">
        <div class="main flex " ref="mainView"><!-- flex-middle -->
          <!--  -->
          <div class="main_layout flex flex-center flex-middle">
            <!-- 屏幕共享&文档共享 -->
            <div v-if="shareType!=0" ref="shareView" class="share_view">
              <!-- 屏幕共享 -->
              <div v-if="shareType == 2 && shareResult" class="share_box" id="shareScreenView">
                <div class="share_username">{{ sharerName }}</div>
                <div :class="['share_fullscreen', { 'isFirefox': isFirefox }]" @click="ShareScreenFull"><i class="icon iconfont icon-full_screen_in"></i></div>
                <div class="close_share_btn" v-if="isFirefox" type="button" @click="closeShareScreen">关闭</div>
              </div>
              <!-- 白板 -->
              <div class="table" v-if="shareType == 1">
                <div class="table_cell">
                  <div class="canvas_box" :style="{'position':'relative', 'width':'960px', 'height':'720px'}">
                    <!--  -->
                    <div class="canvas_background" id="canvas_background">
                      <div class="background_item" v-for="(item, index) in backgroundList" :key="index" :style="'background-image: url(' + item.board_background + ')'"></div>
                    </div>

                    <canvas :style="{'width':'100%', 'height':'100%'}" id="myCanvas"></canvas>
                  </div>
                </div>
                <!--  -->
                <div class="share_username"><i class="icon iconfont icon-share-doc"></i> {{ ' ' +sharerName }}</div>
                <div class="allow_draw" v-if="mSharer">
                  <div>
                    <div class="allow_draw_label">是否结束共享:</div>
                    <div class="allow_control" :style="{'color': 'red'}" @click="closeDocShare">
                      <i class="icon iconfont icon-refuse"></i>
                    </div>
                  </div>
                  <div :style="{'margin-top': '10px'}">
                    <div class="allow_draw_label">是否允许其他人标注：
                      <span :style="{'color': allowDraw ? 'green' : 'red'}">{{ allowDraw ? "允许" : "不允许" }}</span>
                    </div>
                    <div class="allow_control" :style="{'color': allowDraw ? 'green' : 'red'}" @click="switchBoardDraw">
                      <i :class="['icon', 'iconfont', allowDraw ? 'icon-accept' :'icon-refuse']"></i>
                    </div>
                  </div>
                </div>
                <!-- 工具栏 -->
                <div class="tools">
                  <div class="tools_item pen_tools" v-if="mSharer || (!mSharer && allowDraw)">
                    <div class="tool" :style="{'z-index': '10', 'background-color':'#333','position':'relative'}" @click="openPenOps = !openPenOps">
                      <i class="icon iconfont icon-tools_box"></i>
                    </div>
                    <div :class="['tool_bar',{'close':!openPenOps}]">
                      <div class="tool clear" @click="clearBoard()">
                        <i class="icon iconfont icon-clear"></i>
                      </div>
                      <div class="tool cancel" @click="revokePen()">
                        <i class="icon iconfont icon-cancel"></i>
                      </div>
                      <div class="tool pen_width">
                        <i class="icon iconfont icon-pen_width"></i>
                        <div class="pen_width_selection selection_box" v-if="openPenOps">
                          <div class="tool" @click="setPenWidth(1)">
                            <i class="icon iconfont icon-huabicuxi_"></i>
                          </div>
                          <div class="tool" @click="setPenWidth(5)">
                            <i class="icon iconfont icon-huabicuxi_2"></i>
                          </div>
                          <div class="tool" @click="setPenWidth(10)">
                            <i class="icon iconfont icon-pen_width"></i>
                          </div>
                        </div>
                      </div>
                      <div class="tool color">
                        <i class="icon iconfont icon-color"></i>
                        <div class="color_selection selection_box" v-if="openPenOps">
                          <div class="tool" :style="{'color': '#ff5050'}" @click="setPenColor('#ff5050')">
                            <i class="icon iconfont icon-color"></i>
                          </div>
                          <div class="tool" :style="{'color': '#ffd133'}" @click="setPenColor('#ffd133')">
                            <i class="icon iconfont icon-color"></i>
                          </div>
                          <div class="tool" :style="{'color': '#4e91ff'}" @click="setPenColor('#4e91ff')">
                            <i class="icon iconfont icon-color"></i>
                          </div>
                          <div class="tool" :style="{'color': '#31ff7a'}" @click="setPenColor('#31ff7a')">
                            <i class="icon iconfont icon-color"></i>
                          </div>
                          <div class="tool" :style="{'color': '#000000'}" @click="setPenColor('#000000')">
                            <i class="icon iconfont icon-color"></i>
                          </div>
                          <div class="tool" :style="{'color': '#ffffff'}" @click="setPenColor('#ffffff')">
                            <i class="icon iconfont icon-color"></i>
                          </div>
                        </div>
                      </div>
                      <div class="tool arrow" @click="setPenType(1)">
                        <i class="icon iconfont icon-arrow"></i>
                      </div>
                      <div class="tool line" @click="setPenType(2)">
                        <i class="icon iconfont icon-line"></i>
                      </div>
                      <div class="tool rect" @click="setPenType(3)">
                        <i class="icon iconfont icon-rect"></i>
                      </div>
                      <div class="tool pen" @click="setPenType(0)">
                        <i class="icon iconfont icon-pen"></i>
                      </div>
                    </div>
                  </div>
                  <div class="tools_item" v-if="nBgIndex > 1" @click="scrollBoardLeft">
                    <i class="icon iconfont icon-left"></i>
                  </div>
                  <div class="tools_item" v-if="nBgIndex < nBgTotal" @click="scrollBoardRight">
                    <i class="icon iconfont icon-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <!-- 互动直播游客端 -->
            <!-- <div v-if="mType === 2 && !mOwner && applyState !== 2" id="hostVideo" style="width: 100%; height: 100%;"></div> -->
            <!-- 视频区域 等分屏 v-if="!(mType == 2 && (applyState == 0 || applyState == 1))" -->
            <div :class="['rtc_videos', 'flex', {'flex-middle': mModule== 1}, {'flex-column': mModule==2}, {'flex-wrap-reverse col-content-center row-center': mModule==1 && (mConnectList.length == 3 || mConnectList.length == 5)}, {'flex-wrap': !shareResult}, {'flex-column flex-nowrap yscroll': shareType!=0 && shareResult}]" ref="videos"><!-- 'flex-center', 'flex-middle', -->
              <!-- 互动直播游客端 -->
              <div v-if="mType === 2 && !mOwner && applyState !== 2" id="hostVideo" style="width: 100%; height: 100%;"></div>
              <iVideo v-for="(item, index) in mConnectList" 
                :type="mType"
                :index="index"
                :item.sync="item"
                :key="index"
                @onVideoDrag="handleVideoDrag">
                <!-- <span v-if="!item.isSelf" slot="netBytes"> {{ item.netBytes }}</span> -->
                <span v-if="!item.isSelf" slot="pkgLost"> {{ item.pkgLost + '%' }}</span>
                <div v-if="!item.isSelf && item.audioLevel != 0" slot="audioLevel" class="video_audio_detct"><img src="/static/images/meeting/audio.gif" alt=""></div>
                <span v-if="!item.isSelf" slot="videoBytes"> {{ item.videoBytes + 'Kbps'}}</span>
              </iVideo>
            </div>
          </div>
        </div>
      </div>
    </div>
    <fixedTip v-model="showScreenTip" :in-china="inChina"></fixedTip>
    <!-- 验证资格失败 -->
    <div class="verify_failed" v-if="noSupport">
      <div class="verify_failed_wrap">
        <div class="verify_failed_box">
          <div class="verify_failed_content">
            <div class="verify_failed_content_box">
              <h2 class="verify_failed_content_hd">{{ $t('meeting.browserCheckTitle') }}</h2>
              <div class="verify_failed_content_bd">
                <p>{{ $t('meeting.browserCheckSubTitle') }}</p>
                <p>{{ $t('meeting.browserCheckSubTitle1') }}</p>
                <div>
                  <div class="browser_item">
                    <div class="browser_icon chrome"></div>
                    <p></p>
                  </div>
                  <div class="browser_item">
                    <div class="browser_icon firefox"></div>
                    <p></p>
                  </div>
                  <div class="browser_item">
                    <div class="browser_icon opera"></div>
                    <p></p>
                  </div>
                  <div class="browser_item">
                    <div class="browser_icon safri"></div>
                    <p></p>
                  </div>
                </div>
                <div style="margin-top: 10px; text-align: right;">
                  <el-button type="primary" @click="back()">{{ $t('el.datepicker.confirm') }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 培训助手检测 -->
    <lineMeetDetect v-model="detectRTMixer" :downUrl="RTMixerDownUrl" @onUnSupport="leaveVerify = false && back" @onStartRTMixer="checkRTMixer"></lineMeetDetect>
    <!-- 游客收到主播连麦邀请 -->
    <div v-if="mType == 2 && inviteModel" class="invite_wrap">
      <div class="m-table">
        <div class="m-table-cell">
          <div class="invite_box">
            <div class="invite_title">连麦邀请</div>
            <div class="invite_body">
              <h2 class="invite_body_text">{{ inviteSeconds }} s</h2>
              <p class="invite_body_desc">主持人邀请您参与会议连麦</p>
            </div>
            <div class="invite_footer">
              <el-button type="primary" @click="agreeLine">同意连麦</el-button>
              <el-button @click="rejectLine">拒绝连麦</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
    import DetectRTC from 'detectrtc';
    import { mapGetters } from 'vuex';

    import meetMix from './mixins/meet';
    import hostMeetMix from './mixins/hostMeet';
    import guestMeetMix from './mixins/guestMeet';

    import * as utils from '@/assets/utils/utils';
    import anyRTCDetect from '@/assets/RTCDetect/anyRTCDetect';
    
    import iVideo from '@/components/common/meeting/video.vue';
    import fixedTip from '@/components/common/meeting/shareScreenTip.vue';
    import lineMeetDetect from '@/components/common/meeting/meetingDetect.vue';
    // import SoundMeter from '@/assets/soundVolume/soundmeter';
  
    export default {
      data () {
        return {
          fullscreenLoading: false,
          showScreenTip: false,
          inChina: true,

          // navInnerLoading: false,
          noSupport: false,                 //当前浏览器不支持webrtc
          
          //页面属性状态
          siderBars: ['member', 'message'],
          leaveVerify: true,                //离开当前页面是否需要提示
          siderShow: false,                 //侧边栏是否显示
          currentSiderName: '',             //侧边栏当前显示的名称

          //
          cameraValue: "",
          micValue: "",
          cameraList: [],
          micList: [],

          //常量
          defaultUhd: USER_HD_URL,
          defaultFileIcon: DOC_ICON_URL,
  
          //会议基本信息
          mId: this.$route.params.id,         //房间id
          mTitle: '',                         //会议标题
          mType: null,                        //会议的类型 0快速会议 1视频会议 2连麦会议
          mPwd: '',                           //密码会议
          mModule: 1,                         //视频模板 1-等分屏  2-一大几小
          shareType: 0,                       //0无共享  1文档共享 2屏幕共享 3媒体共享-保留
          mIsStart: false,                    //会议是否开启
          mLock: 0,                           //会议是否上锁 0 未上锁 1上锁
          mOwnerUserId: '',                   //会议所有者的userid
          mOwnerUserName: '',                 //会议所有者的userName
          mOwnerUserIcon: '',                 //会议所有者的userIcon
          mMaxMember: 0,                      //最大参会人员,视频会议6人
          mQuality: 0,                        //会议的视频质量0（流畅）:320240/128 1（标清）:352288/256 2（高清）:640480/512 3（超高清）:web中使用分辨率(1280720/1024),app中使用分辨率(960540/768) 4（超级会议仅在pc中web和终端中使用）:19201080分辨率（H264编解码：码率2048，VP9编解码：码率1024（VP9编解码仅在chrome,firefox中使用）
          mLineQuality: 0,                    //连麦会议的视频质量0（流畅）:640480/384 1（标清）:640480/512 2（高清）:640480/768 3（超高清）:1280720/1024）
          currentQuality: 0,                  //当前会议的分辨率
          
          uType: 0,                           //0普通用户 1vip用户
          pushUrl: "",
          pullUrl: "",
          hlsUrl: "",

          //会议状态信息
          mOwner: false,                      //是否是会议房主
          mSharer: false,                     //是否是分享者
          shareResult: false,                 //是否共享成功
          sharerName: "",                     //分享者昵称
          mConnectList: [],                   //视频会议参会人员列表、互动直播连麦列表
          peerAVState: {},                    //chanId对应的Audio和Video state 会议开始时收到个人员音视频状态的回调
          memberList: [],                     //人员列表
          strRatio: "16:9",

          //用户信息
          cameraEnabled: true,
          micEnabled: true,
          jUserData: {},                      //用户信息
          userNickName: '',                   //参会者自己的昵称
          // audioVolume: 0,                   //当前麦克风音量-保留

          //连麦会议--------------------     
          detectRTMixer: 0,
          RTMixerDownUrl: '',
          
          inviteModel: false,         //主播邀请连麦模态框是否显示
          inviteSeconds: 29,          //倒计时周期
          inviteTimer: null,          //邀请倒计时
        
          mHttp: null,

          //连麦人员列表
          lineTotalMember: [],
          linePageIndex: 0,
          RoomSvrID: "RoomSvrID",
          RoomID: "",
  
          //聊天消息--------------------
          chatText: "",
          chatList: [],               //消息列表
          hasNewMsg: false,           //是否有新的消息
          hasNewApply: false,          //是否有连麦申请

          //设备标识--------------------
          hasWebcam: false,
          hasMicrophone: false,
          hasSpeakers: false,
          isWebRTCSupported: false,
        };
      },
      
      mixins: [meetMix, hostMeetMix, guestMeetMix],

      computed: {
        ...mapGetters({
          userInfo: 'getUserInfo',
          ssuc: 'getSsuc',
          forceRefresh: 'getForceRefresh'
        }),
        isFirefox () {
          return anyRTCDetect.browser.name === "Firefox";
        },
        roomMember() {
          let that = this;

          if (that.mType == 0 || that.mType == 1) {
            return that.memberList.length;
          } else if (that.mType == 2) {
            return that.memberList.length + that.mConnectList.length;
          }
        }
      },

      //路由拦截
      beforeRouteLeave (to, from, next) {
        let that = this;
        if (!that.leaveVerify) {
          next();
        } else {
          if (!that.forceRefresh) {//默认非强制离开
            that.$confirm('确认离开该页面吗？').then(() => {
              next();
            }).catch(() => { });
          } else {
            next();
            that.$store.dispatch('setForceRefrech', false);
          }
        }
      },
      
      watch: {
        micEnabled (value) {
          let that = this;

          if (that.mType == 0 || that.mType == 1) {
            that.Meet.setLocalAudioEnable(value);
          } else if (that.mType == 2) {
            if (that.mOwner) {
              that.mHoster.setLocalAudioEnable(value);
            } else {
              that.mGuest.setLocalAudioEnable(value);
            }
          }
        },
        cameraEnabled (value) {
          let that = this;

          if (that.mType == 0 || that.mType == 1) {
            that.Meet.setLocalVideoEnable(value);
          } else if (that.mType == 2) {
            if (that.mOwner) {
              that.mHoster.setLocalVideoEnable(value);
            } else {
              that.mGuest.setLocalVideoEnable(value);
            }
          }
        },
        chatText (value) {
          this.chatText = value.replace(/(^\s*)|(\s*$)/g, "");
        },
        applyState (value) {
          let that = this;
          
          if (value == 0) {
            that.displayPlayer();
          } else if (value == 1) {
  
          } else if (value == 2) {
  
          }
        }
      },
  
      components: {
        fixedTip,
        lineMeetDetect,
        iVideo
      },
  
      beforeMount () {
        let that = this;
  
        document.body.classList.add('fullbody');
        //判断浏览器，分别打开什么链接
        /* if (['Windows', 'OSX', 'UNIX', 'Linux'].some( () => {
          return ['Windows', 'OSX', 'UNIX', 'Linux'].indexOf(anyRTCDetect.osName) > -1
        })) {
          
        } else  */if (['Android', 'BlackBerry', 'iOS', 'Opera Mini'].some(() => {
          return ['Android', 'BlackBerry', 'iOS', 'Opera Mini'].indexOf(anyRTCDetect.osName) > -1
        })) {
          window.location.href = "/share/" + that.mId;
        }
      },
  
      mounted () {
        let that = this;

        window.addEventListener('click', that.handleClick, false);

        window.onresize = () => {
          that.resizeVideos();
        }
        
        that.resizeVideos();

        (async () => {
          if (anyRTCDetect.checkDeviceSupport && anyRTCDetect.RTCPeerConnectionSupport && anyRTCDetect.dataChannelSupport && anyRTCDetect.getUserMediaSupport) {
            that.mPwd = that.$route.query.pwd ? that.$route.query.pwd : '';
            that.userNickName = that.$route.query.nickname ? that.$route.query.nickname : (that.ssuc ? that.userInfo.userNickName : utils.randomUserName());
    
            if (that.userNickName == "") {
              that.$message.error('缺少参会昵称');
              that.back();
              return false;
            }

            function getDevicesStatus () {
              return new Promise(resolve => {
                DetectRTC.load(() => {
                  that.hasWebcam = DetectRTC.hasWebcam; //(has webcam device!)//摄像头
                  that.hasMicrophone = DetectRTC.hasMicrophone; //(has microphone device!)//麦克风
                  that.hasSpeakers = DetectRTC.hasSpeakers; //(has speakers!)//扬声器
                  that.isWebRTCSupported = DetectRTC.isWebRTCSupported;

                  // console.log("audioInputDevices", DetectRTC.audioInputDevices);    // microphones
                  // console.log("audioOutputDevices", DetectRTC.audioOutputDevices);  // speakers
                  // console.log("videoInputDevices", DetectRTC.videoInputDevices);    // cameras
                  resolve();
                });
              });
            }

            await getDevicesStatus();

            that.leaveVerify = false;
            await that.$detectDevices({
              video: that.hasWebcam,
              audio: that.hasMicrophone,
              spreak: that.hasSpeakers
            }).then(() => {
              that.leaveVerify = true;
              that.fullscreenLoading = true;
              // 获取会议信息
              that.getMeetingInfo(that.mId, that.mPwd).then(data => {
                that.fullscreenLoading = false;
                switch (data.code) {
                  case 200:
                    let mInfo = data.meetinginfo;
                    let uInfo = data.userinfo;
                    let uState = uInfo.u_state;
                    that.uType = uInfo.u_type;
                    
                    let currenTime = data.currenttime;
                    let mCreateTime = mInfo.m_create_at;   //房间创建时间
                    let mStartTime = mInfo.m_start_time;   //房间开始时间
                    let mLimitType = mInfo.m_limit_type;   //会议限制类型 0开放 1密码
                    let mState = mInfo.m_state;            //会议状态 -1/0/1/2 已删除/未开启/进行中/已结束
                    let isQucikly = mInfo.m_is_default;    //是否是快速会议 0/1: 不是/是
      
                    that.mType = mInfo.m_type;             //会议类型 0默认 1视频会议 2连麦会议
                    that.mOwnerUserId = mInfo.m_userid;    //房主的userid
                    that.mOwnerUserName = mInfo.m_host_name;//房主的userName
                    that.mOwnerUserIcon = mInfo.m_host_icon;
                    that.mTitle = mInfo.m_name;            //房主的名称
                    that.mLock = mInfo.m_is_lock;          //房间是否上锁 0未上锁 1上锁
                    that.mMaxMember = mInfo.m_max_number;  //最大人员,视频会议6人
                    that.mQuality = mInfo.m_quality;       //会议的视频质量0（流畅）:320240/128 1（标清）:352288/256 2（高清）:640480/512 3（超高清）:web中使用分辨率(1280720/1024),app中使用分辨率(960540/768) 4（超级会议仅在pc���web和终端中使用）:19201080分辨率（H264编解码：码率2048，VP9编解码：码率1024（VP9编解码仅在chrome,firefox中使用）
                    that.mLineQuality = mInfo.m_line_quality;
                    that.currentQuality = (that.mType==0 || that.mType == 1) ? that.mQuality : that.mLineQuality;
                    that.strRatio = that.currentQuality >= 3 ? "16:9" : "4:3";

                    that.pushUrl = mInfo.m_push_url;
                    that.pullUrl = mInfo.m_pull_url;
                    that.hlsUrl = mInfo.m_hls_url;
      
                    document.title = that.mTitle + "的会议室";
      
                    //设置主持人身份
                    if (that.ssuc) {
                      that.mOwner = (mInfo.m_userid === that.userInfo.userid);
                    } else {
                      that.mOwner = false;
                    }
      
                    if (uState == 1) {//账户被禁用
                      that.$alert('账户已被禁用！', '系统提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          that.$router.push('/');
                        }
                      });
                      return
                    }

                    //添加侧边栏菜单项
                    if (that.mType == 0 || that.mType == 1) {
                      if (that.siderBars.indexOf('shareScreen') === -1) {
                        that.siderBars.push('shareScreen');//添加屏幕共享菜单项
                      }
                    }

                    // that.siderBars.push('setting');

                    if (that.mOwner) {//房主
                      if (isQucikly == 1) {//快速会议
                        
                      } else {
                        if (currenTime + (15*60) < mStartTime) {
                          that.$alert('会议暂未开始，会议开始时前15分钟方可进入！', '系统提示', {
                            confirmButtonText: '确定',
                            callback: () => {
                              //离开页面不需要在验证
                              that.leaveVerify = false;
                              that.back();
                            }
                          });
                          return false
                        }
                      }
      
                      //互动直播
                      if (that.mType == 2) {
                        //添加侧边栏菜单项，互动直播主播才可进行屏幕共享
                        if (that.siderBars.indexOf('shareScreen') === -1) {
                          that.siderBars.push('shareScreen');//添加屏幕共享菜单项
                        }
                        if (that.siderBars.indexOf('linelist') === -1) {
                          that.siderBars.push('linelist');//添加申请连麦列表
                        }

                        if (uInfo.u_left_line_time <= 0) {//互动直播时长
                          if (uInfo.u_asset <= 0) {
                            that.$alert('余额不足，请前往充值！', '系统提示', {
                              confirmButtonText: '确定',
                              callback: action => {
                                window.onbeforeunload = null;
                                window.onunload = null;
                                //离开页面不需要在验证
                                that.leaveVerify = false;
                                that.back();             
                              }
                            });
                            return false;
                          }
                        }
      
                        that.checkRTMixer().then(ok => {
                          if (ok) {
                            that.satrtMeet();
                            that.init();
                            that.RTMixerListener().then(code => {
                              if (code != 0) {
                                that.$message.error('培训助手连接服务中断');
                                that.mOwner && that.mHoster.clear();
                                that.detectRTMixer = 3;
                                //关闭培训助手
                                // RTMixer.disconnect();
                              }
                            });
                          }
                        });
                      } else {//非互动直播
                        if (that.siderBars.indexOf('doc') === -1) {
                          that.siderBars.push('doc');//添加文档共享菜单项
                        }
                        if (that.siderBars.indexOf('setting') === -1) {
                          that.siderBars.push('setting');
                        }
                        that.satrtMeet();
                        that.init();
                      }
                    } else {//游客或参会者
                      if (that.mType == 2) {
                        //设置播放器
                        // that.flashvars = {
                        //   f: mInfo.m_pull_url,
                        //   c: 0,   //     配置方式 0/1  ckplayer.js / ckplayer.xml
                        //   i: '',  //     cover
                        //   p: 1,   //     0/1/2 默认暂停/默认播放/默认不加载视频
                        //   e: 6    //     调用js函数 playerstop 并退出全屏
                        // };

                        that.videoObject = {
                          container: '#hostVideo',//“#”代表容器的ID，“.”或“”代表容器的class
                          variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
                          // flashplayer:false,//如果强制使用flashplayer则设置成true
                          video: mInfo.m_pull_url,//视频地址
                          autoplay: true,
                          live: true,

                        };
                      } else {
                        if (that.ssuc) {
                          if (that.siderBars.indexOf('doc') === -1) {
                            that.siderBars.push('doc');//添加文档共享菜单项
                          }
                        }
                        if (that.siderBars.indexOf('setting') === -1) {
                          that.siderBars.push('setting');
                        }
                      }
                      //游客或参会人员
                      if (that.mLock == 1 && !that.mOwner) {//房间上锁
                        that.$alert('该房间已经上锁无法进入房间', '提示', {
                          confirmButtonText: '确定',
                          callback: () => {
                            window.onbeforeunload = null;
                            window.onunload = null;
                            //离开页面不需要在验证
                            that.leaveVerify = false;
                            that.back();
                          }
                        });
                        return false;
                      }
                      //游客或参会者判断会议状态
                      switch (mState) {
                        case -1: 
                          that.$message.error('会议不存在！');
                          setTimeout(() =>{
                            //离开页面不需要在验证
                            that.leaveVerify = false;
                            that.back();
                          }, 1000);
                          return false
                        case 0: 
                          that.$message.error('会议尚未开启');
                          setTimeout(() =>{
                            //离开页面不需要在验证
                            that.leaveVerify = false;
                            that.back();
                          }, 1000);
                          return false
                        case 1: 
                          that.init();
                          break;
                        case 2: 
                          that.$message.error('会议已经结束！');
                          setTimeout(() =>{
                            //离开页面不需要在验证
                            that.leaveVerify = false;
                            that.back();
                          }, 1000);
                          return false
                      }
                    }
                  break;
                  case 100013:
                    //会议不存在
                    that.$message.error('当前会议不存在！');
                    that.leaveVerify = false;
                    that.back();
                  break;
                  case 100014:
                    if (that.mPwd == "") {
                      that.$message.error('请输入会议密码');
                    } else {
                      that.$message.error('密码不正确');
                    }
                    that.leaveVerify = false;
                    that.back();
                  break;
                  case 100022:
                    that.$message.error('用户已被禁用！');
                    setTimeout(() =>{
                      that.$store.dispatch('clearUserInfo');
                      window.onbeforeunload = null;
                      window.onunload = null;
                      //离开页面不需要在验证
                      that.leaveVerify = false;
                      that.back();
                    }, 1000);
                    break;
                  case 500001:
                    that.$message.error('接口调用频繁');
                    break;
                  default:
                    that.$message.error('获取会议信息错误：：'+data.code);
                    that.leaveVerify = false;
                    that.back();
                  break;
                }
              }).catch(err => {
                throw err;
                that.fullscreenLoading = false;
                that.$alert('会议系统异常，请稍后再试！', '系统提示', {
                  confirmButtonText: '确定',
                  callback: () => {
                    //离开页面不需要在验证
                    that.leaveVerify = false;
                    that.back();
                  }
                });
              });
            }).catch(err => {
              if (err === 'leave') {
                //离开页面不需要在验证
                that.leaveVerify = false;
                that.back();
              }
            });
          } else {
            that.noSupport = true;
          }
        })();
      },
  
      methods: {
        ShareScreenFull (e) {
          let that = this;
          let iconDom = e.target;

          let elme = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

          //if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
          if (!elme || (elme && elme != document.querySelector("#shareScreenView > video"))) {
            if (document.documentElement.requestFullscreen) {
              document.querySelector("#shareScreenView > video").requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
              document.querySelector("#shareScreenView > video").msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              document.querySelector("#shareScreenView > video").mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              document.querySelector("#shareScreenView > video").webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            }
          }
        },
        isInChina () {
          let that = this;
          return new Promise((resolve, reject) => {
            AX.post("/help/get_region").then(res => {
              let data = res.data;
              let region = data.region;
              if (region.split("|")[0] === "中国") {
                resolve(true);
              } else {
                resolve(false);
              }
            }).catch(err=>{
              reject(err);
            });
          });
        },
        closeShareScreen () {
          let that = this;

          if (that.mType == 0 || that.mType == 1) {
            that.Meet.stopScreenCap();
            that.Meet.setUserShareEnable(that.shareType, false);
          } else if (that.mType == 2) {
            that.mHoster.stopScreenCap();
            that.mHoster.setUserShareEnable(that.shareType, false);
          }
        },
        dFormt (nTime, format) {
          return dateFormat(nTime, format)
        },
        //模板
        handleMoudleChange (nModule) {
          let that = this;
          that.mModule = nModule;
          that.$nextTick(() => {
            that.resizeVideos();
          });
        },
        //屏幕共享
        handleShareScreen () {
          let that = this;

          that.siderShow = false;
          that.currentSiderName = "";

          (async ()=>{
            //判断是否是中国市场
            that.inChina = await that.isInChina();

            if (anyRTCDetect.browser.name == 'Chrome' || anyRTCDetect.browser.name == 'QQ' || anyRTCDetect.browser.name == '360' || anyRTCDetect.browser.name == 'Firefox') {
              if (that.inChina && anyRTCDetect.browser.name == 'Chrome' && (parseInt(anyRTCDetect.browser.fullVersion) < 60 || parseInt(anyRTCDetect.browser.fullVersion) > 68)) {
                that.$message.error('请使用版本在60至66之间的谷歌(Chrome)浏览器进行屏幕共享操作！');
              }
            } else {
              that.$message.error('请使用谷歌(Chrome)、QQ浏览器或360安全浏览器进行屏幕共享操作！');
              //QQ浏览器9以上、360安全浏览器10以上、360极速浏览器9.5以上
              return
            }
            if (that.mType == 2 && !that.mOwner) {//互动直播时非主播不可屏幕共享
              that.$message.warning("没有屏幕共享权限");
            } else {
              if (that.shareType != 0) {//共享通道被占用
                that.$message.error(that.shareType == 1 ? '文档共享中，无法再进行屏幕共享' : that.shareType == 2 && '屏幕共享中，无法再进行屏幕共享');
              } else {
                that.fullscreenLoading = true;

                if (anyRTCDetect.browser.name == '360' || anyRTCDetect.browser.name == 'QQ' || anyRTCDetect.browser.name == 'Firefox') {
                  that.fullscreenLoading = false;
                  that.$confirm('确实是否打开屏幕共享?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    //设置屏幕共享
                    that.shareType = 2;
                    //屏幕共享
                    if (that.mType == 0 || that.mType == 1) {
                      that.Meet.setUserShareEnable(that.shareType, true);
                    } else if (that.mType == 2) {
                      that.mHoster.setUserShareEnable(that.shareType, true);
                    }
                  }).catch(err => {
                    throw err;
                  });
                } else if (anyRTCDetect.browser.name == 'Chrome') {
                  //获取屏幕共享状态
                  getChromeExtensionStatus('daiabbkkhgegdmhfpocaakcgbajnkgbp', status => {
                    that.fullscreenLoading = false;
                    Logger(status);
                    if (status == 'installed-enabled') {
                      that.$confirm('确实是否打开屏幕共享?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        //设置屏幕共享
                        that.shareType = 2;
                        //屏幕共享
                        if (that.mType == 0 || that.mType == 1) {
                          that.Meet.setUserShareEnable(that.shareType, true);
                        } else if (that.mType == 2) {
                          that.mHoster.setUserShareEnable(that.shareType, true);
                        }
                      }).catch(err => {
                        throw err;
                      });
                    } else {
                      // 'installed-disabled' 插件已顺坏
                      // 'not-installed' 插件未安装
                      // 'not-chrome' 请使用chrome浏览器
                      that.showScreenTip = true;
                    }
                  });
                }
              }
            }
          })();
        },
        handleSiderChange (isShow, curSiderName) {
          let that = this;

          that.$nextTick(() => {
            if (curSiderName == 'message') {
              that.$refs.refChatListWrap.scrollTop = that.$refs.refChatList.offsetHeight > that.$refs.refChatListWrap.offsetHeight ? (that.$refs.refChatList.offsetHeight - that.$refs.refChatListWrap.offsetHeight) : 0;
            } else if (curSiderName == 'doc') {
              that.getDocsList();
            } else if (curSiderName == 'linelist') {
              if (isShow) {
                that.hasNewApply = false;
                that.applyList.map(item => {
                  if (item.isReady == false) {
                    item.isReady = true;
                  }
                });
              }
            }
          });
          that.siderShow = isShow;
          that.currentSiderName = curSiderName;
        },
        //本地视频
        handleCameraSwitch (enabled) {
          let that = this;

          that.mConnectList.map(item => {
            if (item.pubId === "myself") {
              item.camera = enabled;
            }
          });
          switch (that.mType) {
            case 0:
            case 1://会议
              that.Meet.setLocalVideoEnable(enabled);
              break;
          
            case 2://互动直播
              if (that.mHoster) {
                that.mHoster.setLocalVideoEnable(enabled);
              } else {
                that.mGuest.setLocalVideoEnable(enabled);
              }
              break;
          }
        },
        //本地音频
        handleMicSwitch (enabled) {
          let that = this;

          that.mConnectList.map(item => {
            if (item.pubId === "myself") {
              item.microphone = enabled;
            }
          });
          switch (that.mType) {
            case 0:
            case 1://会议
              that.Meet.setLocalAudioEnable(enabled);
              break;

            case 2://互动直播
              if (that.mHoster) {
                that.mHoster.setLocalAudioEnable(enabled);
              } else {
                that.mGuest.setLocalAudioEnable(enabled);
              }
              break;
          }
        },
        //关闭用户视频
        switchCamera(item, index) {
          let that = this;

          if (!that.mOwner) {
            return
          }
          that.mConnectList[index].camera = !that.mConnectList[index].camera;
          //如果是房主
          if (item.userId === that.jUserData["userId"]) {
            that.cameraEnabled = !that.cameraEnabled;
          } else {
            that.Meet.sendUserMessage(that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
              mType: 1,
              state: that.mConnectList[index].camera ? 1 : 0,
              userid: that.mConnectList[index].userId,
              type: 1 //视频
            }));
          }
        },
        //关闭用户音频
        switchMic(item, index) {
          let that = this;

          if (!that.mOwner) {
            return
          }
          //
          that.mConnectList[index].microphone = !that.mConnectList[index].microphone;
          //如果是房主
          if (item.userId === that.jUserData["userId"]) {
            that.micEnabled = !that.micEnabled;
          } else {
            that.Meet.sendUserMessage(that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
              mType: 1,
              state: that.mConnectList[index].microphone ? 1 : 0,
              userid: that.mConnectList[index].userId,
              type: 0 //音频
            }));
          }
        },
        //房间上锁
        handleRoomLock (locked) {
          let that = this;

          that.mLock = locked;
          AX.post('meetings/update_meeting_lock', {
            meetingid: that.mId,
            is_lock: that.mLock
          }).then(res => {
            let data = res.data;

            switch (data.code) {
              case 200:
                that.$message.success('房间' + that.mLock == 0 ? '解锁' : that.mLock == 1 && '加锁' + '成功');
                break;
              default:
                that.$message.error('房间加锁失败');
                that.mLock = !that.mLock;
                break;
            }
          }).catch(err => { });

          that.mLock = locked;
        },
        //视频拖拽
        handleVideoDrag (dragId, dropId) {
          let that = this;

          let dragObj = that.mConnectList[dragId];
          let dropObj = that.mConnectList[dropId];

          let dragVideoWidth = dragObj.width;
          let dragVideoHeight = dragObj.height;
          let dropVideoWidth = dropObj.width;
          let dropVideoHeight = dropObj.height;

          dragObj.width = dropVideoWidth;
          dragObj.height = dropVideoHeight;
          dropObj.width = dragVideoWidth;
          dropObj.height = dragVideoHeight;
          //比that.mConnectList[dragId] = dropObj要快，否则会闪动
          that.mConnectList.splice(dragId, 1, dropObj);
          that.mConnectList.splice(dropId, 1, dragObj);
        },
        //踢出用户
        clearUser(item, index) {
          let that = this;

          if (!that.mOwner) {
            return
          }
          that.$confirm('确认要将' + item.userName + '踢出房间吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (that.mType == 0 || that.mType == 1) {
              that.Meet.sendUserMessage(that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
                mType: 2,
                userid: item.userId
              }));
            } else if (that.mType == 2) {
              that.mHoster.sendUserMessage(0, that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify({
                mType: 2,
                userid: item.userId
              }));
            }
          }).catch(err => {
            throw err;
          });
        },
        //创建视频
        createVideo (videoData) {
          let that = this;
          
          if (typeof videoData !== 'object') {
            throw new Error('error videoData type');
            return
          }
          that.mConnectList.push(videoData);
          (that.mType == 0 || that.mType == 1) && (that.memberList = that.mConnectList);

          that.$nextTick(() => {
            that.resizeVideos();
          });
        },
        //开始会议-开始计时
        satrtMeet () {
          let that = this;
  
          AX.post('meetings/start_meeting', {
            meetingid: that.mId
          }).then(res => {
            let data = res.data;
          }).catch(err => {
  
          });
        },

        doJoin () {
          let that = this;
  
          if (that.userNickName != "") {
            
          } else {
            that.$message.error('请输入用户昵称');
            return false;
          }
  
          that.$router.push({
            path: `/room/${that.mId}`,
            query: {
              pwd: that.mPwd,
              nickname: that.userNickName
            }
          });
        },
        //会议初始化
        init () {
          let that = this;
          
          //拉取消息列表
          that.getHistoryMsgList();
  
          if (that.mType == 1) {//------------------------------会议
            that.initMeet();
          } else if (that.mType == 2) {//-----------------------连麦
            that.mHttp = new (RTMPCHttpKit || window.RTMPCHttpKit)();
            that.mHttp.initEngineWithAnyRTCInfo(DEV_ID, APP_ID, APP_KEY, APP_TOKEN, DOMAIN);
            that.mHttp.configServerForPriCloud(RTC_URL, RTC_HTTP_PROT);
  
            if (that.mOwner) {//-----------------------------------主播
              that.initHoster();
            } else {//-----------------------------------游客
              that.initGuester();
            }
          }
        },
        //获取会议信息
        getMeetingInfo (anyrtcId, pwd) {
          let that = this;
          return new Promise((resolve, reject) => {
            AX.post('meetings/get_meeting_info', {
              meetingid: anyrtcId,
              meeting_password: pwd
            }).then((res) => {
              let data = res.data;
              resolve(data);
            }).catch((err) => {
              reject(err)
            });
          });
        },
        //------------------------------会议消息
        addMsgList (uName, uIcon, uId, uCnt, uTime) {
          let that = this;
  
          that.chatList.push({
            m_uname: uName,
            m_uhd: uIcon,
            m_uid: uId,
            m_cnt: uCnt,
            m_time: uTime
          });
          //滚动
          that.$nextTick (()  => {
            if (that.siderShow && that.currentSiderName == "message") {
              that.$refs.refChatListWrap.scrollTop =  that.$refs.refChatList.offsetHeight > that.$refs.refChatListWrap.offsetHeight ? (that.$refs.refChatList.offsetHeight - that.$refs.refChatListWrap.offsetHeight) : 0;
            }
          });
        },
        //发送消息
        sendMsg () {
          let that = this;
  
          let msgContent = {mType: 0, mContent: utils.Base64.encode(that.chatText)};
          if (that.chatText.replace(/(^\s*)|(\s*$)/g, "") == "")
            return;
  
          AX.post('meetings/batch_insert_meeting_message', {
            msg_array: [
              {
                "meetingid": that.mId,
                "msg_userid": that.jUserData["userId"],
                "msg_u_name": that.jUserData["nickName"],
                "msg_u_icon": that.jUserData["headUrl"],
                "msg_content": utils.Base64.encode(that.chatText)
              }
            ]
          }).then((res) => {
              let Data = res.data;
              if (Data.code === 200) {
                //插入消息时间
                msgContent.mTime = Data.currenttime;
                //显示消息
                that.addMsgList(that.jUserData["nickName"], that.jUserData["headUrl"], that.jUserData["userId"], utils.Base64.decode(msgContent.mContent), msgContent.mTime * 1000);
  
                if (that.mType == 0 || that.mType == 1) { //快速会议&视频会议
                  /**
                   *    发送消息
                   *    @params strUserName           业务平台的用户昵称       （Max 256字节）
                   *    @params strUserHeaderUrl      业务平台的用户头像       （Max 512字节）
                   *    @params strContent            业务平台自定义消息内容   （Max 1024字节）
                   *    mTYpe                         0 普通消息
                   *    mContent                      消息内容
                   *    返回值 bollean
                   **/
                  that.Meet.sendUserMessage(that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify(msgContent));
                } else if (that.mType == 2) {//连麦会议
                  if (that.mOwner) {
                    that.mHoster.sendUserMessage(0, that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify(msgContent));
                  } else {
                    that.mGuest.sendUserMessage(0, that.jUserData["nickName"], that.jUserData["headUrl"], JSON.stringify(msgContent));
                  }
                }
                that.chatText = "";
              } else {
                throw new Error('INSERT_MESSAGE_ERROR')
              }
          }).catch(err=>{});
        },
        //获取会议最近的50条消息
        getHistoryMsgList () {
          let that = this;
  
          AX.post('meetings/get_meeting_msg_list', {
            meetingid: that.mId,
            page_num: 1,
            page_size: 50
          }).then((res) => {
            let data = res.data;
  
            if (data.code === 200) {
              let msglist = data.messagelist;
              for (let i in msglist) {
                that.addMsgList(msglist[i].t_msg_u_name, msglist[i].t_msg_u_icon, msglist[i].t_msg_userid, utils.Base64.decode(msglist[i].t_msg_content),  msglist[i].t_msg_create_at * 1000);
              }
            }
          }).catch(err=>{});
        },
        //------------------------------
        back () {
          let that = this;
  
          if (that.ssuc) {
            that.$router.push('/console');
          } else {
            that.$router.push('/join');
          }
        },
        //退会
        leaveRoom () {
          let that = this;
          
          window.onbeforeunload = null;
          window.onunload = null;
          that.leaveVerify = false;
          that.back();
        },
        // 加载更多人员列表
        loadMoreMembers () {
          let that = this;
          if (that.linePageIndex >= Math.ceil(that.lineTotalMember/15) - 1) {
            return
          }
          that.linePageIndex++;
          if (that.mOwner) {
            that.mHttp.getLiveMemberList(that.RoomSvrID, that.linePageIndex, that.RoomID, that.mId, (errCode, data) => {
              Logger(errCode, data);
              if (errCode == 0) {
                that.lineTotalMember = data.Total;
  
                that.memberList = [];
                for (let i in data.UserData) {
                  //添加人员列表
                  that.memberList.push({
                    p_id: data.UserId[i],
                    u_id: data.UserId[i],
                    u_type: JSON.parse(data.UserData[i]).devType,
                    u_icon: JSON.parse(data.UserData[i]).headUrl ? JSON.parse(data.UserData[i]).headUrl : USER_HD_URL,
                    u_name: data.NickName[i]
                  });
                }
              }
            });
          }
        },
        //------------------------------连麦会议-游客
        //设置窗口大小
        resizeVideos () {
          let that = this;

          let videosDom = null;
          // clearTimeout(that.resizeTimer);
          // that.resizeTimer = setTimeout(() => {
          //getBoundingClientRect
          if (that.$refs && that.$refs.videos) {
            videosDom = that.$refs.videos;
          } else {
            return
          }

          let targetWidth = null;//以多少宽度来计算尺寸
          let xRatio = that.strRatio.split(":")[0];//
          let yRatio = that.strRatio.split(":")[1];//
          let mainWidth = window.innerWidth - 100;
          let mainHeight = window.innerHeight - 100;

          //预设
          videosDom.style.width = mainWidth + "px";
          videosDom.style.height = mainHeight + "px";

          // if (that.strRatio === "16:9") {
          //   (mainWidth < 960 || mainHeight < 540) && (mainWidth = 960);
          // } else if (that.strRatio === "4:3") {
          //   (mainWidth < 960 || mainHeight < 720) && (mainWidth = 960);
          // }
          targetWidth = mainWidth;

          //分享模式(屏幕共享、文档)
          if (that.shareType != 0) {
            let shareDom = that.$refs.shareView;

            //左边视图大小
            let leftViewWidth = (targetWidth / 6) * 5;
            let leftViewHeight = (leftViewWidth * yRatio / xRatio);

            if (leftViewHeight <= mainHeight) {//以"宽度计算"出来的高度，不溢出main视图容器
              shareDom.style.width = leftViewWidth + 'px';
              shareDom.style.height = leftViewHeight + 'px';

              videosDom.style.width = (leftViewWidth / 5) + 'px';
              videosDom.style.height = leftViewHeight + 'px';

              that.mConnectList.map((item, index) => {
                item.width = (targetWidth / 6) + 'px';
                item.height = (leftViewHeight / 5) + 'px';
              });
            } else {//宽度计算溢出main视图容器 --则以"高度计算"来限制其宽度
              leftViewHeight = mainHeight;
              leftViewWidth = leftViewHeight * xRatio / yRatio;

              shareDom.style.width = leftViewWidth + 'px';
              shareDom.style.height = leftViewHeight + 'px';

              videosDom.style.width = (leftViewWidth / 5) + 'px';
              videosDom.style.height = leftViewHeight + 'px';

              that.mConnectList.map((item, index) => {
                item.width = (leftViewWidth / 5) + 'px';
                item.height = (leftViewHeight / 5) + 'px';
              });
            }
            return  //如果是分享模式，模板不生效
          }
          //
          let viewWidth;
          let viewHeight;
          if (that.mModule == 1) {//等分屏
            
            if (that.mConnectList.length == 1) {
              let itemWidth = "";
              let itemHight = "";
              if (targetWidth * yRatio / xRatio <= mainHeight) {
                videosDom.style.width = targetWidth + 'px';
                videosDom.style.height = targetWidth * yRatio / xRatio + 'px';

                itemWidth = targetWidth;
                itemHight = itemWidth * yRatio / xRatio;
              } else {
                videosDom.style.width = mainHeight * xRatio / yRatio + 'px';
                videosDom.style.height = mainHeight + 'px';

                itemWidth = mainHeight * xRatio / yRatio;
                itemHight = mainHeight;
              }

              that.mConnectList.map((item, index) => {
                item.width = itemWidth + 'px';
                item.height = itemHight + 'px';
              });
              return
            } else if (that.mConnectList.length == 2) {//等分屏仅两人时
              let itemWidth = "";
              let itemHight = "";
              if ((targetWidth / 2) * yRatio / xRatio <= mainHeight) {
                videosDom.style.width = targetWidth + 'px';
                videosDom.style.height = (targetWidth / 2) * yRatio / xRatio + 'px';

                itemWidth = targetWidth / 2;
                itemHight = itemWidth * yRatio / xRatio;
              } else {
                videosDom.style.width = mainHeight * xRatio / yRatio * 2 + 'px';
                videosDom.style.height = mainHeight + 'px';

                itemWidth = mainHeight * xRatio / yRatio;
                itemHight = mainHeight;
              }

              that.mConnectList.map((item, index) => {
                item.width = itemWidth + 'px';
                item.height = itemHight + 'px';
              });
              return
            } else if (that.mConnectList.length == 3 || that.mConnectList.length == 4) {
              let itemWidth = "";
              let itemHight = "";
              if (((targetWidth / 2) * yRatio / xRatio) * 2 <= mainHeight) {
                videosDom.style.width = targetWidth + 'px';
                videosDom.style.height = targetWidth * yRatio / xRatio + 'px';

                itemWidth = targetWidth / 2;
                itemHight = itemWidth * yRatio / xRatio;
              } else {
                videosDom.style.width = mainHeight * xRatio / yRatio + 'px';
                videosDom.style.height = mainHeight + 'px';

                itemWidth = mainHeight / 2 * xRatio / yRatio;
                itemHight = mainHeight / 2;
              }

              that.mConnectList.map((item, index) => {
                item.width = itemWidth + 'px';
                item.height = itemHight + 'px';
              });
              return
            } else if (that.mConnectList.length == 5 || that.mConnectList.length == 6) {
              let itemWidth = "";
              let itemHight = "";
              if (((targetWidth / 3) * yRatio / xRatio) * 2 <= mainHeight) {
                
                videosDom.style.width = targetWidth + 'px';
                videosDom.style.height = ((targetWidth / 3) * yRatio / xRatio) * 2 + 'px';
                
                itemWidth = targetWidth / 3;
                itemHight = itemWidth * yRatio / xRatio;
              } else {
                videosDom.style.width = mainHeight * (xRatio*3) / (yRatio*2) + 'px';
                videosDom.style.height = mainHeight + 'px';

                itemWidth = mainHeight * (xRatio*3) / (yRatio*2) / 3;
                itemHight = itemWidth * yRatio / xRatio;
              }
              that.mConnectList.map((item, index) => {
                item.width = itemWidth + 'px';
                item.height = itemHight + 'px';
              });
              return
            }

            //
            // if ((targetWidth * yRatio / xRatio) <= mainHeight) {//以"宽度计算"出来的高度，不溢出main视图容器
            //   viewWidth = targetWidth;
            //   viewHeight = (targetWidth * yRatio / xRatio);
            // } else {
            //   viewWidth = (mainHeight * xRatio / yRatio);
            //   viewHeight = mainHeight;
            // }
            // videosDom.style.width = viewWidth + 'px';
            // videosDom.style.height = viewHeight + 'px';

            // let itemWidth = "";
            // let itemHeight = "";
            // switch (that.mConnectList.length) {
            //   case 1:
            //     itemWidth = viewWidth + 'px';
            //     itemHeight = viewHeight + 'px';
            //     break;
            //   case 3:
            //   case 4:
            //     itemWidth = parseInt(viewWidth / 2) + 'px';
            //     itemHeight = parseInt(viewHeight / 2) + 'px';
            //     break;
            //   case 5:
            //   case 6:
            //     itemWidth = (viewWidth / 3) + 'px';
            //     itemHeight = (viewHeight / 3) + 'px';
            //     break;
            // }
            // that.mConnectList.map((item, index) => {
            //   item.width = itemWidth;
            //   item.height = itemHeight;
            // });
          } else if (that.mModule == 2) {//纯视频的（4+1）：3 --- 一大4小，超过滑动
            if (that.mConnectList.length == 1) {//只有一个人视频的时候
              if ((targetWidth * yRatio / xRatio) <= mainHeight) {//以"宽度计算"出来的高度，不溢出main视图容器
                viewWidth = targetWidth;
                viewHeight = (targetWidth * yRatio / xRatio);
              } else {
                viewWidth = (mainHeight * xRatio / yRatio);
                viewHeight = mainHeight;
              }
              videosDom.style.width = viewWidth + 'px';
              videosDom.style.height = viewHeight + 'px';
              
              that.mConnectList.map((item, index) => {
                item.width = viewWidth + 'px';
                item.height = viewHeight + 'px';
              });
              return
            }
            //左边视图大小
            let leftViewWidth = mainWidth / 6 * 5;
            let leftViewHeight = leftViewWidth / xRatio * yRatio;

            if (leftViewHeight <= mainHeight) {//以"宽度计算"出来的高度，不溢出main视图容器
              let firstWidth = (targetWidth / 6) * 5;
              let firstHeight = (firstWidth * yRatio / xRatio);

              videosDom.style.width = targetWidth + 'px';
              videosDom.style.height = firstHeight + 'px';
              //小视频高度等于大视频高度的1/4
              that.mConnectList.map((item, index) => {
                if (index == 0) {//第一个元素
                  item.width = firstWidth + 'px';
                  item.height = firstHeight + 'px';
                } else {
                  item.width = (targetWidth / 6) + 'px';
                  item.height = (firstHeight / 5) + 'px';
                }
              });
            } else {//宽度计算溢出main视图容器 --则以"高度计算"来限制其宽度
              leftViewHeight = mainHeight;
              let firstWidth = (leftViewHeight / yRatio) * xRatio;
              let firstHeight = leftViewHeight;

              videosDom.style.width = (firstWidth / 5 * 6) + 'px';
              videosDom.style.height = firstHeight + 'px';
              that.mConnectList.map((item, index) => {
                if (index == 0) {//第一个元素
                  item.width = firstWidth + 'px';
                  item.height = firstHeight + 'px';
                } else {
                  item.width = (firstWidth / 5) + 'px';
                  item.height = (firstHeight / 5) + 'px';
                }
              });
            }
          }
          // }, 80);
        },
        //
        registerUnload () {
          var that = this;
          window.onbeforeunload = (e) => { //窗口关闭事件,要考虑到滚动条的宽度，一般是20px
            var event = e || window.event;
            event.returnValue = "【退出系统将XXX!】";//点击关闭的时候给提示
          };
          // 退出会议
          window.onunload = () => {
            if (that.mType == 0 || that.mType == 1) {
              that.Meet.leaveRTC();
              if (that.shareType != 0) {
                that.Meet.setUserShareEnable(that.shareType, false);
              }
            } else if (that.mType == 2) {
              if (that.mOwner) {
                that.mHoster.clear();
                if (that.shareType != 0) {
                  that.mHoster.setUserShareEnable(that.shareType, false);
                }
              } else {
                that.mGuest.clear();
                if (that.shareType != 0) {
                  that.mGuest.setUserShareEnable(that.shareType, false);
                }
              }
            }
          };
        },
        //
        addBoard() {
          let that = this;

          that.socket.emit('add_board', JSON.stringify({
            is_before: 1,//0后面插入 1前面插入
            board_seqid: that.fileId,//文件id
            board_anyrtcid: that.mId,//
            board_number: that.nBGIndex,//当前画板页数
            board_background: 'https://www.teameeting.cn/static/images/team_section.jpg'
          }));
        },
        delBoard() {
          let that = this;

          that.$confirm('确认删除该画板吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.socket.emit('delete_board', JSON.stringify({
              board_seqid: that.fileId,//文件id
              board_anyrtcid: that.mId,//
              board_number: that.nBGIndex//当前画板页数
            }));
          }).catch(err => { });
        },
        handleClick (e) {
          let that = this;

          if (e.target.compareDocumentPosition(that.$refs.mSider.$el) >= 8) {
            e.stopPropagation();
          } else {
            that.siderShow && (that.siderShow = false,that.currentSiderName = "");
          }
        },
      },

      destroyed () {
        let that = this;
  
        document.body.classList.remove('fullbody');

        document.title = "Teameeting";

        window.removeEventListener('click', that.handleClick, false);
  
        window.onbeforeunload = null;
        window.onunload = null;
        if (that.mType == 0 || that.mType == 1) {
          that.Meet && that.Meet.leaveRTC();
          if (that.shareType != 0) {
            that.Meet.setUserShareEnable(that.shareType, false);
          }
        } else if (that.mType == 2) {
          if (that.mOwner) {
            that.mHoster && that.mHoster.clear();
            if (that.shareType != 0) {
              that.mHoster.setUserShareEnable(that.shareType, false);
            }
          } else {
            that.mGuest && that.mGuest.clear();
            if (that.shareType != 0) {
              that.mGuest.setUserShareEnable(that.shareType, false);
            }
          }
        }
      }
    };
  </script>

<style scoped lang="scss">
  @import "../../../scss/meetingRoom.scss";

  .verify_failed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 998;
    padding-top: 100px;
    width: 100%;
    height: inherit;
    background-color: #efefef;
    @include borderBox;
    overflow: hidden;
    
    .verify_failed_wrap {
      position: relative;
      display: block;
      margin-top: 50px;
      margin-left: auto;
      margin-right: auto;

      width: 920px;
      height: 680px;
      border: 10px solid #fff;
      background-color: #252525;
      @include borderBox;

      .verify_failed_box {
        display: table;
        width: 100%;
        height: 100%;
        vertical-align: middle;

        .verify_failed_content {
          display: table-cell;
          vertical-align: middle;

          .verify_failed_content_box {
            position: relative;
            display: block;
            margin-left: auto;
            margin-right: auto;
            padding: 30px 15px;
            width: 470px;
            height: 240px;
            background-color: #fff;
            @include borderBox;

            .verify_failed_content_hd {
              margin-bottom: 26px;
              font-size: 18px;
              color: #333;
              font-weight: normal;
              line-height: 1;
            }
            .verify_failed_content_bd {
              p {
                font-size: 14px;
                color: #666;
                line-height: 1.6;
              }
              & > div {
                margin-top: 20px;
                font-size: 0;

                .browser_item {
                  display: inline-block;
                  vertical-align: top;
                  margin-left: 6px;
                  margin-right: 6px;

                  .browser_icon {
                    position: relative;
                    width: 30px;
                    height: 30px;
                    background: url('/static/images/browser_sprite_icon.png');
                    &.chrome {
                      background-position: 0 0;
                    }
                    &.firefox {
                      background-position: -30px 0;
                    }
                    &.opera {
                      background-position: -60px 0;
                    }
                    &.safri {
                      background-position: -90px 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  .invite_wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 900;
    background-color: rgba(0, 0, 0, .4);

    .invite_box {
      margin-left: auto;
      margin-right: auto;
      padding: 27px 0 20px;
      width: 400px;
      height: 240px;
      background-color: #fff;
      
      .invite_title {
        font-size: 26px;
        color: $h2Color;
      }
      .invite_body {
        margin-top: 40px;

        .invite_body_text {
          margin-bottom: 10px;
          font-size: 28px;
          color: #306AFF;
        }
        .invite_body_desc {
          font-size: 16px;
          color: #666666;
        }
      }
      .invite_footer {
        margin-top: 34px;

        button {
          margin-left: 30px;
          &:first-child {
            margin-left: 0;
          }
          width: 110px;
        }
      }
    }
  }
  
  .device_box {
    .device_box_title {
      margin-top: 10px;
      margin-bottom: 6px;
      font-size: 12px;
      color: #999;
    }

    .device_selection {
      margin-bottom: 6px;
    }
  }

  .device_quality {
    width: 100%;

    .device_quality_item {
      margin-bottom: 6px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #fff;
      color: #AAAAAA;

      &.active {
        border: 2px solid #448AFE;
        color: #448AFE;
        box-sizing: border-box;
      }
    }
    .device_quality_tip {
      color: #AAAAAA;
      font-size: 12px;

      & > a {
        color: #448AFE;
      }
    }
  }
</style>


// WEBPACK FOOTER //
// src/components/pages/Meeting/MeetRoom.vue