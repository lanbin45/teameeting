<template lang="html">
    <div class="app_header" ref="appHeader">
        <div class="app_header_box" :class="defaultFull && 'full'">
            <!-- <a class="app_header_icon" href="/"> -->
            <router-link class="app_header_icon" :to="{'path': '/'}">
                <slot name="brand">
                    <img src="/static/images/logo.png" alt="Teameeting Logo"> 
                    <!-- <span class="brand_name">Teameeting</span> -->
                    <!-- <img :style="{width: '110px', marginTop: '-3px'}" src="/static/images/9s_logo.png" alt=""> -->
                </slot>
            </router-link>
            <!-- </a> -->
            <div class="app_header_container">
                <slot>
                    
                </slot>
            </div>
            <div class="app_header_account">
                <slot name="account" v-if="!ssuc">
                    <div class="signin_box">
                        <!-- <a class="btn plain round" href="/signup">{{ $t('header.signup') }}</a> -->
                        <!-- <a class="btn primary round" href="/signin">{{ $t('header.signin') }}</a> -->
                        <router-link class="btn plain round" :to="{'path': '/signup'}">{{ $t('header.signup') }}</router-link>
                        <router-link class="btn primary round" :to="{'path': '/signin'}">{{ $t('header.signin') }}</router-link>
                    </div>
                </slot>
                <slot name="account" v-if="ssuc">
                    <ul class="account_list">
                        <li style="margin-right: 45px;">
                            <router-link :class="$route.fullPath === '/console' && 'active'" :to="{'path': '/console'}">{{ $t('header.home') }}</router-link>
                        </li>
                        <li style="margin-right: 45px;">
                            <!-- <a :class="$route.fullPath === '/console/account' && 'active'" href="/console/account">{{ $t('header.account') }}</a> -->
                            <router-link :class="$route.fullPath === '/console/account' && 'active'" :to="{'path': '/console/account'}">{{ $t('header.account') }}</router-link>
                        </li>
                        <li>
                            <a href="javascript:void(0);" class="account_link">
                                <img class="user_icon" :src="userInfo.userIcon ? userInfo.userIcon : 'http://oss.teameeting.cn/teameeting/header.png'" alt=""> <span>{{ userInfo.userAccount }}</span>
                                <div class="account_info">
                                    <div class="account_info_box">
                                        <div class="account_info_hd">
                                            <p>{{ userInfo.userNickName }}</p>
                                            <a href="javascript:void(0);"><small class="account_info_account">{{ userInfo.userAccount }}</small></a>
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
                            </a>
                        </li>
                    </ul>
                </slot>
            </div>
        </div>
	</div>
</template>

<script>
    import { mapGetters } from 'vuex';
	export default {
		data () {
			return {
                defaultFull: false,
                defaultOpts: {
                    noBgColor: false,
                    noBtBorder: false
                },
                opts: {}
            }
		},
        props: ['options', 'full'],
		components: {},
        computed: {
            ...mapGetters({
              userInfo: 'getUserInfo',
              ssuc: 'getSsuc'
            }),
        },
        beforeMount () {
            let that = this;
            
            if (typeof that.options === "object") {
                that.opts = {};
                Object.assign(that.opts, that.defaultOpts, that.options);
            }

            if (typeof that.full === 'boolean') {
                that.defaultFull = that.full;
            } else {
                that.defaultFull = false;
            }
        },
        mounted () {
            let that = this;
            
            that.changeStyle();
        },
        methods: {
            updateOpts (options) {
                let that = this;

                that.opts = Object.assign({}, that.defaultOpts, options);
                that.changeStyle();
            },
            changeStyle () {
                let that = this;
                if (that.opts.noBgColor) {
                    that.$el.classList.value.indexOf('no_bg_color') === -1 & that.$el.classList.add('no_bg_color');
                } else {
                    that.$el.classList.value.indexOf('no_bg_color') !== -1  & that.$el.classList.remove('no_bg_color');
                }
                if (that.opts.noBtBorder) {
                    that.$el.classList.value.indexOf('no_bt_border') === -1 & that.$el.classList.add('no_bt_border');
                } else {
                    that.$el.classList.value.indexOf('no_bt_border') !== -1 & that.$el.classList.remove('no_bt_border');
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
                            // window.location.href = "/signin";
                            that.$router.push('/signin');
                        } else {

                        }
                    });
                });
            }
        }
	}
</script>

<style scoped lang='scss' rel="stylesheet/scss">

	.app_header {
        position: fixed;
        top: 0;
        width: 100%;
        min-width: 1080px;
		height: $headerHeight;
		background-color: #fff;
        border-bottom: 1px solid $borderColor;
        z-index: 99;

        $hdContentHeight: 40px;

        &.no_bg_color {
            background-color: transparent;
        }
        &.no_bt_border {
            border-bottom: none;
        }

        .app_header_box {
            position: relative;
            display: block;
            padding: 0;
            margin-left: auto;
            margin-right: auto;
            width: $maxWidth;
            height: 100%;
            font-size: 0;
            @include borderBox;

            &.full {
                padding-left: 40px;
                padding-right: 40px;
                width: 100%;

                .app_header_icon {
                    left: 40px;
                    select: none;
                    outline: none;
                }
                .app_header_account {
                    right: 40px;
                }
            }

            .app_header_icon {
                position: absolute;
                top: 0;
                left: 0;
                display: inline-block;
                margin: 20px 0;
                width: 280px;
                user-select: none;
                
                & > img {
                    width: 140px;
                    margin-right: 16px;
                    // height: 40px;
                    vertical-align: middle;
                    border: none;
                }
                // .brand_name {
                //     font-size: 24px;
                //     color: #666666;
                //     vertical-align: middle;
                // }
            }
            .app_header_container {
                display: inline-block;
                width: 100%;
                height: 100%;
                padding-left: 190px;
                padding-right: 300px;
                @include borderBox;

                .header_leave_meet {
                    width: 100%;
                    height: 100%;
                    line-height: $headerHeight;
                    text-align: center;
                }
            }
            .app_header_account {
                position: absolute;
                top: 0;
                right: 0;
                display: inline-block;
                height: 100%;

                .signin_box {
                    margin-top: 10px;
                }

                .btn:last-child {
                    margin-left: 20px;
                }

                .account_list {
                    width: 100%;
                    height: 100%;
                    font-size: 0;
                    user-select: none;
                    
                    & > li {
                        display: inline-block;
                        line-height: $headerHeight;
                        height: 100%;
                        font-size: 14px;
                        vertical-align: middle;
                        
                        & > a {
                            outline: none;
                            select: none;
                        }
                        
                        a.active {
                            color: $blue;
                        }

                        .account_link {
                            position: relative;
                            display: inline-block;

                            .user_icon {
                                display: inline-block;
                                vertical-align: middle;
                                margin-right: 10px;
                                width: 30px;
                                height: 30px;
                                border-radius: 20px;
                                border: none;
                                border: 1px solid #eee;
                                // @include boxShadow;
                            }
                            .user_icon + span {
                                display: inline-block;
                                vertical-align: middle;
                                font-size: 12px;
                                width: 6em;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                color: #999;
                            }
                            .account_info {
                                display: none;
                                position: absolute;
                                top: 61px;
                                right: 0;
                                padding-top: 10px;
                                width: 200px;
                                text-align: left;
                                @include borderBox;

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
                                        }
                                        .account_info_account {
                                            font-size: 12px;
                                            color: #999;
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
        
	}
</style>



// WEBPACK FOOTER //
// src/components/common/Header.vue