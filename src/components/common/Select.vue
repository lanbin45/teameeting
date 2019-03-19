<template>
    <div class="sys_select" :class="position == 'top' ? 'top' : 'down'" :value="selectValue">
        <div class="sys_select_control" @click="showList = !showList" @mouseover="showList = true" @mouseout="showList = false">
            <span class="sys_select_control_icon">
                <slot name="fixedIcon"></slot>
            </span>
            <span class="sys_select_label">{{ selectLabel }}</span>
            <span v-if="!showList" class="sys_select_icon el-icon-arrow-down"></span>
            <span v-else class="sys_select_icon el-icon-arrow-up"></span>
        </div>
        <div class="sys_select_dropdown" v-if="showList" @mouseover="showList = true" @mouseout="showList = false">
            <ul>
                <li v-for="item in options" class="sys_select_dropdown_item" :class="selectValue == item.value && 'active'" @click="confirmSelect(item)">{{ item.label }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                isTop: null,
                isDown: null,

                selectValue: 0,
                selectLabel: '请选择',

                showList: false,
            }
        },

        props: ['options', 'position', 'default', 'label'],

        beforeMount () {

        },

        mounted () {
            let that = this;

            that.selectValue = that.default ? that.default : that.options[0].value;

            if (that.label) {
                that.selectLabel = that.label;
            } else {
                if (that.default) {
                    for (let i in that.options) {
                        if (that.options[i].value == that.default) {
                            that.selectLabel = that.options[i].label;
                        }
                    }
                } else {
                    that.selectLabel = that.options[0].label;    
                }
            }
        },

        methods: {
            confirmSelect (item) {
                let that = this;

                that.selectValue = item.value;
                that.selectLabel = item.label;

                that.showList = false;
                that.$emit('change', item);
            }
        }

    }
</script>

<style lang='scss' rel="stylesheet/scss">
    .sys_select {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        max-width: 240px;
        height: 30px;

        .sys_select_control {
            font-size: 0;
            color: #666666;
            user-select: none;
            cursor: pointer;

            .sys_select_control_icon {
                display: inline-block;
                vertical-align: middle;
                max-width: 60px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                font-size: 16px;
            }
            .sys_select_label {
                padding: 0 10px;
                display: inline-block;
                vertical-align: middle;
                font-size: 16px;
                line-height: 30px;
                max-width: 120px;
                min-width: 80px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                @include borderBox;
            }
            .sys_select_icon {
                display: inline-block;
                vertical-align: middle;
                max-width: 40px;
                font-size: 16px;
                // cursor: pointer;
            }
        }

        .sys_select_dropdown {
            position: absolute;
            top: 40px;
            left: 0;
            width: 100%;
            padding: 10px 0;
            
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

                    &.active,
                    &:hover {
                        color: #3FAAFC;
                        background-color: #EDF5FF;
                    }
                } 
            }
        }

        &.top {
            .sys_select_dropdown {
                top: unset;
                bottom: 30px;
            }
        }
    }
</style>


// WEBPACK FOOTER //
// src/components/common/Select.vue