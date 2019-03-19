<template>
  <!-- <div class="fixed_control">
    <div class="fiexd_content" v-if="showFixed">
      <div class="fiexd_content_hd">
        <i class="icon iconfont icon-menu_content_close" @click="closeNavContent()"></i>
      </div>
      <div class="fiexd_content_bd" v-if="showType==1">
        <div class="fiexd_content_bd_item">
          <h1>{{ $t('fixed.phoneTitle') }}</h1>
          <p>021-65650071-839</p>
        </div>
        <div class="fiexd_content_bd_item">
          <h1>{{ $t('fixed.emailTitle') }}</h1>
          <p>hi＃dync.cc（{{ $t('fixed.emailTip') }}）</p>
        </div>
        <div class="fiexd_content_bd_item">
          <h1>{{ $t('fixed.contactTitle') }}</h1>
          <p>{{ $t('fixed.contactBQQ') }}</p>
          <p>{{ $t('fixed.contactQQ') }}</p>
        </div>
      </div>
      <div class="fiexd_content_bd" v-if="showType==2">
        <div class="fiexd_content_bd_item">
          <h1>{{ $t('fixed.feedbackTitle') }}</h1>
        </div>
        <div class="fixed_advice_wrap" v-if="adviceStep == 1">
          <el-input
            class="fixed_advice"
            type="textarea"
            resize="none"
            :rows="5"
            :placeholder="$t('fixed.feedbackPlaceholder')"
            v-model="textAdvice">
          </el-input>
          <el-button class="fixed_advice_btn" type="primary" @click="submitAdvicce()">{{ $t('fixed.submmit') }}</el-button>
        </div>
        <div class="fixed_advice_wrap" v-if="adviceStep == 2">
          <p class="status"><i class="el-icon-success"></i></p>
          <p class="statusName">{{ $t('fixed.submitSuccess') }}!</p>
          <p class="statusTips">{{ $t('fixed.submitSuccessTip') }}</p>
          <div></div>
          <el-button class="fixed_advice_btn" type="primary" @click="reSubmitAdvicce()">{{ $t('fixed.feedbackAgain') }}</el-button>
        </div>
      </div>
    </div>
    <div class="fixed_meau">
      <div class="fixed_nav">
        <div class="fixed_nav_item" :class="showType==1 && 'active'" @click="switchNav(1)">
          <div class="fixed_nav_item_icon" @mouseover="contactHover=true" @mouseout="contactHover=false"><i v-if="!contactHover" class="icon iconfont icon-contact"></i><i v-if="contactHover" class="icon iconfont icon-contact_hover"></i></div>
        </div>
        <div class="fixed_nav_item" :class="showType==2 && 'active'" @click="switchNav(2)">
          <div class="fixed_nav_item_icon" @mouseover="adviceHover=true" @mouseout="adviceHover=false"><i v-if="!adviceHover" class="icon iconfont icon-advice"></i><i v-if="adviceHover" class="icon iconfont icon-advice_hover"></i></div>
        </div>
        <div class="fixed_nav_item">
          <div class="fixed_nav_item_icon" @mouseover="contentHover=true" @mouseout="contentHover=false"><a style="display:inline;color:#fff;" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2033817166&site=qq&menu=yes"><i v-if="!contentHover" class="icon iconfont icon-kefu_weixuan"></i><i v-if="contentHover" class="icon iconfont icon-kefuyixuan"></i></a></div>
        </div>
        <div class="fixed_nav_item" :class="showType==1 && 'active'" @click="switchNav(1)">
          {{ $t('fixed.contactMethod') }}
          <span class="fixed_nav_item_select"></span>
        </div>
        <div class="fixed_nav_item" :class="showType==2 && 'active'" @click="switchNav(2)">
          {{ $t('fixed.adviceFeedback') }}
          <span class="fixed_nav_item_select"></span>
        </div>
        <div class="fixed_nav_item fixed_contact_item">
          <a style="display:block;width:50px;height:50px;color:#fff;" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2033817166&site=qq&menu=yes">{{ $t('fixed.customer') }}</a>
        </div>
      </div>
    </div>
  </div> -->
  <div class="fixed_control">
    <div class="fixed_control_wrap">
      <div class="fiexd_content" v-if="showFixed">
        <div class="fiexd_content_hd">
          <i class="icon iconfont icon-menu_content_close" @click="closeNavContent()"></i>
        </div>
        <div class="fiexd_content_bd" v-if="showType==1">
          <div class="fiexd_content_bd_item">
            <h1>{{ $t('fixed.phoneTitle') }}</h1>
            <p>{{ $t('fixed.phoneTip') }}</p>
          </div>
          <div class="fiexd_content_bd_item">
            <h1>{{ $t('fixed.emailTitle') }}</h1>
            <p>hi＃dync.cc（{{ $t('fixed.emailTip') }}）</p>
          </div>
          <div class="fiexd_content_bd_item">
            <h1>{{ $t('fixed.contactTitle') }}</h1>
            <p>{{ $t('fixed.contactBQQ') }}</p>
          </div>
        </div>
        <div class="fiexd_content_bd" v-if="showType==2">
          <div class="fiexd_content_bd_item">
            <h1>{{ $t('fixed.feedbackTitle') }}</h1>
          </div>
          <div class="fixed_advice_wrap" v-if="adviceStep == 1">
            <el-input
              class="fixed_advice"
              type="textarea"
              resize="none"
              :rows="5"
              :placeholder="$t('fixed.feedbackPlaceholder')"
              v-model="textAdvice">
            </el-input>
            <el-button class="fixed_advice_btn" type="primary" @click="submitAdvicce()">{{ $t('fixed.submmit') }}</el-button>
          </div>
          <div class="fixed_advice_wrap" v-if="adviceStep == 2">
            <p class="status"><i class="el-icon-success"></i></p>
            <p class="statusName">{{ $t('fixed.submitSuccess') }}!</p>
            <p class="statusTips">{{ $t('fixed.submitSuccessTip') }}</p>
            <div></div>
            <el-button class="fixed_advice_btn" type="primary" @click="reSubmitAdvicce()">{{ $t('fixed.feedbackAgain') }}</el-button>
          </div>
        </div>
      </div>
      <div class="fixed_meau">
        <div class="fixed_nav">
          <div class="fixed_nav_item" :class="showType==1 && 'active'" @click="switchNav(1)">
            <div class="fixed_nav_item_icon" @mouseover="contactHover=true" @mouseout="contactHover=false"><i v-if="!contactHover" class="icon iconfont icon-contact"></i><i v-if="contactHover" class="icon iconfont icon-contact_hover"></i></div>
          </div>
          <div class="fixed_nav_item" :class="showType==2 && 'active'" @click="switchNav(2)">
            <div class="fixed_nav_item_icon" @mouseover="adviceHover=true" @mouseout="adviceHover=false"><i v-if="!adviceHover" class="icon iconfont icon-advice"></i><i v-if="adviceHover" class="icon iconfont icon-advice_hover"></i></div>
          </div>
          <div class="fixed_nav_item">
            <div class="fixed_nav_item_icon" @mouseover="contentHover=true" @mouseout="contentHover=false"><a style="display:inline;" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=2033817166&site=qq&menu=yes"><i v-if="!contentHover" class="icon iconfont icon-qq"></i><i v-if="contentHover" class="icon iconfont icon-qq_hover"></i></a></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'teameeting_fixed_content',
  data () {
    return {
      showFixed: false,
      showType: 0,      //0无  1联系方式 2意见反馈
      adviceStep: 1,
      textAdvice: '',

      contactHover: false,
      adviceHover: false,
      contentHover: false,
    }
  },
  mounted(){

  },
  methods: {
    switchNav (navIndex) {
      let that = this;

      that.showFixed = true;
      that.showType = navIndex;
    },
    closeNavContent () {
      this.showFixed = false;
      this.showType = 0;
    },
    submitAdvicce () {
      let that = this;

      that.$confirm('确认提交反馈吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        AX.post('users/user_advice', {
          "ad_content": that.textAdvice
        }).then(res => {
          let data = res.data;

          that.textAdvice = "";
          switch (data.code) {
            case 200:
              that.$message.success('提交成功');
              that.adviceStep = 2;
            break;
            case 600001:
              that.$message.error('提交失败，请稍后再试');
            break;
          }
        });
      });
    },
    reSubmitAdvicce () {
      let that = this;

      that.adviceStep = 1;
      that.textAdvice = "";
    }
  },
  destroyed () {
    
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang='scss'>
  .fixed_control {
    position: fixed;
    bottom: 0;
    right: 70px;
    z-index: 999;

    .fiexd_content {
      margin-bottom: 8px;
      padding: 28px 25px;
      width: 300px;
      background-color: #fff;
      box-shadow: 0 0 10px 0 #DDDDDD;
      @include borderBox;

      .fiexd_content_hd {
        position: absolute;
        top: 25px;
        right: 25px;

        .iconfont {
          cursor: pointer;
          color: #999;
        }
      }
      .fiexd_content_bd {
        width: 100%;
        .fiexd_content_bd_item {
          margin-bottom: 28px;
          line-height: 1;

          &:last-child {
            margin-bottom: 0;
          }

          h1 {
            margin-bottom: 14px;
            font-size: 18px;
            color: #333;
            user-select: none;
          }
          p {
            margin-bottom: 6px;
            font-size: 16px;
            color: $baseColor;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        
        .fixed_advice_wrap {

          .status {
            font-size: 44px;
            color: #00D33C;
            text-align: center;
            line-height: 1;
          }

          .statusName {
            margin-top: 14px;
            font-size: 18px;
            color: #666;
            text-align: center;
            line-height: 1;
          }

          .statusTips {
            margin-top: 12px;
            font-size: 14px;
            color: #bbb;
            text-align: center;
            line-height: 1;
          }

          .fixed_advice {
            margin-bottom: 12px;
            background-color: #FBFAFA;
            font-size: 14px;
            color: #bbb;
          }

          .fixed_advice_btn {
            margin-top: 16px;
            display: block;
            width: 100%;
          }
        }
      }
    }

    // .fixed_nav {
    //   width: 300px;
    //   height: 50px;
    //   font-size: 0;

    //   .fixed_nav_item {
    //     position: relative;
    //     display: inline-block;
    //     vertical-align: top;
    //     width: 125px;
    //     line-height: 50px;
    //     font-size: 16px;
    //     color: #fff;
    //     text-align: center;
    //     cursor: pointer;
    //     background-color: $blue;
    //     overflow: hidden;

    //     span {
    //       position: absolute;
    //       left: 50%;
    //       bottom: -2px;
    //       margin-left: -10px;
    //       width: 20px;
    //       height: 2px;
    //       background-color: #fff;

    //       -moz-transition: bottom .2s; /* Firefox 4 */
    //       -webkit-transition: bottom .2s; /* Safari 和 Chrome */
    //       -o-transition: bottom .2s; /* Opera */
    //       transition: bottom .2s;
    //     }

    //     &:hover,
    //     &.active {
    //       background-color: #3580FF;

    //       & > span {
    //         bottom: 7px;
    //       }
    //     }
    //   }
    //   .fixed_contact_item {
    //     width: 50px;
    //     background-color: #3580FF;
    //   }
    // }
    .fixed_meau {
      width: 300px;

      .fixed_nav {
        display: block;
        margin: 0 auto;
        width: 150px;
        height: 50px;
        font-size: 0;

        .fixed_nav_item {
          position: relative;
          display: inline-block;
          vertical-align: top;
          width: 50px;
          height: 50px;
          background-color: #4B9CF8;
          
          .fixed_nav_item_icon {
            width: 32px;
            height: 32px;
            margin: 9px auto;
            line-height: 32px;
            color: #fff;
            text-align: center;
            border-radius: 50%;
            background-color: #4B9CF8;
            cursor: pointer;

            &:hover {
              background-color: #3580FF;
            }
          }
          &.active > .fixed_nav_item_icon {
            background-color: #3580FF;
          }
        }
      }
    }
  }
</style> -->

<style scoped lang='scss'>
  .fixed_control {
    position: fixed;
    bottom: 100px;
    right: 24px;
    z-index: 999;
    
    .fixed_control_wrap {
      position: relative;

      .fiexd_content {
        position: absolute;
        right: 88px;
        margin-right: 8px;
        padding: 28px 25px;
        width: 300px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 #DDDDDD;
        @include borderBox;

        .fiexd_content_hd {
          position: absolute;
          top: 25px;
          right: 25px;

          .iconfont {
            cursor: pointer;
            color: #999;
          }
        }
        .fiexd_content_bd {
          width: 100%;
          .fiexd_content_bd_item {
            margin-bottom: 28px;
            line-height: 1;

            &:last-child {
              margin-bottom: 0;
            }

            h1 {
              margin-bottom: 14px;
              font-size: 18px;
              color: #333;
              user-select: none;
            }
            p {
              margin-bottom: 6px;
              font-size: 16px;
              color: $baseColor;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
          
          .fixed_advice_wrap {

            .status {
              font-size: 44px;
              color: #00D33C;
              text-align: center;
              line-height: 1;
            }

            .statusName {
              margin-top: 14px;
              font-size: 18px;
              color: #666;
              text-align: center;
              line-height: 1;
            }

            .statusTips {
              margin-top: 12px;
              font-size: 14px;
              color: #bbb;
              text-align: center;
              line-height: 1;
            }

            .fixed_advice {
              margin-bottom: 12px;
              background-color: #FBFAFA;
              font-size: 14px;
              color: #bbb;
            }

            .fixed_advice_btn {
              margin-top: 16px;
              display: block;
              width: 100%;
            }
          }
        }
      }

      .fixed_meau {

        .fixed_nav {
          display: block;
          margin: 0 auto;
          width: 80px;
          font-size: 0;

          .fixed_nav_item {
            position: relative;
            width: 80px;
            height: 80px;
            box-shadow: 0 2px 8px 0 #ccc;
            background-color: #fff;

            .fixed_nav_item_icon {
              position: relative;
              width: 100%;
              height: 100%;
              margin: 9px auto;
              line-height: 80px;
              text-align: center;
              cursor: pointer;

              .icon { font-size: 25px; color: #1275FF }
            }

            &:hover,
            &.active {
              background-color: #4B9CF8;
              color: #fff;

              .fixed_nav_item_icon {
                .icon {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>


// WEBPACK FOOTER //
// src/components/common/FixedContact.vue