import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//首页
// const TeamIndex = resolve => require(['@/components/pages/Home.vue'], resolve)
const TeamIndex = resolve => require(['@/components/pages/Meet.vue'], resolve)
//互动直播
const TeamLineLive = resolve => require(['@/components/pages/LineMeet.vue'], resolve)
//视频会议
const TeamMeetIndex = resolve => require(['@/components/pages/ProjectService/Index.vue'], resolve)
const TeamMeet = resolve => require(['@/components/pages/ProjectService/Meet.vue'], resolve)
//连麦会议
const TeamLineMeet = resolve => require(['@/components/pages/ProjectService/lineMeet.vue'], resolve)
//购买服务
const TeamBuyServer = resolve => require(['@/components/pages/BuyServer.vue'], resolve)
//下载中心
const TeamDownload = resolve => require(['@/components/pages/Download.vue'], resolve)
//关于我们
const TeamAbout = resolve => require(['@/components/pages/About.vue'], resolve)
//加入会议
const TeamJoin = resolve => require(['@/components/pages/JoinMeet.vue'], resolve)
//帮助中心
const TeamHelp = resolve => require(['@/components/pages/Help.vue'], resolve)
//注册
const TeamRegister = resolve => require(['@/components/pages/Signup.vue'], resolve)
//登陆
const TeamLogin = resolve => require(['@/components/pages/Signin.vue'], resolve)
//找回密码
const TeamFindPsw = resolve => require(['@/components/pages/FindPwd.vue'], resolve)
const FindByEmail = resolve => require(['@/components/common/findPwd/findEmail.vue'], resolve)
const FindByPhone = resolve => require(['@/components/common/findPwd/findPhone.vue'], resolve)
//后台
const ConsoleRouter = resolve => require(['@/components/pages/Console/router.vue'], resolve)
const ConsoleIndex = resolve => require(['@/components/pages/Console/Index.vue'], resolve)
//预约会议
const Appointment = resolve => require(['@/components/pages/Console/appointment.vue'], resolve)
//会议统计
const Statistics = resolve => require(['@/components/pages/Console/statistics.vue'], resolve)
//会议文件管理
const DocsManagement = resolve => require(['@/components/pages/Console/docs.vue'], resolve)
//会议统计总览
const StatisticsDashboard = resolve => require(['@/components/common/statistics/statisticsDashboard.vue'], resolve)
//会议统计详情
const StatisticsInfo = resolve => require(['@/components/common/statistics/statisticsInfo.vue'], resolve)
//会议
const TeamMeeting = resolve => require(['@/components/pages/Meeting/TeamMeeting.vue'], resolve)
const TeamMeeting1 = resolve => require(['@/components/pages/Meeting/MeetRoom.vue'], resolve)
//会议分享
const TeamShareMeeting = resolve => require(['@/components/pages/Share/share.vue'], resolve)
//个人中心
const AccountCenter = resolve => require(['@/components/pages/Console/account.vue'], resolve)

const AccountBasicInfo = resolve => require(['@/components/common/account/accountInfo.vue'], resolve)
const AccountMeetingSetting = resolve => require(['@/components/common/account/meetingSetting.vue'], resolve)
const accountSecurity = resolve => require(['@/components/common/account/accountSecurity.vue'], resolve)

export default new Router({
  mode: "history",
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
	routes: [
    {
      path: '/',
      name: 'home',
      component: TeamIndex
    },
    {
      path: '/live',
      name: 'live',
      component: TeamLineLive
    },
    {
      path: '/project',
      // name: 'meetingProject',
      component: TeamMeetIndex,
      children: [
        {
          path: '/base_meeting',
          name: 'baseMeeting',
          component: TeamMeet
        },
        {
          path: '/line_meeting',
          name: 'lineMeeting',
          component: TeamLineMeet
        }
      ]
    },
    {
      path: '/server',
      name: 'meetingBuyServer',
      component: TeamBuyServer
    },
    {
      path: '/download',
      name: 'meetingDownload',
      component: TeamDownload
    },
    {
      path: '/about',
      name: 'meetingAbout',
      component: TeamAbout
    },
    {
      path: '/join',
      name: 'meetingJoin',
      component: TeamJoin
    },
    // {
    //   path: '/room/:id',
    //   name: 'meetingRoom',
    //   meta: {
    //     verify: true
    //   },
    //   component: TeamMeeting
    // },
    {
      path: '/room/:id',
      name: 'meetingRoom',
      meta: {
        verify: true
      },
      component: TeamMeeting1
    },
    {
      path: '/share/:id',
      name: 'meetingShare',
      component: TeamShareMeeting
    },
    {
      path: '/help',
      name: 'meetingHelp',
      component: TeamHelp
    },
    {
      path: '/signup',
      name: 'register',
      component: TeamRegister
    },
    {
      path: '/signin',
      name: 'login',
      component: TeamLogin
    },
    {
      path: '/findPwd',
      name: 'findPsw',
      component: TeamFindPsw
    },
    {
      path: '/console',
      // name: 'console',
      meta: {
        check: true
      },
      component: ConsoleRouter,
      children: [
        {
          path: '',
          name: 'console',
          meta: {
            check: true
          },
          component: ConsoleIndex
        },
        {
          path: 'appointment',
          name: 'appointment_meeting',
          meta: {
            check: true
          },
          component: Appointment
        },
        {
          path: 'docs',
          name: 'docs_meeting',
          meta: {
            check: true
          },
          component: DocsManagement
        },
        {
          path: 'statistics',
          // name: 'statistics_meeting',
          meta: {
            check: true
          },
          component: Statistics,
          children: [
            {
              path: '',
              name: 'statistics_dashboard',
              component: StatisticsDashboard
            },
            {
              path: ':id',
              name: 'statistics_meeting_info',
              component: StatisticsInfo
            }
          ]
        },
        {
          path: 'account',
          // name: 'account_center',
          meta: {
            check: true
          },
          component: AccountCenter,
          children: [
            {
              path: '',
              name: 'account_basic',
              meta: {
                check: true
              },
              component: AccountBasicInfo
            },
            {
              path: 'mSetting',
              name: 'meeting_setting',
              meta: {
                check: true
              },
              component: AccountMeetingSetting
            },
            {
              path: 'aSecurity',
              name: 'account_security',
              meta: {
                check: true
              },
              component: accountSecurity
            }
          ]
        }
      ]
    }
  ]
});



// WEBPACK FOOTER //
// ./src/router/index.js