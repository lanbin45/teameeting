// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Meta from 'vue-meta'
import {sync} from 'vuex-router-sync'
import ElementUI from 'element-ui'
import { MessageBox, Message } from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont/iconfont.css'

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

Vue.config.productionTip = false
// Vue.config.productionTip = true

Vue.use(Meta)
Vue.use(ElementUI)

// 国际化
import i18n from "./i18n"

//配置路由
import router from './router'

// 导航全局组件
import AppHeader from './components/common/Header'
Vue.use(AppHeader);
import AppFooter from './components/common/Footer'
Vue.use(AppFooter);
import AppFixed from './components/common/FixedContact'
Vue.use(AppFixed);
import AppSelect from './components/common/Select'
Vue.use(AppSelect);
import MeetHeader from './components/common/meeting/MeetHeader'
Vue.use(MeetHeader); 
import MeetSider from './components/common/meeting/MeetSider'
Vue.use(MeetSider); 

import msg from './components/common/confirm/index'
Vue.prototype.$detectDevices = msg.confirm;

// vuex仓库
import store from "./vuex/index.js"
sync(store, router)
//私有配置
import './config';
// http返回值过滤

// Add a request interceptor
AX.interceptors.request.use(config => {
  // Do something before request is sent
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});
let firstRequest = true;
// Add a response interceptor
AX.interceptors.response.use(response => {  
  // 处理excel文件
  if (response.headers && response.headers['content-type'] === 'application/vnd.openxmlformats') {
    // download url
    const downloadPost = (config) => {
      const url = config.url
      const data = JSON.parse(config.data)
      const form = document.createElement('form')
      form.action = url
      form.method = 'post'
      form.style.display = 'none'
      Object.keys(data).forEach(key => {
        const input = document.createElement('input')
        input.name = key
        input.value = data[key]
        form.appendChild(input)
      })
      const button = document.createElement('input')
      button.type = 'submit'
      form.appendChild(button)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    }

    const downloadGet = (config) => {
      const params = []
      for (const item in config.params) {
        params.push(`${item}=${config.params[item]}`)
      }
      const url = params.length ? `${config.url}?${params.join('&')}` : `${config.url}`
      let iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = url
      iframe.onload = function () {
        document.body.removeChild(iframe)
      }
      document.body.appendChild(iframe)
    }

    const config = response.config
    if (config.method === 'post') {
      downloadPost(config)
    } else if (config.method === 'get') {
      downloadGet(config)
    }
    return
  }
  if (response.data.code == 100008) {// token 已过期，重定向到登录页面  
    store.dispatch('clearUserInfo');
    store.dispatch('setForceRefrech', true);
    window.onbeforeunload = null;
    window.onunload = null;
    if (!firstRequest) {
      Vue.prototype.$message.error('账户未登录！');
      router.push('/signin');
    }
  } else if (response.data.code == 100007) {
    store.dispatch('clearUserInfo');
    store.dispatch('setForceRefrech', true);
    window.onbeforeunload = null;
    window.onunload = null;
    if (!firstRequest) {
      Vue.prototype.$message.error('账户已在其他地方登录！');
      router.push('/');
    }
  } else if (response.data.code == 100022) {
    store.dispatch('clearUserInfo');
    store.dispatch('setForceRefrech', true);
    window.onbeforeunload = null;
    window.onunload = null;
    if (!firstRequest) {
      Vue.prototype.$message.error('账户已被禁用，若有疑问请联系客服！');
      router.push('/');
    }
  } else {
    return response
  }
  firstRequest = false;
}, function axiosRetryInterceptor(err) {
  var config = err.config;
  // If config does not exist or the retry option is not set, reject
  if(!config || !config.retry) return Promise.reject(err);
  
  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;
  
  // Check if we've maxed out the total number of retries
  if(config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }
  
  // Increase the retry count
  config.__retryCount += 1;
  
  // Create new promise to handle exponential backoff
  var backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, config.retryDelay || 1);
  });
  
  // Return the promise in which recalls axios to retry the request
  return backoff.then(function() {
    return AX(config);
  });
});

AX.post('users/check_session').then(res => {
  if (res && res.data.code === 200) {
    let userinfoData = res.data.userinfo;
    let logType = store.state.lg.userInfo.logType;
    let account = store.state.lg.userInfo.userAccount
    store.dispatch('setUserInfo', {
      userid: userinfoData.userid,
      userAmount: userinfoData.u_asset / 100,
      userType: userinfoData.u_type,
      userIcon: userinfoData.u_hd_icon,
      userIconRecord: userinfoData.u_icon_record,
      userAccount: account,
      logType: logType,
      mLineTime: userinfoData.u_left_line_time,
      mMeetTime: userinfoData.u_left_meet_time,
      userPhoneAreaCode: userinfoData.u_country_code,
      userCellphone: userinfoData.u_cellphone,
      userEmail: userinfoData.u_email,
      userNickName: userinfoData.u_nickname,
      videoEnabled: userinfoData.u_auto_camera_off,
      audioEnabled: userinfoData.u_auto_mute,
      roomNotify: userinfoData.u_room_notify,
      meetMode: userinfoData.u_meet_mode,
      lineMeetMode: userinfoData.u_line_meet_mode
    });
  }
}).catch();

// 遍历路由
router.beforeEach((to, from, next) => {
  // Logger(to, from);
  if (to.meta.check) {
    AX.post('users/check_session').then(res=>{
      let data = res.data;
      switch (data.code) {
        case 200:
          let userinfoData = data.userinfo;
          let logType = store.state.lg.userInfo.logType;
          let account = store.state.lg.userInfo.userAccount
          store.dispatch('setUserInfo', {
            userid: userinfoData.userid,
            userAmount: userinfoData.u_asset/100,
            userType: userinfoData.u_type,
            userIcon: userinfoData.u_hd_icon,
            userIconRecord: userinfoData.u_icon_record,
            userAccount: account,
            logType: logType,
            mLineTime: userinfoData.u_left_line_time,
            mMeetTime: userinfoData.u_left_meet_time,
            userPhoneAreaCode: userinfoData.u_country_code,
            userCellphone: userinfoData.u_cellphone,
            userEmail: userinfoData.u_email,
            userNickName: userinfoData.u_nickname,
            videoEnabled: userinfoData.u_auto_camera_off,
            audioEnabled: userinfoData.u_auto_mute,
            roomNotify: userinfoData.u_room_notify,
            meetMode: userinfoData.u_meet_mode,
            lineMeetMode: userinfoData.u_line_meet_mode
          });
          next();
        break;
        case 100022:
          store.dispatch('clearUserInfo');
          Vue.prototype.$message.error('账户已被禁用！');
          setTimeout(() => {
            next('/');
          }, 1500);
        break;
        default:
          Vue.prototype.$message.error('账户已被禁用！');
          store.dispatch('clearUserInfo');
          next('/signin');
        break;
      }
    });
  } else {
    next();
  }
});

/* eslint-disable no-new */
const teameetingApp = new Vue({
  el: '#app',
  i18n,
  store,
  router,
  template: '<App/>',
  components: { App }
});

global.Err = {
  newEr: teameetingApp.$t('el.datepicker.now')
};


// WEBPACK FOOTER //
// ./src/main.js