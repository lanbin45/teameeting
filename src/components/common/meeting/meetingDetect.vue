<template>
  <!-- 检测连麦插件结果 -->
  <div v-if="detectMixerState != 0" class="decete_mixer">
    <div class="m-table">
      <div class="m-table-cell">
        <div class="decete_mixer_box">

          <div v-if="detectMixerState == 1">
            <i :style="{'display': 'inline-block','font-size': '30px', 'color': '#306CFB','margin-bottom': '20px'}" class="icon iconfont icon-loading icon_spin"></i>
            <p :style="{'font-size': '24px','color': '#306CFB'}">正在开启“互动直播”，请耐心等待!</p>
          </div>
          <div v-else-if="detectMixerState == 2">
            <div>
              <!-- <i :style="{'font-size': '60px','color':'#FD6B6D','margin-bottom':'20px'}" class="el-icon-warning"></i> -->
              <transition name="fade"  mode="out-in">
                <img :key="aState" :src="currentTipPic" alt="">
              </transition>
              <p :style="{'font-size': '18px','color':'#999'}">您当前并未安装“互动直播”小助手<br>请点击下方下载按钮完成安装操作</p>
            </div>
            <div :style="{'margin-top': '20px'}">
              <a class="btn round primary" :style="{'padding':'0 20px'}" :href="rtmixerDownloadUrl =='' ? 'javascript:;' : rtmixerDownloadUrl+'?'+ Date.now()" target="_blank" @click="isDownload = true">下载培训助手</a>
              <a class="btn round primary" :style="{'padding':'0 20px'}" v-if="isDownload" href="javascript:;" @click="startRTMixer">启用培训助手</a>
            </div>
          </div>
          <div v-else-if="detectMixerState == 3">
            <div>
              <i :style="{'font-size': '60px','color':'#FD6B6D','margin-bottom':'20px'}" class="el-icon-warning"></i>
              <p :style="{'font-size': '18px','color': '#FD6B6D'}">培训助手发生异常，请关闭后重试！</p>
            </div>
            <div :style="{'margin-top': '20px'}">
              <a class="btn round primary" :style="{'padding':'0 20px'}"  href="javascript:;" @click="$router.go(0)">刷新重试</a>
            </div>
          </div>
          <div v-else-if="detectMixerState == 4">
            <div>
              <i :style="{'font-size': '60px','color':'#FD6B6D','margin-bottom':'20px'}" class="el-icon-warning"></i>
              <p :style="{'font-size': '18px','color': '#FD6B6D'}">开启互动直播目前仅支持Windows平台</p>
            </div>
            <div :style="{'margin-top': '20px'}">
              <a class="btn round primary" :style="{'padding':'0 20px'}"  href="javascript:;" @click="back">返回</a>
            </div>
          </div>
          <div v-else-if="detectMixerState == 5">
            <div>
              <!-- <i :style="{'font-size': '60px','color':'#FD6B6D','margin-bottom':'20px'}" class="el-icon-warning"></i> -->
              <!-- <transition name="fade"  mode="out-in">
                <img :key="aState" :src="currentTipPic" alt="">
              </transition> -->
              <p :style="{'font-size': '18px','color':'#999'}">“互动直播”小助手版本过低<br>请更新后重试。</p>
            </div>
            <div :style="{'margin-top': '20px'}">
              <a class="btn round primary" :style="{'padding':'0 20px'}" :href="rtmixerDownloadUrl =='' ? 'javascript:;' : rtmixerDownloadUrl+'?'+ Date.now()" target="_blank" @click="isDownload = true">更新培训助手</a>
              <a class="btn round primary" :style="{'padding':'0 20px'}" v-if="isDownload" href="javascript:;" @click="startRTMixer">启用培训助手</a>
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
        detectMixerState: this.value,        //0未监测 1检测 2未安装 3服务异常 4不支持除window以外的平台
        rtmixerDownloadUrl: this.downUrl,
        aState: 0,                  //提示安装的图片索引
        tipTimer: null,
        isDownload: false,          //Mixer是否下载
      }
    },

    props: {
      value: {
        type: Number,
        default () {
          return 0
        }
      },
      downUrl: String
    },

    watch: {
      value (val) {
        let that = this;
        that.detectMixerState = val;

        switch (val) {
          case 2: 
            that.tipTimer = setInterval(() => {
              if (that.aState == 2) {
                that.aState = -1;
              }
              that.aState++;
            }, 2500);
            break;

          default:
            that.tipTimer && clearInterval(that.tipTimer);
        }
      },
      downUrl (val) {
        this.rtmixerDownloadUrl = val;
      }
    },

    computed: {
      currentTipPic () {
        switch (this.aState) {
          case 0: return '/static/images/meeting/download.png'
          case 1: return '/static/images/meeting/install.png'
          case 2: return '/static/images/meeting/start.png'
        }
      }
    },

    mounted () {
      let that = this;

      // that.tipTimer = setInterval(() => {
      //   if (that.aState == 2) {
      //     that.aState = -1;
      //   }
      //   that.aState++;
      // }, 2500);
    },

    destroyed() {
      clearInterval(this.tipTimer);
    },

    methods: {
      startRTMixer () {
        this.$emit('onStartRTMixer');
      },
      back () {
        this.$emit('onUnSupport');
      }
    }
  }

</script>

<style lang="scss" scoped>
  .decete_mixer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 900;
  }
</style>


// WEBPACK FOOTER //
// src/components/common/meeting/meetingDetect.vue