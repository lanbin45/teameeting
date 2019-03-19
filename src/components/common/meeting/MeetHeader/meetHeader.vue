<template>
  <div class="meet_header">
    <div class="meet_logo">
      <img class="logo" src="/static/images/logo.png" alt="Teameeting Logo">
    </div>

    <div class="meet_header_tools">
      <div class="apply_line meet_header_tool_item" v-if="type==2 && !owner && isLogin" @click="apply">
        <i v-if="step==0" :class="['icon', 'iconfont', 'icon-guest_apply']" title="申请连麦"></i>
        <span v-if="step==1">{{ seconds + 's' }}</span>
        <span class="cancel_item" v-if="step==1"><i :class="['icon', 'iconfont', 'icon-hangup']"></i></span>
        <i v-if="step==2" :class="['icon', 'iconfont', 'icon-hangup']" title="挂断连麦"></i>
      </div>
      <div class="apply_line meet_header_tool_item" v-if="type==2 && !owner && step==2 && !isLogin" @click="apply" title="挂断连麦">
        <i :class="['icon', 'iconfont', 'icon-hangup']"></i>
      </div>
      <div class="meet_header_tool_item" @click="changeModel" title="视频模板">
        <i :class="['icon', 'iconfont', nModule == 1 ? 'icon-module1' : 'icon-module2']"></i>
      </div>
      <div class="meet_header_tool_item" @click="switchAudio" v-if="isStart" title="麦克风开关">
        <i :class="['icon', 'iconfont', microphone ? 'icon-mic_open' : 'icon-mic_close']"></i>
      </div>
      <div class="meet_header_tool_item" @click="switchVideo" v-if="isStart" title="摄像头开关">
        <i :class="['icon', 'iconfont', camera ? 'icon-camera_open' : 'icon-camera_close']"></i>
      </div>
      <div class="meet_header_tool_item" @click="switchRoom" v-if="ssuc && owner" title="房间锁">
        <i :class="['icon', 'iconfont', lock ? 'icon-lock' : 'icon-unlock']"></i>
      </div>
      <div class="meet_header_tool_item">
        <div ref="invite" @click="showInviteNav = !showInviteNav" title="邀请"><i class="icon iconfont icon-invite"></i></div>
        <!-- 邀请视图 -->
        <div class="nav_dropdown" v-if="showInviteNav">
          <div class="nav_dropdown_content">
            <div class="nav_dropdown_item nav_dropdown_link" id="copyLink" @click="copyLink" :data-clipboard-text="currentUrl">
              <div class="nav_dropdown_link_icon"><i class="icon iconfont icon-link"></i></div>复制链接
            </div>
            <div class="nav_dropdown_item nav_dropdown_link" id="copyRoomId" @click="copyRoomId" :data-clipboard-text="roomId">
              <div class="nav_dropdown_link_icon"><i class="icon iconfont icon-link"></i></div>复制会议号
              <br>
            </div>
            <div class="nav_dropdown_item nav_dropdown_pic">
              <p><i class="icon iconfont icon-wechat"></i> 扫码微信分享</p>
              <p :style="{'padding': '0 18px', 'margin-top': '0'}"><img :style="{'width': '100%'}" :src="RoomQRCode" alt="微信分享"></p>
              <br>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="meet_header_tool_item" @click="setting" title="设置"><i class="icon iconfont icon-setting"></i></div> -->
      <div class="meet_header_tool_item" @click="fullScreen" title="全屏"><i :class="['icon', 'iconfont', isFull ? 'icon-full_screen_out' : 'icon-full_screen_in']"></i></div>
      <div class="meet_header_tool_item" @click="leaveRoom" :style="{'border-left': '1px solid #ddd'}" title="退出"><i class="icon iconfont icon-leave"></i></div>
    </div>
  </div>
</template>

<script>
  import { QRCode } from '@/assets/utils/utils';
  import { mapGetters } from 'vuex';

  //复制
  import ClipboardJS from 'clipboard';
  var link = new ClipboardJS("#copyLink");
  var id = new ClipboardJS("#copyRoomId");

  export default {
    data () {
      return {
        nModule: 1,     // 1等分屏  2一大N小
        isFull: false,

        timer: null,
        seconds: 30,
        
        owner: this.isOwner,
        isLogin: this.login,
        step: this.applyStep,
        isStart: this.mIsStart,
        lock: !!this.roomLock,
        camera: this.cameraEnabled,
        microphone: this.micEnabled,
        showInviteNav: false,
        roomId: this.$route.params.id,
        RoomQRCode: '',
      }
    },

    props: {
      type: {
        type: Number,
        default() {
          return 0
        }
      },
      login: {
        type: Boolean,
        default() {
          return false
        }
      },
      isOwner: {
        type: Boolean,
        default() {
          return false
        }
      },
      applyStep: {
        type: Number,
        default() {
          return 0
        }
      },
      mIsStart: {
        type: Boolean,
        default () {
          return false
        }
      },
      cameraEnabled: {
        type: Boolean,
        default() {
          return true
        }
      },
      micEnabled: {
        type: Boolean,
        default() {
          return true
        }
      },
      roomLock: {
        type: Number,
        default() {
          return 0
        }
      }
    },

    watch: {
      isOwner (val) {
        this.owner = val;
      },
      login (val) {
        this.isLogin = val;
      },
      applyStep (val) {
        if (val != 1 && this.timer) {
          clearInterval(this.timer);
          this.seconds = 30;
        }
        this.step = val;
      },
      mIsStart (val) {
        this.isStart = val;
      },
      roomLock (val) {
        this.lock = !!val;
      },
      cameraEnabled(val) {
        this.camera = val;
      },
      micEnabled(val) {
        this.microphone = val;
      }
    },

    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo',
        ssuc: 'getSsuc'
      }),
      currentUrl () {
        let that = this;
        let local = window.location;
        let url = local.protocol + "//" + local.host + "/share/" + that.roomId+"?pwd="+(that.$route.query.pwd ? that.$route.query.pwd : '');
        return url;
      }
    },

    mounted() {
      let that = this;

      QRCode.toDataURL(that.currentUrl).then(url => {
        that.RoomQRCode = url;
      }).catch(err => {
        that.RoomQRCode = "";
      });

      document.addEventListener('click', that.handleClick, false);

      //监听不同浏览器的全屏事件，并件执行相应的代码
      document.addEventListener("webkitfullscreenchange", function (e) {//
        // console.log('webkitfullscreenchange', document.webkitIsFullScreen);
        if (document.webkitIsFullScreen) {
          //全屏后要执行的代码

        } else {
          //退出全屏后执行的代码
          that.isFull = false;
        }
      }, false);

      document.addEventListener("fullscreenchange", function (e) {
        // console.log('fullscreenchange', document.fullscreen);
        if (document.fullscreen) {
          //全屏后执行的代码

        } else {
          //退出全屏后要执行的代码
          that.isFull = false;
        }
      }, false);

      document.addEventListener("mozfullscreenchange", function (e) {
        // console.log('mozfullscreenchange', document.mozFullScreen);
        if (document.mozFullScreen) {
          //全屏后要执行的代码
        } else {
          //退出全屏后要执行的代码
          that.isFull = false;
        }
      }, false);

      document.addEventListener("msfullscreenchange", function (e) {
        // console.log('msfullscreenchange', document.msFullscreenElement);
        if (document.msFullscreenElement) {
          //全屏后要执行的代码
        } else {
          //退出全屏后要执行的代码
          that.isFull = false;
        }
      }, false);
    },
    
    destroyed () {
      let that = this;
      
      document.removeEventListener('click', that.handleClick, false);
    },

    methods: {
      handleClick (e) {
        let that = this;

        if (e.target.compareDocumentPosition(that.$refs.invite) >= 8) {
          e.stopPropagation();
        } else {
          that.showInviteNav && (that.showInviteNav = false);
        }
      },
      apply () {
        let that = this;

        switch (that.step) {
          case 0:
            that.step = 1;
            that.timer = setInterval(() => {
              that.seconds--;
              if (that.seconds == 0) {
                that.$emit('onApplyLine', 0);
                clearInterval(that.timer);
                that.seconds = 30;
                that.step = 0;
                that.timer = null;
                return
              }
            }, 1000);
            that.$emit('onApplyLine', 1);
            break;
          case 1:
            // that.$confirm('确认取消连麦？').then(() => {
              that.$emit('onApplyLine', 0);
              clearInterval(that.timer);
              that.seconds = 30;
              that.timer = null;
              that.step = 0;
            // }).catch(err =>{});
            break;
          case 2:
            that.$confirm('确认挂断连麦？').then(() => {
              that.$emit('onApplyLine', 0);
            }).catch(err => { });
            break;
        }
      },
      copyLink (e) {
        this.$message.success('复制成功！');
      },
      copyRoomId () {
        this.$message.success('复制成功！');
      },
      changeModel () {
        this.nModule = (this.nModule == 1 ? 2 : 1);
        this.$emit("onModuleChange", this.nModule);
      },
      switchAudio () {
        let that = this;
        that.microphone = !that.microphone;
        that.$emit('onSwitchAudio', that.microphone);
      },
      switchVideo () {
        let that = this;
        that.camera = !that.camera;
        that.$emit('onSwitchCamera', that.camera);
      },
      switchRoom () {
        let that = this;
        that.$confirm(`${ (that.lock ? '解锁' : '锁定') }该房间，是否继续?`).then(res => {
          that.lock = !that.lock;
          that.$emit('onSwitchRoom', that.lock ? 1 : 0);
        }).catch(err => { });
      },
      setting () {

      },
      fullScreen () {
        let that = this;

        if (!that.isFull) {
          var el = document.documentElement;
          var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
          } else if (typeof window.ActiveXObject != "undefined") {
            //这的方法 模拟f11键，使浏览器全屏
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
              wscript.SendKeys("{F11}");
            }
          }
          that.isFull = true;
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          }
          else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
          else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
          if (typeof cfs != "undefined" && cfs) {
            cfs.call(el);
          }
          that.isFull = false;
        }
      },
      leaveRoom () {
        let that = this;

        that.$confirm('确认离开该房间吗？').then(res => {
          that.$emit('onLeaveRoom');
        }).catch(err=>{});
      }
    }
  }
</script>

<style scoped lang="scss">
  $HeaderHeight: 60px;
  $HeaderBGColor: #fff;

  .meet_header {
    margin-top: -1px;
    height: $HeaderHeight;
    background-color: $HeaderBGColor;
    border-bottom: 1px solid #ddd;
    z-index: 800;
    user-select: none;
    
    /*  */
    .meet_logo {
      float: left;
      padding-left: 20px;
      height: 100%;
      line-height: $HeaderHeight;

      .logo {
        width: 124px;
        vertical-align: middle;
      }

      &::after {
        content: '';
        display: block;
        clear: both;
      }
    }
    /*  */
    .meet_header_tools {
      padding-left: 180px;
      height: 100%;
      text-align: right;

      & > .meet_header_tool_item {
        position: relative;
        display: inline-block;
        width: 60px;
        height: $HeaderHeight;
        line-height: $HeaderHeight;
        vertical-align: middle;
        text-decoration: none;
        text-align: center;
        color: #AFAFAF;
        cursor: pointer;

        & > .cancel_item {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        
        &:hover {
          color: #448AFE;

          & > .cancel_item {
            display: block;
            background-color: #dfdfdf;
          }
        }
        
        &.apply_line {

          &:hover {
            color: #AFAFAF;
          }
        }
      }
    }
  }

  .nav_dropdown {
    position: absolute;
    left: 50%;
    padding: 8px 0px;
    width: 140px;
    transform: translateX(-50%);

    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 3px;
      border-bottom: 5px solid #fff;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      left: 50%;
      transform: translateX(-50%);
    }

    .nav_dropdown_content {
      background-color: #fff;
    }

    .nav_dropdown_item {
      display: block;
      padding: 0 18px;
      font-size: 14px;
      color: #666;
      
      &.icon {
        float: left;
        width: 50px;
        line-height: 40px;
      }
      
      &.nav_dropdown_link {
        padding-left: 50px;
        line-height: 40px;
        text-align: left;

        &:hover {
          background-color: #EAEAEA;
          color: #448AFE;
        }

        .nav_dropdown_link_icon {
          display: inline-block;
          float: left;
          margin-left: -50px;
          width: 50px;
          text-align: center;

          &:after {
            content: "";
            display: table;
            clear: both;
          }
        }
      }

      &.nav_dropdown_pic {
        line-height: 1;
        padding: 0;

        &>img {
          width: 100%;
          height: auto;
        }
        &>p {
          margin-top: 4px;
          font-size: 12px; 
          color: #21AE1D;
          line-height: 1;
        }
      }
    }
  }

</style>


// WEBPACK FOOTER //
// src/components/common/meeting/MeetHeader/meetHeader.vue