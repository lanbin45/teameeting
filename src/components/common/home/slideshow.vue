<template>
  <div class="slideshow">
    <div class="slide_wrap" ref="slideshow">
      <transition name="fade">
        <div 
          v-for="(item, index) in slideList" 
          v-if="currentIndex == index" 
          class="slideshow_item" 
          @mouseenter="clearSlideLinstener"
          @mouseleave="slideListener"
          :style="{backgroundImage: 'url('+ item.bgUrl +')'}">
          <div class="section_container" :class="typeof item.position == 'string' && item.position+'_banner'">
            <div class="slideshow_table">
              <div class="slideshow_table_cell">
                <h1 
                  v-if="item.title && item.title.text"
                  class="slideshow_item_title" 
                  :style="{color: styleObject[index].title.color, backgroundImage: styleObject[index].title.background, '-webkit-background-clip': 'text'}">
                  {{ $t(item.title.text) }}
                </h1>
                <p 
                  v-if="item.subTitle && item.subTitle.enabled"
                  :style="{color: styleObject[index].subTitle.color}" 
                  class="slideshow_item_subtitle">
                  {{ $t(item.subTitle.text) }}
                </p>
                <a v-if="item.btn && item.btn.enabled" :href="item.btn.href ? item.btn.href : 'javascript:;'" class="slideshow_item_btn">{{ $t(item.btn.text) }} </a>
              </div>    
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="slideshow_position" v-if="slideList.length > 1">
      <ul class="slideshow_position_list">
        <li v-for="(item, index) in slideList" :class="currentIndex == index && 'active'" @click="switchSlide(index)"></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        currentIndex: 0,
        slideTimer: null,
        slideList: [].concat(this.slideData)
      }
    },

    computed: {
      styleObject () {
        let that = this;
        let oStyle = [];
        
        for (let i = 0; i < that.slideData.length; i++) {
          let item = that.slideData[i];
          let itemStyle = {title: {}, subTitle: {}};

          //
          if (item.title) {
            if (item.title.gradient) {
              if (typeof item.title.gradient.enabled == 'boolean' && item.title.gradient.enabled) {//需要渐变
                itemStyle.title.color = 'transparent';
                itemStyle.title.background = 'linear-gradient(to right, '+ (item.title.gradient.form ? item.title.gradient.form : '#22BBFF') +', '+ (item.title.gradient.to ? item.title.gradient.to : '#4CEBC2') +')';
              } else {//否则使用文字颜色
                itemStyle.title.color = item.title.color ? item.title.color : '#fff';
              }
            } else {
              itemStyle.title.color = item.title.color ? item.title.color : '#fff';    
            }
          }
          //
          if (item.subTitle) {
            itemStyle.subTitle.color = item.subTitle.color ? item.subTitle.color : '#fff';
          }
          oStyle.push(itemStyle);
          //
        }

        return oStyle
      }
    },
    
    watch: {
      slideData (list) {
        this.slideList = [].concat(list)
      }
    },

    props: {
      slideData: {
        type: Array,
        default () {
          return []
        }
      }
    },

    mounted () {
      let that = this;
      
      if (that.slideData.length > 0) {
        that.slideListener();
      }
    },

    methods: {
      update (listData) {
        this.slideData = listData;
      },
      switchSlide (index) {
        let that = this;
        that.currentIndex = index;
      },
      clearSlideLinstener () {
        clearInterval(this.slideTimer);
      },
      slideListener () {
        let that = this;
        
        clearInterval(that.slideTimer);
        that.slideTimer = setInterval(() => {
          if (that.currentIndex + 1 >= that.slideData.length) {
            that.currentIndex = 0;
          }
          else {
            that.currentIndex ++;
          }
        }, 5000);
      }
    },

    destroyed () {
      clearInterval(this.slideTimer);
      this.slideList = [];
    }
  }
</script>


// WEBPACK FOOTER //
// src/components/common/home/slideshow.vue