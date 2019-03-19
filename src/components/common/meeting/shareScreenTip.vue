<template>
  <transition name="fade">
    <div class="share_screen_tip_view" v-if="show">
      <div class="share_screen_tip_content" v-if="!isChrome">
        <div class="share_screen_tip">
          您当前正在启动“屏幕共享”共享功能,请根据以下操作进行插件安装：
        </div>
        <div class="share_screen_tip">
          1.当前该功能仅支持以下浏览器，请选择您的浏览器下载对应操作文档或插件：
        </div>
        <div class="share_screen_tip">
          <div class="share_screen_browser">
            <a class="browser QQ" target="_blank" :href="QQOpenUrl"></a>
            <a class="browser se360" target="_blank" :href="seOpenUrl"></a>
            <a class="browser chrome" target="_blank" :href="china ? '/static/download/anyrtc_screen_share.zip' : 'https://chrome.google.com/webstore/detail/anyrtc-screenshare/daiabbkkhgegdmhfpocaakcgbajnkgbp?hl=zh-CN' " @click="china ? isChrome = true  : (show = false,$emit('input', false))"></a>
          </div>
        </div>
        <div class="share_screen_controls">
          <button type="button" class="btn round" @click="show = false;$emit('input', false)">取消</button>
        </div>
      </div>
      <div class="share_screen_tip_content" v-else>
        <div class="share_screen_tip">
          您当前已经下载chrome浏览器“屏幕共享插件”，请根据以下操作安装,请根据以下操作进行插件安装：
        </div>
        <div class="share_screen_tip">
          1. 点击“更多工具 - 扩展程序”进入插件列表，或复制<code>chrome://extensions</code>到浏览器地址栏
        </div>
        <div class="share_screen_tip">
          2. 解压，然后将下载的插件<code>anyRTC-XXX.crx</code>程序拖拽到步骤 1 打开的页面中,安装成功后按<code>F5</code>刷新当前页面。
        </div>
        <div class="share_screen_tip">
          注：67以上版本或者国外用户请前往谷歌市场下载：<a :style="{'color': '#448AFE'}" href="https://chrome.google.com/webstore/detail/anyrtc-screenshare/daiabbkkhgegdmhfpocaakcgbajnkgbp?hl=zh-CN" target="_blank">点击前往</a><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          如不能访问谷歌市场的用户，请使用67以下版本或使用360安全浏览器与QQ浏览器
        </div>
        <div class="share_screen_controls">
          <button type="button" class="btn round primary"  @click="isChrome = false" :style="{'width':'120px'}">上一步</button>
          <button type="button" class="btn round" @click="show = false;isChrome = false;$emit('input', false)" :style="{'margin-left':'10px', 'width':'120px'}">取消</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import anyRTCDetect from '@/assets/RTCDetect/anyRTCDetect';

  export default {
    data () {
      return {
        show: this.value,
        isChrome: false,
        china: this.inChina
      }
    },

    props: {
      value: Boolean,
      inChina: Boolean
    },

    watch: {
      value (val) {
        this.show = val;
      },
      inChina (val) {
        this.china = val;
      }
    },
    
    components: {},

    computed: {
      QQOpenUrl () {
        return anyRTCDetect.browser.name == 'QQ' ? 'https://appcenter.browser.qq.com/search/detail?key=anyRTC&id=daiabbkkhgegdmhfpocaakcgbajnkgbp &title=anyRTC-ScreenShare' : 'https://appcenter.browser.qq.com/search/detail?key=anyRTC&id=daiabbkkhgegdmhfpocaakcgbajnkgbp &title=anyRTC-ScreenShare'
      },
      seOpenUrl () {
        return anyRTCDetect.browser.name == '360' ? 'https://ext.se.360.cn/webstore/detail/ncimcjgppbokkenggioiebjhicflnfmp' : 'https://ext.se.360.cn/webstore/detail/ncimcjgppbokkenggioiebjhicflnfmp'//'javascript:void(0)'
      }
    },

    mounted () {},

    methods: {}
  }

</script>

<style lang=scss scoped>
  .fade-enter-active, .fade-leave-active {
    transform: translateY(0);
    transition: all .5s linear;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: translateY(-100%);
  }

  .share_screen_tip_view {
    position: fixed;
    top: 0;
    left: 50%;
    // transform: translate(-50%, 0);
    margin-left: -400px;
    padding: 30px;
    width: 800px;
    // min-height: 230px;
    background-color: #fff;
    border: 1px solid #ddd;
    box-sizing: border-box;
    z-index: 998;

    .share_screen_tip_content {

      .share_screen_tip {
        margin-bottom: 18px;
        color: #666666;
      }

      .share_screen_controls {
        text-align: right;
      }

      .share_screen_browser {
        display: table;

        .browser {
          display: table-cell;
          width: 54px;
          height: 70px;
          background-image: url('/static/images/meeting/browser_sprite.png');
          cursor: pointer;

          &.se360 {
            background-position: 0 0;
            &:hover {
              background-position: -54px 0;
            }
          }
          &.QQ {
            background-position: -108px 0;
            &:hover {
              background-position: -162px 0;
            }
          }
          &.chrome {
            background-position: -216px 0;
            &:hover {
              background-position: -270px 0;
            }
          }
        }
      }
    }
  }

  code {
    border: 0;
    background-color: #D6DBDF;
    border-radius: 4px;
    color: #2C3E50;
    font-size: 90%;
    padding: 2px 4px;
    white-space: nowrap;
  }
</style>


// WEBPACK FOOTER //
// src/components/common/meeting/shareScreenTip.vue