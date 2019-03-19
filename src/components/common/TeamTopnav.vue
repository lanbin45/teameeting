<template>
  <div class="topnav" :class="isScroll && 'scroll'">
    <div class="top_nav_container clearfix">
      <!-- 左边导航 -->
      <div class="left_nav">
        <!-- <a href="/" class="logo_area"> -->
        <router-link :to="{'path': '/'}" class="logo_area">
          <img v-if="isScroll" class="" src="/static/images/logo.png" alt="Teameeting Logo">
          <img v-else class="" src="/static/images/logo_bai.png" alt="Teameeting Logo">
        </router-link>
        <!-- </a> -->
      </div>
      <!-- 右边导航 -->
      <div class="right_nav">
        <ul class="right_nav_list">
          <!-- <li v-if="$route.fullPath.indexOf('join') == -1"><router-link :to="{'path': '/join'}">{{ $t('header.join') }}</router-link></li> -->
          <!-- <li v-if="ssuc"><router-link :to="{'path': '/console/appointment'}">{{ $t('header.appointerment') }}</router-link></li> -->
          <li>
            <template v-if="!ssuc">
              <!-- <a class="signin_btn" href="/signin">{{ $t('header.signin') }}</a> -->
              <!-- <a class="signup_btn" href="/signup">{{ $t('header.signup') }}</a> -->
              <router-link :style="{'margin-right': '10px'}" :to="{'path': '/signin'}">{{ $t('header.signin') }}</router-link>
              <router-link :style="{'margin-left': '10px'}" :to="{'path': '/signup'}">{{ $t('header.signup') }}</router-link>
            </template>
            <template v-else>
              <!-- <a class="user_select" href="/console"> -->
              <router-link class="user_select" :to="{'path': '/console'}">
                <img class="user_icon" :src="userInfo.userIcon ? userInfo.userIcon : 'http://oss.teameeting.cn/teameeting/header.png'" alt="">
                <div class="account_info">
                  <div class="account_info_box">
                    <div class="account_info_hd">
                      <p>{{ userInfo.userNickName }}</p>
                      <router-link :to="{'path': '/console'}" target="_blank">
                        <small class="account_info_account">{{ userInfo.userAccount }}</small>
                      </router-link>
                      <!-- <a href="/console" target="_blank"><small class="account_info_account">{{ userInfo.userAccount }}</small></a> -->
                    </div>
                    <div class="account_info_bd">
                      <ul class="account_controls">
                        <li>
                          <router-link class="account_controls_item" :to="{'path': '/console/account'}">
                            <i class="icon iconfont icon-menu_setting"></i> {{ $t('header.account') }}
                          </router-link>
                          <!-- <a class="account_controls_item" href="/console/account">
                            <i class="icon iconfont icon-menu_setting"></i> {{ $t('header.account') }}
                          </a> -->
                        </li>
                        <li>
                          <a class="account_controls_item" href="javascript:void(0);" @click="signOut()">
                            <i class="icon iconfont icon-meet_leave"></i> {{ $t('header.signout') }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              <!-- </a> -->
              </router-link>
            </template>
          </li>
        </ul>
      </div>
      <!-- 导航区 -->
      <div class="main_nav">
        <div class="main_nav_content">
          <ul class="main_nav_list">
            <li>
              <router-link :class="{'active': $route.fullPath === '/'}" :to="{'path': '/'}">{{ $t('homeNav.meet') }}
                <span></span>
              </router-link>
            </li>
            <li>
              <router-link :class="{'active': $route.fullPath.indexOf('live')!== -1}" :to="{'path': '/live'}">{{ $t('homeNav.live') }}
                <span></span>
              </router-link>
            </li>
            <!-- <li>
              <a href="javascript:void(0);" :class="['main_nav_project', {'active': $route.fullPath.indexOf('base_meeting')!== -1 || $route.fullPath.indexOf('line_meeting')!== -1}]">{{ $t('homeNav.product') }}<span></span>
                <div class="sys_select_dropdown">
                  <ul>
                    <li class="sys_select_dropdown_item"><router-link :to="{'path': '/base_meeting'}">{{ $t('meeting.basicMeet') }}</router-link></li>
                    <li class="sys_select_dropdown_item"><router-link :to="{'path': '/line_meeting'}">{{ $t('meeting.lineMeet') }}</router-link></li>
                  </ul>
              </div>
              </a>
            </li>
            <li><router-link :class="{'active': $route.fullPath.indexOf('server')!== -1}" :to="{'path': '/server'}">{{ $t('homeNav.server') }}<span></span></router-link></li>
            <li><router-link :class="{'active': $route.fullPath.indexOf('download')!== -1}" :to="{'path': '/download'}">{{ $t('homeNav.download') }}<span></span></router-link></li>
            <li><router-link :class="{'active': $route.fullPath.indexOf('about')!== -1}" :to="{'path': '/about'}">{{ $t('homeNav.about') }}<span></span></router-link></li> -->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      isScroll: false,
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
      ssuc: 'getSsuc'
    }),
  },
  mounted () {
    let that = this;
      
    /*注册事件*/
    if(document.addEventListener){
      document.addEventListener('DOMMouseScroll', that.scrollFunc,false);
    }//W3C
    window.onmousewheel=document.onmousewheel = that.scrollFunc;//IE/Opera/Chrome
    that.scrollFunc();

    document.onkeyup = (e) => {
      switch (e.keyCode) {
        case 35://End
          that.isScroll = true;
          break;
        case 36://Home
          that.isScroll = false;
          break;
      }
    };
  },
  methods:{
    scrollFunc (e) {
      e = e || window.event;

      let that = this;
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      
      if (scrollTop > 100) {
        that.isScroll = true;
      } else {
        that.isScroll = false;
      }
    },
    signOut () {
      let that = this;

      that.$confirm('确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        AX.post('users/signout').then(res=> {
          let data = res.data;
          if (data.code === 200) {
              that.$emit('signout');
              that.$store.dispatch('clearUserInfo');
              that.$router.go(0);
              // window.location.reload();
          } else {

          }
        });
      });
    }
  },

  destroyed () {
    let that = this;
    
    /*注册事件*/
    if(document.removeEventListener){
      document.removeEventListener('DOMMouseScroll', that.scrollFunc,false);
    }//W3C
    window.onmousewheel=document.onmousewheel = null;//IE/Opera/Chrome
      
    document.onkeyup = null;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>

  .topnav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 999;
    transition: all .48s;

    .top_nav_container {
      margin-left: auto;
      margin-right: auto;
      width: $maxWidth;
      height: 100%;

      .left_nav {
        float: left;
        width: 240px;

        .logo_area {
          display: inline-block;
          vertical-align: top;
          font-size: 0;
          margin: 15px 0;
        }
      }

      .right_nav {
        float: right;
        width: 240px; 
        height: 60px;
        .right_nav_list {
          width: 100%;
          height: 60px;
          font-size: 0;
          text-align: right;
          
          &>li {
            display: inline-block;
            vertical-align: top;
            margin-right: 20px;
            font-size: 16px;
            user-select: none;
            &:last-child {
              margin-right: 0;
            }
            &>a {
              line-height: 60px;
              color: #fff;
              z-index: 991;

              &.signin_btn {
                margin-right: 10px;
                padding: 8px 19px;
              }
              &.signup_btn {
                margin-right: 20px;
              }

              &.user_select {
                position: relative;
                .user_icon {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  border: 1px solid #ddd;
                  vertical-align: middle;
                }
                .account_info {
                  display: none;
                  position: absolute;
                  top: 23px;
                  right: 0;
                  padding-top: 30px;
                  width: 200px;
                  text-align: left;
                  @include borderBox;
                  z-index: 900;

                  &:hover {
                    & {
                      display: block;
                    }
                  }

                  .account_info_box {
                      position: relative;
                      padding: 4px;
                      background-color: #fff;
                      border: 1px solid #dddddd;
                      @include borderBox;
                  
                      .account_info_hd,
                      .account_info_bd {
                          width: 100%;

                      }

                      .account_info_hd {
                          padding: 10px 18px;
                          line-height: 1;
                          @include borderBox;

                          p {
                              margin-bottom: 10px;
                              font-size: 16px;
                              color: $baseColor;
                          }
                          .account_info_account {
                              font-size: 12px;
                              color: #999;
                              text-decoration: underline;
                          }
                      }

                      .account_info_bd {
                          border-top: 1px solid #dddddd;

                          & > .account_controls {
                              margin-top: 4px;
                              width: 100%;

                              & > li {
                                  width: 100%;
                                  
                                  .account_controls_item {
                                      display: inline-block;
                                      padding: 0 18px;
                                      width: 100%;
                                      @include borderBox;

                                      &:hover {
                                          background-color: #f0f0f0;
                                      }
                                      & > .icon {
                                          margin-right: 10px;
                                      }
                                  }
                              }
                          }
                      }
                  }
                }
                &:hover {
                  .account_info {
                    display: block;
                  }
                }
              }
            }
          }
        }
      }

      .main_nav {
        margin-left: 240px;
        margin-right: 240px;
        height: 100%;

        .main_nav_content {
          width: 100%;
          height: 100%;
          
          .main_nav_list {
            height: 100%;
            text-align: center;

            &>li {
              display: inline-block;
              vertical-align: top;
              margin-left: 20px;
              margin-right: 20px;

              &>a {
                position: relative;
                font-size: 16px;
                color: #fff;
                line-height: 60px;

                &.main_nav_project:hover {
                  .sys_select_dropdown {
                    display: block;
                  }
                }

                &.active,
                &:hover {
                  color: #fff;

                  span {
                    display: block;
                    width: 28px;
                    height: 2px;
                    background-color: #fff;
                    position: absolute;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .topnav.scroll {
    background-color: #fff;
    box-shadow: 0 1px 6px 0 #eee;
    .main_nav {
      .main_nav_content {
        .main_nav_list>li>a {
          color: $h2Color;

          &.active,
          &:hover {
            color: #356EFF;

            &>span {
              background-color: #356EFF;
            }
          }
        }
      }
    }
    .right_nav {
      .right_nav_list {
        &>li {
          &>a {
            color: $h2Color;

            &.signin_btn:hover {
              color: #fff;
              border-radius: 19px;
              box-shadow: 0 2px 6px 0px rgba(14, 49, 189, .43);
              background: -webkit-linear-gradient(left, #3EAFFC, #4482FB); /* Safari 5.1 - 6.0 */
              background: -o-linear-gradient(right, #3EAFFC, #4482FB); /* Opera 11.1 - 12.0 */
              background: -moz-linear-gradient(right, #3EAFFC, #4482FB); /* Firefox 3.6 - 15 */
              background: linear-gradient(to right, #3EAFFC, #4482FB); /* 标准的语法 */
            }
          }
        }
      }
    }
  }

  .sys_select_dropdown {
    position: absolute;
    display: none;
    top: 20px;
    left: 50%;
    width: 150px;
    padding: 30px 0 10px;
    transform: translateX(-50%);
    
    ul {
      width: 100%;
      box-shadow: 0 2px 6px 0px rgba(140,140,140,0.27);

      .sys_select_dropdown_item {      
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #666;
        background-color: #fff;
        cursor: pointer;
        text-align: center;

        & >>> a {
          display: block;
          width: 100%;
          height: 100%;
        }

        &.active,
        &:hover {
          color: #3FAAFC;
          background-color: #EDF5FF;
        }
      } 
    }
  }
</style>
<style lang="scss">
  .project_drowdown {
    position: relative;
    font-size: 16px;
    color: #B6B7BA;
    line-height: 60px;
    font-weight: 600;

    .sys_select_label,
    .sys_select_icon {
      color: #B6B7BA;
    }
  }
</style>



// WEBPACK FOOTER //
// src/components/common/TeamTopnav.vue