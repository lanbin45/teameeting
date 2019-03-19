<template>
  <div class="app">
    <topnav></topnav>
  
    <div class="team_body">
      <section class="team_banner">
        <!-- <slideshow ref="slideshow" :slideData="slideList"></slideshow> -->
        <div class="slideshow">
          <div class="slide_wrap" ref="slideshow">
            <div class="slideshow_item">
              <div class="section_container">
                <div class="slideshow_table">
                  <!--  -->
                  <div class="slideshow_table_cell text_table_cell">
                    <h1 class="slideshow_item_title">快捷免费的Web视频会议</h1>
                    <h1 class="slideshow_item_title">随时随地，一键开启</h1>
                    <p class="slideshow_item_subtitle">无需下载安装，无需注册登录。支持Chrome、FireFox、Safari、QQ等主流浏览器</p>
                    <!-- <a class="slideshow_item_btn">{{ 3 }} </a> -->
                  </div>
                  <!--  -->
                  <div class="slideshow_table_cell small_table_cell">
                    <div class="join_area">
                      <div class="join_panel">
                        <div class="join_box">
                          <div class="join_tab">
                            <ul class="join_list">
                              <li :class="['join_tab_item', {'active': joinType === 'start' }]" @click="joinType = 'start'">快速主持视频会议</li>
                              <li :class="['join_tab_item', {'active': joinType === 'join' }]" @click="joinType = 'join'">快速加入会议</li>
                            </ul>
                          </div>
                          <div class="join_tab_content">
                            <div class="join_tab_item_content" v-if="joinType === 'start'">
                              <div class="tab_content_bd">
                                <img src="/static/images/home_banner_start.png" alt="">
                              </div>
                              <div class="tab_content_ft">
                                <a href="javascript:;" class="meet_btn" @click="startMeet">立刻主持会议</a>
                              </div>
                            </div>
                            <div class="join_tab_item_content" v-if="joinType === 'join'">
                              <div class="tab_content_bd">
                                <div class="join_form">
                                  <div class="join_form_item">
                                    <el-input v-model="meetId" placeholder="请输入会议室的id号" auto-complete="off" autocomplete="off" :maxlength="9"></el-input><!--  @blur="searchMeetInfo(meetId)" -->
                                  </div>
                                  <div class="join_form_item" ref="meetId" v-show="needPwd">
                                    <el-input v-model="meetPwd" ref="meetPwd" type="password" autocomplete="off" auto-complete="off" placeholder="请输入会议密码"></el-input>
                                  </div>
                                </div>
                              </div>
                              <div class="tab_content_ft">
                                <a href="javascript:;" class="meet_btn" @click="joinMeet">立刻加入会议</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--  -->
      <div class="project_feature">
        <div class="base_container">
          <ul class="project_list">
            <li class="clearfix">
              <div class="project_feature_icon"><i class="icon iconfont icon-canhuirenyuan"></i></div>
              <div class="project_feature_textarea">
                <p>{{ $t('project.meet.feature.quickly.title') }}</p>
                <small>{{ $t('project.meet.feature.quickly.subTitle') }}</small>
              </div>
            </li>
            <li class="clearfix">
              <div class="project_feature_icon"><i class="icon iconfont icon-lianmai"></i></div>
              <div class="project_feature_textarea">
                <p>{{ $t('project.meet.feature.noExpand.title') }}</p>
                <small>{{ $t('project.meet.feature.noExpand.subTitle') }}</small>
              </div>
            </li>
            <li class="clearfix">
              <div class="project_feature_icon"><i class="icon iconfont icon-kehuduan"></i></div>
              <div class="project_feature_textarea">
                <p>{{ $t('project.meet.feature.multiData.title') }}</p>
                <small>{{ $t('project.meet.feature.multiData.subTitle') }}</small>
              </div>
            </li>                 
          </ul>
        </div>
      </div>
      <!-- 功能 -->
      <section class="team_section">
        <div class="project_section_bg"></div>
        <div class="section_container">
          <h1 class="section_title">{{ $t('home.feature.meet.featureTitle') }}</h1>

          <div class="section_content team_featute">
            <div class="team_featute_content">
              <ul class="team_featute_list">
                <li>
                  <div class="feature_introduce feature_HD">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon crossPlatform"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.crossPlatform.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.crossPlatform.subscript') }}</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="feature_introduce feature_line">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon free"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.free.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.free.subscript') }}</p>
                      </div>
                    </div>
                    <div class="feature_mask"></div>
                  </div>
                </li>
                <li>
                  <div class="feature_introduce feature_doc">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon easy"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.easy.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.easy.subscript') }}</p>
                      </div>
                    </div>
                    <div class="feature_mask"></div>
                  </div>
                </li>
                <li>
                  <div class="feature_introduce feature_desktop">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon shareScreen"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.shareScreen.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.shareScreen.subscript') }}</p>
                      </div>
                    </div>
                    <div class="feature_mask"></div>
                  </div>
                </li>
                <li>
                  <div class="feature_introduce feature_cdn">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon shareDoc"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.shareDoc.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.shareDoc.subscript') }}</p>
                      </div>
                    </div>
                    <div class="feature_mask"></div>
                  </div>
                </li>
                <li>
                  <div class="feature_introduce feature_cdn">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon manage"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.manage.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.manage.subscript') }}</p>
                      </div>
                    </div>
                    <div class="feature_mask"></div>
                  </div>
                </li>
                <li>
                  <div class="feature_introduce feature_cdn">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon module"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.module.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.module.subscript') }}</p>
                      </div>
                    </div>
                    <div class="feature_mask"></div>
                  </div>
                </li>
                <li>
                  <div class="feature_introduce feature_cdn">
                    <div class="feature_popout_wrap">
                      <div class="feature_icon statistical"></div>
                      <div class="feature_textarea">
                        <h3 class="feature_introduce_title">{{ $t('home.feature.meet.statistical.title') }}</h3>
                        <p class="feature_introduce_desc">{{ $t('home.feature.meet.statistical.subscript') }}</p>
                      </div>
                    </div>
                    <div class="feature_mask"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- -->
          <div class="section_footer">
          <!--  <a href="javascript:;" style="color: #238aff;font-size: 20px;">了解 企业版Teameeting ></a> -->
          </div>
        </div>
      </section>
      <!-- 场景 -->
      <section class="team_section">
        <div class="section_container">
          <h1 class="section_title">{{ $t('scene.meet.title') }}</h1>

          <div class="team_featute">
            <div class="team_featute_content">

              <div class="project_introduce_section">
                <!-- 场景列表 -->
                <div class="project_scene">
                  <ul class="project_scene_list">
                    <li :class="['scene_item', {'active': translateX==0}]" @mouseover="handleScene(0)">{{ $t('scene.meet.meeting.label') }}</li>
                    <li :class="['scene_item', {'active': translateX=='-100%'}]" @mouseover="handleScene('-100%')">{{ $t('scene.meet.OA.label') }}</li>
                    <li :class="['scene_item', {'active': translateX=='-200%'}]" @mouseover="handleScene('-200%')">{{ $t('scene.meet.interview.label') }}</li>
                    <li :class="['scene_item', {'active': translateX=='-300%'}]" @mouseover="handleScene('-300%')">{{ $t('scene.meet.smallClass.label') }}</li>
                    <li :class="['scene_item', {'active': translateX=='-400%'}]" @mouseover="handleScene('-400%')">{{ $t('scene.meet.command.label') }}</li>
                  </ul>
                  <!-- 场景介绍 -->
                  <div class="project_scene_content" ref="scenes">
                    <div class="project_scene_content_item clearfix">
                      <div class="project_sence_introduce">
                        <div class="m-table">
                          <div class="m-table-cell">
                            <div class="project_sence_introduce_textarea">
                              <h2 class="project_sence_introduce_title">{{ $t('scene.meet.meeting.title') }}</h2>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.meeting.sub1') }}</p>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.meeting.sub2') }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="project_sence_pic meeting">
                        
                      </div>
                    </div>

                    <div class="project_scene_content_item clearfix">
                      <div class="project_sence_introduce">
                        <div class="m-table">
                          <div class="m-table-cell">
                            <div class="project_sence_introduce_textarea">
                              <h2 class="project_sence_introduce_title">{{ $t('scene.meet.OA.title') }}</h2>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.OA.sub1') }}</p>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.OA.sub2') }}</p>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.OA.sub3') }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="project_sence_pic OA">
                        
                      </div>
                    </div>

                    <div class="project_scene_content_item clearfix">
                      <div class="project_sence_introduce">
                        <div class="m-table">
                          <div class="m-table-cell">
                            <div class="project_sence_introduce_textarea">
                              <h2 class="project_sence_introduce_title">{{ $t('scene.meet.interview.title') }}</h2>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.interview.sub1') }}</p>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.interview.sub2') }}</p>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.interview.sub3') }}</p>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.interview.sub4') }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="project_sence_pic interview">
                        
                      </div>
                    </div>

                    <div class="project_scene_content_item clearfix">
                      <div class="project_sence_introduce">
                        <div class="m-table">
                          <div class="m-table-cell">
                            <div class="project_sence_introduce_textarea">
                              <h2 class="project_sence_introduce_title">{{ $t('scene.meet.smallClass.title') }}</h2>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.smallClass.sub1') }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="project_sence_pic small_class">
                        
                      </div>
                    </div>

                    <div class="project_scene_content_item clearfix">
                      <div class="project_sence_introduce">
                        <div class="m-table">
                          <div class="m-table-cell">
                            <div class="project_sence_introduce_textarea">
                              <h2 class="project_sence_introduce_title">{{ $t('scene.meet.command.title') }}</h2>
                              <p class="project_sence_introduce_desc">{{ $t('scene.meet.command.sub1') }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="project_sence_pic command">
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- -->
          <div class="section_footer">
          <!--  <a href="javascript:;" style="color: #238aff;font-size: 20px;">了解 企业版Teameeting ></a> -->
          </div>
        </div>
      </section>
    </div>
    <AppFixed></AppFixed>
    <AppFooter></AppFooter>
  </div>
</template>

<script>
  import topnav from '@/components/common/TeamTopnav'
  import slideshow from '@/components/common/home/slideshow'
  import { Base64 } from '@/assets/utils/utils';
  
  export default {
    name: 'meet',
    data () {
      return {
        joinType: 'start',
        needPwd: false,
        meetId: '',
        meetPwd: '',
        encodePwd: '',
        
        translateX: 0,
        slideList: [
          {
            title: {
              text: 'slideshow.slide1.title',//国际化文件中的索引
              gradient: {
                enabled: true,//是否需要渐变
                from: '#22BBFF',
                to: '#4CEBC2'
              },
              color: ''//如果gradient.enabled为true时不生效
            },
            subTitle: {
              enabled: true,//是否需要副标题
              text: 'slideshow.slide1.subTitle',
              color: '#26C6FF'
            },
            bgUrl: '/static/images/banner/bg.jpg',//url或绝对定位
          },
          {
            title: {
              text: 'slideshow.slide2.title',//国际化文件中的索引
              gradient: {
                enabled: false,//是否需要渐变
                from: '#22BBFF',
                to: '#4CEBC2'
              },
              color: '#111'//如果gradient.enabled为true时不生效
            },
            subTitle: {
              enabled: true,//是否需要副标题
              text: 'slideshow.slide2.subTitle',
              color: '#666'
            },
            bgUrl: '/static/images/banner/bg1.jpg',//url或绝对定位
          }
        ]
      }
    },

    components: {
      topnav,
      slideshow
    },

    computed: {},

     watch: {
      meetId (val) {
        let that = this;
        
        that.$nextTick(() => {
          that.meetId = val.replace(/\s/g,'').replace(/\D/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
          
          switch (that.meetId.replace(/\s/g, "").length) {
            case 8:
              //查询
              that.searchMeetInfo(that.meetId);
            break;
            default:
              that.needPwd = true && (that.needPwd = false);
            break;
          }
        });
      },
      meetPwd (val) {
        let that = this;

        if (val === "") {
          that.encodePwd = "";
          return
        }
        that.encodePwd = Base64.encode(val);
      }
    },

    mounted () {},

    methods: {
      handleScene (n) {
        this.translateX = n;
        this.$refs.scenes.style.transform = "translateX(" + n +")";
      },
      searchMeetInfo (meetId) {
        let that = this;
        
        let mId = meetId.replace(/\s/g, "");
        AX.post('meetings/get_simple_meeting_info', {
          meetingid: mId
        }).then(res => {
          let data = res.data;
          
          switch (data.code) {
            case 200:
              let meetInfo = data.meetinginfo;
              let limitType = meetInfo.m_limit_type;
              let meetState = meetInfo.m_state;// -1/0/1/2:已删除/正常状态未开启/进行中/已结束
              // let meetLock = meetInfo.m_is_lock;// 0/1:不加锁/加锁
            
              limitType == 1 && (that.needPwd = true);
              break;
            case 100013:
              that.$message.error('该会议不存在！');
              break;
            case 500001:
              that.$message.error('接口调用频繁');
              break;
            default:
              that.needPwd = true && (that.needPwd = false);
              break;
          }
        }).catch(err => {

        });
      },
      startMeet () {
        let that = this;
        
        AX.post('meetings/quick_meeting').then(res => {
          let data = res.data;
          
         switch (data.code) {
          case 200:
            let MInfo = data.meetinginfo;
            that.$router.push({
              path: `/room/${MInfo.m_anyrtcid}`
            });
            break;
          case 500001:
            that.$message.error('接口调用频繁');
            break;
          default:
            that.$message.error('创建会议失败');
            break;
          }
        }).catch(err => {

        });
      },
      joinMeet () {
        let that = this;
        let MId = that.meetId.replace(/\s/g, "");

        if (MId.length !== 8) {
          that.$message.error('会议不存在');
        } else {
          if (that.needPwd && that.meetPwd == "") {
            that.$message.error('请输入会议密码');
            that.$refs.meetPwd.focus();
            return
          }
          AX.post('meetings/get_meeting_info', {
            meetingid: MId,
            meeting_password: that.encodePwd
          }).then(res => {
            let data = res.data;
            
            switch (data.code) {
              case 200:
                let MInfo = data.meetinginfo;

                if (MInfo.m_is_lock == 1) {//上锁
                  that.$message.error('该会议已上锁');
                }
                
                that.$router.push({
                  path: `/room/${MId}/`,
                  query: {
                    pwd: that.encodePwd
                  }
                });
                break;
              case 100013:
                that.$message.error('会议不存在');
                that.meetId = "";
                that.$refs.meetId.focus();
                break;
              case 100014:
                that.$message.error('会议密码错误');
                that.meetPwd = "";
                that.$refs.meetPwd.focus();
                break;
              case 500001:
                that.$message.error('接口调用频繁');
                break;
            }
          }).catch(err => {

          });
        }
      },
    
    }
  }

</script>

<style lang=scss scoped>
  @import '../../scss/home.scss';

  .slideshow_item {
    background-image: url('/static/images/home_banner.jpg');
    background-position: center;
    background-size: cover;
  }

  .base_meeting_btn {
    background: -webkit-linear-gradient(left, #FC743E, #FB4466); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #FC743E, #FB4466); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #FC743E, #FB4466); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #FC743E, #FB4466); /* 标准的语法 */
  }

  .text_table_cell {
    width: 60%;
  }

  .small_table_cell {
    width: 40%;
  }

  .join_area {
    margin-right: 10px;
    width: 390px;
    box-sizing: border-box;
    border: 5px solid rgba(255, 255, 255, .4);

    .join_panel {
      padding: 50px;
      width: 100%;
      background-color: #fff;
      box-sizing: border-box;

      .join_box {
        width: 100%;
        height: 100%;

        .join_tab {
          margin-bottom: 50px;
          width: 100%;

          .join_list {
            display: table;
            width: 100%;

            .join_tab_item {
              position: relative;
              display: table-cell;
              width: 50%;
              font-size: 16px;
              color: #aaa;
              cursor: pointer;
              user-select: none;
              
              &.active {
                color: #4386FB;

                &::after {
                  content: "";
                  display: block;
                  width: 24px;
                  border-bottom: 2px solid #4386FB;
                  position: absolute;
                  bottom: -10px;
                  left: 50%;
                  transform: translateX(-50%);
                }
              }
            }
          }
        }
        /*  */
        .join_tab_content {

          .join_tab_item_content {

            .tab_content_bd {
              height: 102px;
            }
            
            .tab_content_ft {
              margin-top: 40px;
              .meet_btn {
                width: 100%;
                box-sizing: border-box;
              }
            }
          }
        }
      }
    }
  }

  .join_form {
    padding-top: 10px;

    .join_form_item {
      margin-bottom: 14px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  //
  .project_feature {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #eee;
    
    .project_list {
      width: 100%;
      font-size: 0;

      &>li {
        display: inline-block;
        vertical-align: top;
        width: 33.33%;
        height: 38px;
        margin: 21px 0;
        
        .project_feature_icon {
          margin-right: 14px;
          float: left;

          .icon {
            font-size: 28px;
            color: #3158FF;
            line-height: 38px;
          }
        }
        .project_feature_textarea {
          p {
            margin-bottom: 6px;
            font-size: 18px;
            line-height: 1;
            color: $h2Color;
          }
          small {
            font-size: 14px;
            line-height: 1;
            color: $tipColor;
          }
        }
      }
    }
  }

  .project_introduce_section {
    position: relative;
    width: 100%;

    .project_sence_wrap {
      padding: 50px 0;
    }

    .project_sence_introduce {
      width: 470px;
      height: 300px;

      .project_sence_introduce_textarea {
        text-align: left;
        .project_sence_introduce_title {
          margin-bottom: 42px;
          font-size: 34px;
          line-height: 1;
        }
        .project_sence_introduce_desc {
          margin-bottom: 9px;
          font-size: 18px;
          line-height: 1;
        }
      }
    }

    .project_sence_pic {
      width: 540px;
      height: 300px;
      user-select: none;
      border-radius: 5px;
      overflow: hidden;
      background-image: url("/static/images/meet_scene_sprite.jpg");

      &.meeting {
        background-position: 0 0;
      }
      &.OA {
        background-position: -540px 0;
      }

      &.interview {
        background-position: -1080px 0;
      }

      &.small_class {
        background-position: -1620px 0;
      }

      &.command {
        background-position: -2160px 0;
      }
    }

    &:nth-child(odd) {//奇数
      .project_sence_pic {
        float: right;
      }
      .project_sence_introduce {
        float: left;
      }
    }
    &:nth-child(even) {//偶数
      .project_sence_pic {
        float: left;
      }
      .project_sence_introduce {
        float: right;
      }
    }
  }

  .project_scene {
    text-align: center;
    overflow: hidden;

    .project_scene_list {
      display: inline-block;
      margin-bottom: 50px;
      user-select: none;

      & > li {
        position: relative;
        margin-right: 50px;
        display: inline-block;
        vertical-align: top;
        font-size: 16px;
        cursor: pointer;
        
        &:last-child {
          margin-right: 0;
        }
        
        &.active,
        &:hover {
          color: #4484FB;

          &:after {
            position: absolute;
            bottom: -6px;
            left: 50%;
            content: "";
            display: block;
            width: 22px;
            border-bottom: 2px solid #4484FB;
            transform: translateX(-50%);
          }
        }
      }
    }

    .project_scene_content {
      position: relative;
      width: 100%;
      height: 100%;
      white-space: nowrap;
      font-size: 0;
      transition: all 500ms linear;

      & > .project_scene_content_item {
        display: inline-block;
        vertical-align: top;
        width: 100%;

        .project_sence_introduce_title {
          margin-bottom: 23px;
          font-size: 24px;
          color: #333;
        }
        .project_sence_introduce_desc {
          margin-bottom: 6px;
          font-size: 14px;
          color: #999;
        }
      }
    }
  }

  
</style>


// WEBPACK FOOTER //
// src/components/pages/Meet.vue