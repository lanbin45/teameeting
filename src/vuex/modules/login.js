import * as mutationTypes from '../mutation-type';
import '../localStorage/class';

const moduleLogin = {
  state: {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
    ssuc: localStorage.getItem('ssuc') ? JSON.parse(localStorage.getItem('ssuc')) : false,
    lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh'
  },
  actions: {
    setUserInfo ({ commit }, oUserInfo) {
      commit(mutationTypes.SET_USER_INFO, oUserInfo);
    },
    updateUserNickName ({ commit }, sNewName) {
      commit(mutationTypes.UPDATE_USER_NICKNAME, sNewName);
    },
    updateUserPhone ({ commit }, sNewName) {
      commit(mutationTypes.UPDATE_USER_PHONE, sNewName);
    },
    updateUserPhoneAreaCode ({ commit }, sNewName) {
      commit(mutationTypes.UPDATE_USER_PHONE_AREA_CODE, sNewName);
    },
    updateUserEmail ({ commit }, sNewName) {
      commit(mutationTypes.UPDATE_USER_EMAIL, sNewName);
    },
    updateAudioEnabled ({ commit }, audioEnabled) {
      commit(mutationTypes.UPDATE_AUDIO_ENABLED, audioEnabled);
    },
    updateVideoEnabled ({ commit }, videoEnabled) {
      commit(mutationTypes.UPDATE_VIDEO_ENABLED, videoEnabled);
    },
    updateUserIcon ({ commit }, hdUrl) {
      commit(mutationTypes.UPDATE_USER_ICON, hdUrl);
    },
    updateUserIconRecord ({ commit }, nTimers) {
      commit(mutationTypes.UPDATE_USER_ICON_RECORD, nTimers);
    },
    updateRoomNotify ({ commit }, isNotify) {
      commit(mutationTypes.UPDATE_ROOM_NOTIFY, isNotify);
    },
    updateMeetMode ({ commit }, meetMode) {
      commit(mutationTypes.UPDATE_MEET_MODE, meetMode);
    },
    updateLineMeetMode ({ commit }, lineoMeetMode) {
      commit(mutationTypes.UPDATE_LINE_MEET_MODE, lineoMeetMode);
    },
    updateUserAmount ({ commit }, leftBalance) {
      commit(mutationTypes.UPDATE_USER_AMOUNT, leftBalance);
    },
    updateUserMTime ({ commit }, leftMTime) {
      commit(mutationTypes.UPDATE_USER_MTIME, leftMTime);
    },
    updateUserLineTime ({ commit }, leftLineTime) {
      commit(mutationTypes.UPDATE_USER_LINETIME, leftLineTime);
    },
    clearUserInfo ({ commit }) {
      commit(mutationTypes.CLEAR_USER_INFO);
    },
    changeLangage ({ commit }, lang) {
      commit(mutationTypes.CHANG_LANGAGE, lang);
    }
  },
  mutations: {
    //设置用户信息
    [mutationTypes.SET_USER_INFO] (state, oUserInfo) {
      state.userInfo = oUserInfo;
      state.ssuc = true;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      localStorage.setItem('ssuc', true);
    },
    //更改昵称
    [mutationTypes.UPDATE_USER_NICKNAME] (state, sNewName) {
      state.userInfo.userNickName = sNewName;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改手机号
    [mutationTypes.UPDATE_USER_PHONE] (state, sPhone) {
      state.userInfo.userCellphone = sPhone;
      
      if (state.userInfo.logType == "phone") {
        state.userInfo.userAccount = sPhone;
      }
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改手机号区号
    [mutationTypes.UPDATE_USER_PHONE_AREA_CODE] (state, sCode) {
      state.userInfo.userPhoneAreaCode = sCode;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改邮箱
    [mutationTypes.UPDATE_USER_EMAIL] (state, sEmail) {
      state.userInfo.userEmail = sEmail;
      
      if (state.userInfo.logType == "email") {
        state.userInfo.userAccount = sEmail;
      }
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改音频是否传输
    [mutationTypes.UPDATE_AUDIO_ENABLED] (state, nAudioEnabled) {
      state.userInfo.audioEnabled = nAudioEnabled;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改视频是否传输
    [mutationTypes.UPDATE_VIDEO_ENABLED] (state, nVideoEnabled) {
      state.userInfo.videoEnabled = nVideoEnabled;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改人员进会退会是否提示
    [mutationTypes.UPDATE_ROOM_NOTIFY] (state, nRoomNotify) {
      state.userInfo.roomNotify = nRoomNotify;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改人员视频会议视频质量
    [mutationTypes.UPDATE_MEET_MODE] (state, meetMode) {
      state.userInfo.meetMode = meetMode;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改人员连麦会议视频质量
    [mutationTypes.UPDATE_LINE_MEET_MODE] (state, lineoMeetMode) {
      state.userInfo.lineMeetMode = lineoMeetMode;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改用户头像
    [mutationTypes.UPDATE_USER_ICON] (state, hdUrl) {
      state.userInfo.userIcon = hdUrl;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改用户头像次数
    [mutationTypes.UPDATE_USER_ICON_RECORD] (state, nTimers) {
      state.userInfo.userIconRecord = nTimers;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //更改用户余额
    [mutationTypes.UPDATE_USER_AMOUNT] (state, leftBalance) {
      state.userInfo.userAmount = leftBalance;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //
    [mutationTypes.UPDATE_USER_MTIME] (state, leftMTime) {
      state.userInfo.mMeetTime = leftMTime;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //
    [mutationTypes.UPDATE_USER_LINETIME] (state, leftLineTime) {
      state.userInfo.mLineTime = leftLineTime;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    //清除用户信息
    [mutationTypes.CLEAR_USER_INFO] (state) {
      state.userInfo = {};
      state.ssuc = false;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('ssuc');
    },
    [mutationTypes.CHANG_LANGAGE] (state, lang) {
      state.lang = lang;
      localStorage.setItem('lang', lang);
    },
  },
  getters: {
    getUserInfo: state => {
      return  state.userInfo;
    },
    getSsuc: state => {
      return  state.ssuc;
    },
    getLangage: state => {
      return state.lang
    }
  }
}

export default moduleLogin;




// WEBPACK FOOTER //
// ./src/vuex/modules/login.js