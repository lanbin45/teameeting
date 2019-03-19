<template>
  <div class="meeting_video" @drop="drop($event, nIndex)" @dragover="dragover($event)" :id="strPubId+'Video'" :style="videoStyle">
    <div class="meeting_video_drop" draggable="true" @dragstart="dragstart($event, nIndex)" :id="strPubId+'VideoBox'" ref="view">
      <div class="video_view" draggable="false">
        <!--  -->
        <div class="video_item">
          <div class="video_box">
            <div class="video_content">
              <!-- <video :class="strPubId=='myself' && 'reverse'" autoplay="autoplay" :muted="isSelf" :src="src"></video> -->
              <video autoplay="autoplay" :muted="isSelf" :src="src"></video><!--  data-src="http://www.w3school.com.cn/i/movie.ogg" -->
            </div>
            <!--  -->
            <div class="video_status_bar" v-if="showStatusBar">
              <!-- <slot></slot> -->
              <div class="video_status_name" @mouseover="showStatus=true" @mouseleave="showStatus=false">
                <i class="icon iconfont icon-signal"></i> <span :style="{'margin-left': '6px'}">{{ userName }}</span>
                <!--  -->
                <div class="video_status_view" v-if="!isSelf && showStatus">
                  <p class="video_status_item">
                    <span class="video_status_label">丢包率</span>
                    <span class="video_lost_pkg">
                      <slot name="pkgLost"></slot>
                    </span>
                  </p>
                  <!-- <p class="video_status_item">
                    <span class="video_status_label">丢包率</span>
                    <span class="video_lost_pkg">
                      <slot name="netBytes"></slot>
                    </span>
                  </p> -->
                  <p class="video_status_item">
                    <span class="video_status_label">视频码率</span>
                    <span class="video_recive_bytes">
                      <slot name="videoBytes"></slot>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <!--  -->
            <div class="video_control_bar" v-if="showControlBar">
              <div class="video_control_bar_item" v-if="!isSelf && type !=2">
                <i :class="['icon', 'iconfont', video ? 'icon-camera_open' : 'icon-camera_close']"></i>
              </div>
              <div class="video_control_bar_item" v-if="!isSelf && type !=2">
                <slot name="audioLevel">
                  <i :class="['icon', 'iconfont', audio ? 'icon-mic_open' : 'icon-mic_close']"></i>
                </slot>
              </div>
              <div class="video_control_bar_item" @click="fullScreen($event)">
                <i class="icon iconfont" :class="isFull ? 'icon-full_screen_out' : 'icon-full_screen_in'"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showStatusBar: true,//局部变量-是否显示网络状态栏
        showControlBar: true,
        showStatus: false,  //局部变量-是否显示网络状态
        isFull: false,      //局部变量-是否全屏显示

        videoStyle: {
          width: this.item.width,
          height: this.item.height
        },
        isSelf: this.item.isSelf ? this.item.isSelf : false, //是否是本人
        nIndex: this.index,
        strPubId: this.item.pubId,
        userName: this.item.userName,
        video: this.item.camera,
        audio: this.item.microphone,
        src: this.item.src
      }
    },

    props: {
      index: Number,
      item: Object,
      type: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    
    watch: {
      'item.width' (val) {
        this.videoStyle.width = val;
        
        if (parseInt(val) < 300) {
          this.showStatusBar = false;

          if (parseInt(val) < 135) {
            this.showControlBar = false;
          } else {
            this.showControlBar = true;
          }
        } else {
          this.showStatusBar = true;
        }
      },
      'item.height'(val) {
        // console.log('item.height', val)
        this.videoStyle.height = val;
      },
      'item.camera' (val) {
        // console.log('item.camera',val)
        this.video = val;
      },
      'item.microphone'(val) {
        // console.log('item.microphone', val)
        this.audio = val;
      },
      'item.src' (val) {
        this.src = val;
      },
      'item.isSelf'(val) {
        this.isSelf = val ? val : false;
      },
      'item.pubId'(val) {
        this.strPubId = val;
      },
      'item.userName'(val) {
        this.userName = val;
      },
      'item.src'(val) {
        this.src = val;
      },
    },

    mounted() {
      let that = this;

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

    methods: {
      drop (e, nIndex) {
        this.$emit('onVideoDrag', e.dataTransfer.getData('startID'), nIndex);
        e.preventDefault();
      },
      dragover (e) {
        e.preventDefault();
      },
      dragstart (e, nIndex) {
        e.dataTransfer.setData('startID', nIndex);
      },
      fullScreen (e) {
        let that = this;
        let iconDom = e.target;

        let elme = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

        //if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (!elme || (elme && elme != that.$refs.view)) {
          if (document.documentElement.requestFullscreen) {
            that.$refs.view.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            that.$refs.view.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            that.$refs.view.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            that.$refs.view.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
          that.isFull = true;
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
          that.isFull = false;
        }
      }
    },
    destroyed() {
      
　　　//监听不同浏览器的全屏事件，并件执行相应的代码
      document.removeEventListener("webkitfullscreenchange", function () {//
        if (document.webkitIsFullScreen) {
          //全屏后要执行的代码

        } else {
          //退出全屏后执行的代码
          that.isFull = false;
        }
      }, false);


      document.removeEventListener("fullscreenchange", function () {
        if (document.fullscreen) {
          //全屏后执行的代码

        } else {
          //退出全屏后要执行的代码
          that.isFull = false;
        }
      }, false);


      document.removeEventListener("mozfullscreenchange", function () {
        if (document.mozFullScreen) {
          //全屏后要执行的代码
        } else {
          //退出全屏后要执行的代码
          that.isFull = false;
        }
      }, false);


      document.removeEventListener("msfullscreenchange", function () {
        if (document.msFullscreenElement) {
          //全屏后要执行的代码
        } else {
          //退出全屏后要执行的代码
          that.isFull = false;
        }
      }, false);
    },
  }
</script>

<style lang="scss" scoped>
  .meeting_video {

    .meeting_video_drop {
      background-color: #000;
    }

    .meeting_video_drop,
    .video_view,
    .video_item,
    .video_box {
      width: 100%;
      height: 100%;
    }
  }

  .video_box {
    position: relative;
    width: 100%;
    height: 100%;
    /*  */
    .video_content {
      position: relative; 
      width: 100%;
      height: 100%;
      overflow: hidden;

      & > video {
        position: absolute;
        top: 50%;
        width: 100%;
        height: auto;
        vertical-align: middle;
        transform: translateY(-50%);//rotateY(180deg)

        &.reverse {
          transform: translateY(-50%) rotateY(180deg);
        }
      }
    }

    /*  */
    .video_status_bar {
      position: absolute;
      top: 10px;
      left: 10px;
      color: #fff;
      font-size: 12px;
      z-index: 10;

      .video_status_name {
        position: relative;
        padding: 0 15px;
        height: 30px;
        line-height: 30px;
        background-color: #333;
        /* opacity: 0.8; */
        /* filter: alpha(opacity=80); */
        border-radius: 4px;

        .video_status_view {
          position: absolute;
          left: 0;
          margin-top: 6px;
          padding: 5px 15px;
          width: max-content;
          background-color: #000;
          border-radius: 4px;

          .video_status_label {
            width: 70px;
            display: inline-block;
          }

          .video_status_item {
            line-height: 1.9;
          }
        }
      }
    }
    /*  */
    .video_control_bar {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 0;
      z-index: 10;

      .video_control_bar_item {
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
        margin-right: 5px;
        width: 30px;
        height: 30px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        border-radius: 4px;
        background-color: #333333;
        /* opacity: 0.8; */
        /* filter: alpha(opacity=80); */
        cursor: pointer;
      }
    }
  }
</style>


// WEBPACK FOOTER //
// src/components/common/meeting/video.vue