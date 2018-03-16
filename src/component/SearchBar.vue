<template scope="scope">
    <el-form label-width="80px" :class="'cs-search-bar ' + (this.atAdvanceMode?'search-advance-expanded':'')">
        <el-form-item :label="atAdvanceMode?'关键字':''" class="cs-search-keywords-bar">
            <el-input :placeholder="placeholder" v-model="key">
            </el-input>
            <el-dropdown trigger="click" @command="handleSelectCondition" @visible-change.once="loadCondition">
                <span class="el-dropdown-link">
                    <span v-if="this.atAdvanceMode" class="cs-search-bar-dropdown-text">{{conditionName}}</span>
                    <i class="el-icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="conditionList.length === 0" command="false"><i class="icon-large el-icon-loading"></i></el-dropdown-item>
                    <el-dropdown-item v-for="item in conditionList" :command="item" :key="item.key">{{item.name}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="!this.atAdvanceMode" icon="el-icon-search" class="search-btn">
            </el-button>
            <el-button
                    v-if="hasAdvanceSlot && !this.atAdvanceMode"
                    :icon="advanceBtnIcon"
                    class="advance-btn" @click="switchSearchMode"
            ></el-button>
        </el-form-item>
        <div class="search-advance-form">
            <slot></slot>
            <div class="search-advance-toolbar">
                <el-button class="advance-search-btn" type="primary" icon="el-icon-search">搜一下</el-button>
                <el-button icon="cs-icon-d-arrow-up" class="advance-btn-on" @click="switchSearchMode">关闭</el-button>
                <el-button type="text" class="btn-save-search-condition">保存设置</el-button>
            </div>
        </div>
    </el-form>
</template>

<script>
    import {useComponents} from '../utils/tools';
    import {Input, Dropdown, DropdownMenu, DropdownItem, Form, FormItem} from 'element-ui';

    useComponents([Input, Dropdown, DropdownMenu, DropdownItem, Form, FormItem]);

    export default {
        props: {
            placeholder: {
                type: String,
                required: true
            },
            presetKey: {
                type: String,
                required: true
            },
            keywords: {
                type: String,
                default: ''
            },
            search: {
                type: Function,
                required: true
            }
        },
        data(){
            return {
                hasAdvanceSlot: false,
                atAdvanceMode: false,

                key: this.keywords,

                conditionList: [],
                conditionName: '选择预置条件'
            };
        },
        computed: {
            advanceBtnIcon(){
                return this.atAdvanceMode? 'cs-icon-d-arrow-up': 'cs-icon-d-arrow-down';
            }
        },
        mounted(){
            this.hasAdvanceSlot = !!this.$slots.default;
        },
        methods: {
            switchSearchMode(){
                this.atAdvanceMode = !this.atAdvanceMode;
            },
            loadCondition(){
                setTimeout(() =>{
                    this.$set(this, 'conditionList', [{
                            name: '近一周入职',
                            key: 'lastWeek',
                            param: {}
                        }, {
                            name: '经理级以上',
                            key: 'manager',
                            param: {}
                        }, {
                            name: '本月生日',
                            key: 'birthday',
                            param: {}
                        }]
                    )
                }, 1000);
            },
            handleSelectCondition(condition){
                this.conditionName = condition.name;
            }
        }
    }
</script>

<style lang="scss">
    @import '../style/var';

    .cs-search-bar{
        top:-1px;
        padding:1px 0 0 0;
        position:absolute;
        right:0;
        .cs-search-keywords-bar{
            > *{
                word-spacing:-4px;
            }
            z-index:101;
            position:relative;
            right:0;
            top:0;
            .el-input{
                transition:width .5s;
                width:128px;
                display:inline-block;
                vertical-align:middle;
            }
            .search-advance-btn{

            }
            .el-button:hover{
                background:$--color-primary-opacity-1;
            }
            .el-dropdown{
                margin-left:-16px;
                display:inline-block;
                vertical-align:middle;
                .el-dropdown-link{
                    font-size:12px;
                    padding:6px 0;
                    line-height:14px;
                    display:block;
                    margin:0;
                    cursor:pointer;
                    i{
                        font-size:14px;
                    }
                }
                .el-dropdown-link:hover{
                    color:$--link-hover-color;
                }
            }
            .el-button{
                display:inline-block;
                font-size:1.2rem;
                border-radius:0;
                vertical-align:middle;
                padding:4px 8px;
                margin:0;
                border:1px solid $--border-color-base;
                line-height:21px;
            }
            .advance-btn{
                padding:4px 2px;
                font-size:0.8rem;
                margin:0 0 0 -1px;
                line-height:21px;
                border-radius:0 50% 50% 0;
            }
        }
        .search-advance-toolbar{
            text-align:center;
        }
        .search-advance-form{
            min-width:500px;
            display:none;
            .input-advance-keywords{
                width:100%;
            }
            .advance-search-btn{
                padding:0 24px;
                font-size:14px;
                line-height:29px;
                .el-icon-search{
                    font-size:18px;
                }
            }
            .btn-save-search-condition{
                color:$--color-text-secondary;
                font-weight:normal;
                float:right;
            }
            .btn-save-search-condition:hover{
                color:$--color-primary-full;
            }
        }
    }

    .cs-search-bar:hover{
        .cs-search-keywords-bar{
            .el-input{
                width:256px;
            }
        }
    }

    .cs-search-bar.search-advance-expanded{
        background:$--color-white;
        border:1px solid $--border-color-base;
        padding:16px 32px 16px 16px;
        .search-advance-form{
            display:block;
        }
        .cs-search-keywords-bar{
            .el-input{
                width:256px;
            }
            .el-dropdown{
                margin-left:10px;
            }
        }
    }
</style>