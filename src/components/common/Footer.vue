<template lang="html">
    <footer>
      <!--  -->
      <div class="footer_link">
        <ul class="footer_link_content">
          <!-- <li>
            <dl>
              <dt>{{ $t('footer.product.title') }}</dt>
              <dd>{{ $t('footer.product.EE') }}</dd>
              <dd>{{ $t('footer.product.advice') }}</dd>
              <dd>{{ $t('footer.product.extend') }}</dd>
              <dd>{{ $t('footer.product.download') }}</dd>
            </dl>
          </li> -->
          <li class="about">
            <dl>
              <dt>{{ $t('footer.about.title') }} <sup>®</sup></dt>

              <dd>{{ $t('footer.about.paragraph1') }}</dd>
              <dd>{{ $t('footer.about.paragraph2') }}</dd>
              <dd>{{ $t('footer.about.paragraph3') }}</dd>
            </dl>
          </li>
          <li class="contact">
            <dl>
              <dt>{{ $t('footer.service.title') }}</dt>

              <dd>{{ $t('footer.service.line') }}</dd>
              <dd>{{ $t('footer.service.fax') }}</dd>
              <dd>{{ $t('footer.service.email') }}</dd>
            </dl>
          </li>
          <li class="help">
            <dl>
              <dt>{{ $t('footer.help.title') }}</dt>

              <!-- <dd><a target="_blank" href="/terms/server_protocol.html">{{ $t('footer.help.agreement') }}</a></dd>
              <dd><a target="_blank" href="/terms/privacy_protocol.html">{{ $t('footer.help.terms') }}</a></dd> -->
              <dd><router-link target="_blank" :to="{'path': '/terms/server_protocol.html'}">{{ $t('footer.help.agreement') }}</router-link></dd>
              <dd><router-link target="_blank" :to="{'path': '/terms/privacy_protocol.html'}">{{ $t('footer.help.terms') }}</router-link></dd>
            </dl>
          </li>
          <li class="blogroll">
            <dl>
              <dt>{{ $t('footer.blogroll.title') }}</dt>

              <dd><a href="https://www.anyrtc.io" target="_blank">anyRTC</a></dd>
              <dd><a href="https://www.anyrtc.io/case" target="_blank">SDK解决方案</a></dd>
            </dl>
          </li>
          <li class="quickly">
            <dl>
              <dt>{{ $t('footer.quickly.title') }}</dt>

              <dd><router-link :to="{'path': '/download'}">{{ $t('footer.quickly.download') }}</router-link></dd>
              <dd><router-link :to="{'path': '/about'}">{{ $t('footer.quickly.about') }}</router-link></dd>
            </dl>
          </li>
        </ul>
      </div>
      <!--  -->
      <div class="footer_copyright">
        <p class="">{{ $t('footer.address') }}</p>
        <p class="">{{ $t('footer.copyright') }}</p>
        <p class="">
          <a target="_blank" href="http://www.miitbeian.gov.cn" style="display:inline-block;text-decoration:none;"><p style="display: inline-block;margin-left: 4px;font-size: 12px;color:#939393;">{{ $t('footer.ICP') }}</p></a>
        </p>
        <div style="width:300px;margin:0 auto; text-align: center;"><!-- padding:10px 0; -->
          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011002002732" style="display:inline-block;text-decoration:none;"><img src="/static/images/gongan_logo.png" style="display: inline-block;vertical-align: middle;"/><p style="display: inline-block;margin-left: 4px;font-size: 12px;color:#939393;">沪公网安备 31011002002732</p></a>
        </div>

        <!-- <AppSelect 
          class="lang_select" 
          position="top" 
          :default="currentLang"
          @change="handleChange" 
          :options="opts">
          <i slot="fixedIcon" class="icon iconfont icon-world"></i>
        </AppSelect> -->
      </div>
    </footer>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data () {
      return {
        currentLang: '',
        opts: [
          {
            label:'简体中文',
            value: 'zh'
          },
          {
            label:'繁体中文',
            value: 'zhtw'
          },
          {
            label:'英文',
            value: 'en'
          },
        ]
      }
    },
    components: {
    },
    computed: {
      ...mapGetters({
        langage: 'getLangage'
      })
    },
    beforeMount () {
      let that = this;

      that.currentLang = that.langage;
    },
    mounted () {
      let that = this;

    },
    methods: {
      handleChange (item) {
        let that = this;

        that.$i18n.locale = item.value;
        that.$store.dispatch('changeLangage', item.value);
      }
    }
  }
</script>

<style scoped lang='scss' rel="stylesheet/scss">
  footer {
    display: block;
    width: $maxWidth;
    padding-top: 50px;
    margin-left: auto;
    margin-right: auto;

    .footer_link {
      padding-bottom: 40px;

      .footer_link_content {
        font-size: 0;

        li {
          display: inline-block;
          vertical-align: top;
          font-size: 12px;
          box-sizing: border-box;
          text-align: center;

          &.about {
            width: 40%;
            user-select: none;

            dd {
              line-height: 18px;  
              text-align: left;
            }

            dl::after {
              content: "";
              display: block;
              position: absolute;
              top: 44px;
              right: 0;
              width: 1px;
              height: 94px;
              background-color: #eee;
            }
          }
          &.contact {
            width: 26%;

            dl::after {
              content: "";
              display: block;
              position: absolute;
              top: 44px;
              right: 0;
              width: 1px;
              height: 94px;
              background-color: #eee;
            }
          }
          &.help {
            width: 10%;
          }
          &.blogroll {
            width: 10%;
          }

          dl {
            position: relative;
            padding: 0 15px;
            line-height: 1;

            dt {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 28px;
              color: $h2Color;
              user-select: none;
            }
            dd {
              margin: 0;
              margin-bottom: 20px;
              font-size: 14px;
              color: $tipColor;
              a {
                color: $tipColor;
              }
            }
          }
        }
      }
    }
    .footer_copyright {
      position: relative;
      padding-top: 20px;
      padding-bottom: 20px;
      border-top: 1px solid #e6e6e6;

      & > p {
        margin-bottom: 8px;
        font-size: 12px;
        color: $tipColor;
      }

      .lang_select {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
  }
</style>



// WEBPACK FOOTER //
// src/components/common/Footer.vue