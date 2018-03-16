<template>
    <div class="sidebar">
        <ul class="sidebar-btn-bar">
            <li class="sidebar-trigger" @click="handleStatusChange(1)">
                <i :class="'icon el-icon-d-arrow-'+(status<1?'right':'left')"></i>
            </li>
            <li class="sidebar-trigger" @click="handleStatusChange(2)">
                <i :class="'icon el-icon-arrow-'+(status<2?'right':'left')"></i>
            </li>
        </ul>
        <el-scrollbar :autoHide="true">
            <h2 class="sidebar-title">{{menu.name}}</h2>
            <sidebar-item :list="menu.list" class="sidebar-menu" :status="status" :accordion="accordion" ref="sidebarItem"></sidebar-item>
        </el-scrollbar>
    </div>
</template>

<script>
    import Vue from 'vue';
    import SidebarItem from './SidebarItem';
    import ElScrollbar from './Scroller';
    import {Tooltip} from 'element-ui';

    Vue.use(Tooltip);
    export default {
        components: {SidebarItem, ElScrollbar},
        props: {
            status: {
                type: Number,
                required: true
            },
            accordion: {
                type: Boolean,
                default: true
            },
            menu: {
                type: Object,
                required: true
            }
        },
        data(){
            return {

            }
        },
        computed: {},
        methods: {
            handleStatusChange(type){
                this.$emit('statusChange', type)
            },
            setFocus(path){
                this.$refs['sidebarItem'].setFocus(path);
            }
        }
    }
</script>

<style lang="scss">
    @import '../style/var';

    $background-color-base:#333333;
    $background-color-hover:#212121;
    $font-color-base:#8f8f8f;
    $font-hover-color-base:#eeeeee;
    .sidebar{
        height:100%;
        background:$background-color-base;
        color:$font-color-base;
        transition-property:color, background-color;
        transition:3s;
        .sidebar-menu-item a{
            text-decoration:none;
            color:$font-color-base;
            transition:color 3s;
        }
        .sidebar-title{
            padding:35px 0 28px 20px;
            font-size:18px;
            border-bottom:1px solid mix($--color-white, $background-color-base, 10%);
            margin-bottom:4px;
            white-space:nowrap;
            transition:opacity .5s;
        }
        .sidebar-btn-bar{
            position:absolute;
            top:0;
            width:20px;
            z-index:2;
            right:0;
            .sidebar-trigger{
                background:mix($--color-white, $background-color-base, 10%);
                height:36px;
                line-height:36px;
                width:100%;
                text-align:center;
                margin-top:3px;
                cursor:pointer;
                border-radius:5px 0 0 5px;
            }
        }
    }

    .sidebar:hover{
        color:$font-hover-color-base;
        background:$background-color-hover;
        transition:.5s;
        .sidebar-menu-item a{
            color:$font-hover-color-base;
            transition:color .3s;
        }
        .sidebar-menu-item a.router-link-active{
            color:mix($--color-white, $--link-color-active, 80%);
        }
    }

    .sidebar-status-hide{
        .sidebar{
            .sidebar-title{
                opacity:0;
            }
            .sidebar-btn-bar{
                .sidebar-trigger{
                    border-radius:0 5px 5px 0;
                    opacity:.5;
                }
            }
            .sidebar-btn-bar:hover{
                .sidebar-trigger{
                    opacity:1;
                }
            }
            animation:fadeBg 1s forwards;
            animation-delay:.3s;
        }
    }

    @keyframes fadeBg{
        to{
            background:transparent;
        }
    }

    .sidebar-status-folding{
        .sidebar{
            .sidebar-title{
                opacity:0;
            }
        }
    }
</style>