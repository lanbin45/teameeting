<template>
  <div class="meet_sider flex_item">
    <div class="meet_sider_meau">
      <div class="meet_sider_item" @click="switchSide('member')" v-if="navbars.indexOf('member') != -1">
        <div class="meet_sider_item_box">
          <i class="icon iconfont icon-sider_meau_member"></i>
          <p>参会人员</p>
        </div>
      </div>
      <div class="meet_sider_item" @click="switchSide('message')" v-if="navbars.indexOf('message') != -1">
        <div class="meet_sider_item_box">
          <i class="icon iconfont icon-sider_meau_message"></i><i v-if="showNewMsg" class="red_tip"></i>
          <p>聊天信息</p>
        </div>
      </div>
      <div class="meet_sider_item" @click="switchSide('doc')" v-if="navbars.indexOf('doc') != -1">
        <div class="meet_sider_item_box">
          <i class="icon iconfont icon-sider_meau_doc"></i>
          <p>文档共享</p>
        </div>
      </div>
      <div class="meet_sider_item" @click="shareScreen()" v-if="navbars.indexOf('shareScreen') != -1">
        <div class="meet_sider_item_box">
          <i class="icon iconfont icon-sider_meau_sharescreen"></i>
          <p>屏幕共享</p>
        </div>
      </div>
      <div class="meet_sider_item" @click="switchSide('linelist')" v-if="navbars.indexOf('linelist') != -1">
        <div class="meet_sider_item_box">
          <i class="icon iconfont icon-menu_apply"></i><i v-if="showNewApply" class="red_tip"></i>
          <p>申请列表</p>
        </div>
      </div>
      <div class="meet_sider_item" @click="switchSide('setting')" v-if="navbars.indexOf('setting') != -1">
        <div class="meet_sider_item_box">
          <i class="icon iconfont icon-setting"></i>
          <p>设置中心</p>
        </div>
      </div>
    </div>
    <!--  -->
    <div :class="['meet_sider_meau_content', {'open_meet_sider': show }]">
      <slot v-if="currentSider == 'member'" name="member"></slot>
      <slot v-else-if="currentSider == 'message'" name="message"></slot>
      <slot v-else-if="currentSider == 'doc'" name="doc"></slot>
      <slot v-else-if="currentSider == 'linelist'" name="linelist"></slot>
      <slot v-else-if="currentSider == 'setting'" name="setting"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        navbars: [].concat(this.value),

        show: this.siderShow,
        showNewMsg: this.hasNewMsg,
        showNewApply: this.hasNewApply,
        currentSider: this.currentSiderName
      }
    },

    props: {
      value: {
        type: Array,
        default() {
          return ['member', 'message']
        }
      },
      hasNewMsg: {
        type: Boolean,
        default() {
          return false
        }
      },
      hasNewApply: {
        type: Boolean,
        default() {
          return false
        }
      },
      siderShow: {
        type: Boolean,
        default () {
          return false
        }
      },
      currentSiderName: {
        type: String,
        default() {
          return ""
        }
      }
    },

    watch: {
      siderShow (val) {
        this.show = val;
      },
      currentSiderName (val) {
        this.currentSider = val;
      },
      value (val) {
        this.navbars = [].concat(val);
      },
      hasNewMsg (val) {
        this.showNewMsg = val;
      },
      hasNewApply (val) {
        this.showNewApply = val;
      }
    },

    methods: {
      //切换侧边栏
      switchSide (strTag) {
        let that = this;
        
        if (that.currentSider === strTag) {
          that.show = false;
          that.currentSider = "";
        } else {
          if (strTag == "message") {
            that.showNewMsg = false;
          } else if (strTag == "linelist") {
            that.showNewApply = false;
          }
          that.show = true;
          that.currentSider = strTag;
        }
        that.$emit('onSiderChange', that.show, that.currentSider);
      },
      //屏幕共享
      shareScreen () {
        this.$emit('onShareScreen');
      }
    }
  }

</script>

<style lang="scss" scoped>
  .meet_sider {
    position: relative;
    flex: 0 0 60px;
    user-select: none;

    .meet_sider_meau {
      position: relative;
      height: 100%;
      background-color: #1D212A;
      z-index: 99;

      .meet_sider_item {
        display: table;
        width: 60px;
        height: 60px;
        text-align: center;
        text-decoration: none;
        cursor: pointer;

        .meet_sider_item_box {
          position: relative;
          display: table-cell;
          vertical-align: middle;

          .red_tip {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background-color: red;
            border-radius: 4px;
          }

          & > i {
            color: #fff;
            font-size: 18px;
          }
          & > p {
            margin-top: 3px;
            font-size: 12px;
            color: #fff;
          }
        }
      }
    }
    /*  */
    .meet_sider_meau_content {
      position: absolute;
      top: 0;
      left: 60px;
      width: 400px;
      height: 100%;
      background-color: #f2f4f6;
      transform: translateX(-460px);
      transition: transform 0.3s;
      z-index: 98;

      &.open_meet_sider {
        transform: translateX(0);
      }
    }
  }
</style>


// WEBPACK FOOTER //
// src/components/common/meeting/MeetSider/meetSider.vue