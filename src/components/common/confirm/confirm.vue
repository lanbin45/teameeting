<template>
  <transition name="fade">
    <!-- 检测连麦插件结果 -->
    <div v-show="isShow" class="decete_mixer">
      <div class="m-table">
        <div class="m-table-cell">
          <div class="decete_mixer_box">

            <!-- <div v-if="detectMixerState == 0">
              <i :style="{'display': 'inline-block','font-size': '30px', 'color': '#306CFB','margin-bottom': '20px'}" class="icon iconfont icon-loading icon_spin"></i>
              <p :style="{'font-size': '24px','color': '#306CFB'}">正在监测“音视频状态”，请耐心等待!</p>
            </div> -->
            <div>
              <div class="check_devices">
                <div class="m-table check_icon_status">
                  <div class="m-table-cell">
                    <div :class="['icon_box', video ? 'active' : 'disabled']">
                      <i :class="['iconfont', video ? 'icon-shexiangtou' : 'icon-guanbishexiangtou']"></i>
                    </div>
                  </div>
                  <div class="m-table-cell">
                    <div class="icon_split"></div>
                  </div>
                  <div class="m-table-cell">
                    <div :class="['icon_box', audio ? 'active' : 'disabled']">
                      <i :class="['iconfont', audio ? 'icon-yuyin' : 'icon-yuyinguanbi']"></i>
                    </div>
                  </div>
                  <div class="m-table-cell">
                    <div class="icon_split"></div>
                  </div>
                  <div class="m-table-cell">
                    <div :class="['icon_box', spreak ? 'active' : 'disabled']">
                      <i :class="['iconfont', spreak ? 'icon-yangshengqi' : 'icon-yangshengqiguanbi']"></i>
                    </div>
                  </div>
                </div>
                <p :style="{'margin-top': '20px', 'font-size': '16px','color': '#306CFB'}">{{ message }}</p>
                <div :style="{'margin-top': '20px'}">
                  <button class="btn round primary" type="button" v-if="audio !== false" :style="{'padding':'0 20px'}" @click="successCb">继续开会</button>
                  <button class="btn round" type="button" :style="{'padding':'0 20px', 'margin-left': '20px'}" @click="cancelCb">退出会议</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="confirm_compentent" v-if="isShow">
      {{message}}
      <button @click="successCb">确认</button>
      <button @click="cancelCb">确认</button>
    </div> -->
  </transition>
</template>

<script type="text/javascript">
  export default {
    name: 'confirm-component',
    data () {
      return {
        message: '',
        isShow: true,
        detectMixerState: null,
        video: true,
        audio: true,
        spreak: true
      }
    },

    mounted () {
      window.addEventListener('popstate', this.close);
    },
    
    methods: {
      close () {
        this.isShow = false;
      },
      successCb () {
        this.$emit('confirm');
        this.close();
      },
      cancelCb () {
        this.$emit('cancel');
        this.close();
      }
    },

    destroyed() {
      window.removeEventListener('popstate', this.close);
    },
  }
</script>

<style lang="scss">
  .decete_mixer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 900;
  }

  .check_devices {
    .check_icon_status {
      width: 300px;
      margin-left: auto;
      margin-right: auto;
      
      .m-table-cell {
        width: 60px;

        .icon_box {
          width: 100%;
          height: 60px;
          line-height: 60px;
          text-align: center;
          color: #CDCDCD;
          border: 1px solid #CDCDCD;
          border-radius: 30px;

          &.active {
            background-color: #327AFF;
            color: #fff;
          }
          &.disabled {
            background-color: #FF5548;
            color: #fff;
          }
        }

        .icon_split {
          margin-left: auto;
          margin-right: auto;
          width: 28px;
          height: 2px;
          background-color: #CDCDCD;
        }
      }
    }
  }
  
</style>


// WEBPACK FOOTER //
// src/components/common/confirm/confirm.vue