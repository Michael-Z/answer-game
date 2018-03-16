<template>
    <ul class="list-menu">
        <li v-for="item in list" :key="item.key">
            <div class="sidebar-menu-item" @mouseover="showIconMenu">
                <router-link v-if="item.to"
                             :to="item.to"
                             :style="{'padding-left':level * 10 * status + 'px'}"
                             @click.native="status === 2 && toggleShowChildren(item)"
                >
                    <el-tooltip :disabled="status!==1 || isGroup(item)" :content="item.name" placement="right">
                        <i :class="'el-icon el-icon-'+item.icon"></i>
                    </el-tooltip>
                    <span class="label">{{item.name}}</span>
                    <i v-if="isGroup(item) && status===2" :class="'icon el-icon-arrow el-icon-arrow-'+(item.expanded?'up':'down')"
                       @click.prevent.stop="toggleShowChildren(item, true)"></i>
                </router-link>
                <span v-else-if="isGroup(item)" @click="status === 2 && toggleShowChildren(item)"
                      :style="{'padding-left':level * 10 * status + 'px'}">
                    <el-tooltip :disabled="status!==1 || isGroup(item)" :content="item.name" placement="right">
                        <i :class="'el-icon el-icon-'+item.icon"></i>
                    </el-tooltip>
                    <span class="label">{{item.name}}</span>
                    <i v-if="status===2" :class="'icon el-icon-arrow el-icon-arrow-'+(item.expanded?'up':'down')" @click.prevent.stop="toggleShowChildren(item, true)"></i>
                </span>
                <ul class="icon-menu-list" :style="{display:isHideIconMenu?'none':''}" v-if="status === 1 && isGroup(item)" @click="hideIconMenu">
                    <li v-if="item.to">
                        <router-link :to="item.to">
                            {{item.name}}
                        </router-link>
                    </li>
                    <li v-for="child in item.list" :key="child.key">
                        <router-link v-if="child.to" :to="child.to">
                            {{child.name}}
                        </router-link>
                    </li>
                </ul>
            </div>
            <sidebar-item
                    v-if="isGroup(item) && status === 2"
                    :list="item.list"
                    :status="status"
                    :level="level+1"
                    :style="{height:item.height + 'px'}"
                    class="list-menu"
            ></sidebar-item>
        </li>
    </ul>
</template>

<script>
    const ItemHeight = 32;
    const countChildHeight = item =>{
        let height = 0;
        if(item.list){
            item.list.forEach(child =>{
                height += ItemHeight;
                height += child.height;
            });
        }
        return height;
    };
    const updateHeight = (node, status) =>{
        if(node){
            node.expanded = status;
            node.height = node.expanded? countChildHeight(node): 0;
            updateHeight(node.parent, status);
        }
    };

    const closeUntilRoot = node =>{
        if(node){
            node.list.forEach(n =>{
                n.expanded = false;
                n.height = 0;
            });
            closeUntilRoot(node.parent);
        }
    };

    const findFocus = (path, menu) =>{
        for(let i in menu){
            if(menu.hasOwnProperty(i)){
                if(menu[i].to === path){
                    return menu[i];
                }
                if(menu[i].list){
                    let node = findFocus(path, menu[i].list);
                    if(node){
                        return node;
                    }
                }
            }
        }
        return null;
    };

    export default {
        name: 'sidebar-item',
        props: {
            list: {
                type: Array,
                required: true
            },
            level: {
                type: Number,
                default: 1
            },
            status: {
                type: Number,
                required: true
            },
            accordion: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                isHideIconMenu: false
            }
        },
        methods: {
            isGroup(node){
                return typeof(node.list) !== 'undefined';
            },
            toggleShowChildren(item, force){
                let status = item.expanded;
                if(status && !force){
                    status = false;
                }

                if(this.accordion && !status){
                    closeUntilRoot(item.parent);
                }
                updateHeight(item, !status);
            },
            hideIconMenu(){
                this.isHideIconMenu = true;
            },
            showIconMenu(){
                this.isHideIconMenu = false;
            },
            setFocus(path){
                this.$nextTick(() =>{
                    const item = findFocus(path, this.list);
                    if(item){
                        this.toggleShowChildren(item);
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    @import '../style/var';

    $sidebar-menu-item-bg-color:#4175bd;
    $sidebar-menu-item-border-color:#f09d0d;
    .list-menu{
        font-size:12px;
        overflow:hidden;
        transition:.3s;
        transition-property:opacity, visibility, height;

        .el-icon{
            transition:all .3s;
        }
        .label{
            transition:.3s;
            transition-property:opacity;
        }

        li{
            line-height:32px;
            .sidebar-menu-item{
                position:relative;
                margin-bottom:1px;
                white-space:nowrap;
                a,>span{
                    display:block;
                    transition-property:color, opacity, font-size;
                }
                a.router-link-active{
                    background:rgba($sidebar-menu-item-bg-color, 0.6);
                    color:rgba($--color-white, 0.4);
                }
                >a.router-link-active{
                    border-right:2px solid rgba($sidebar-menu-item-border-color, 0.6);
                }
                >a:hover{
                    border-right:2px solid rgba($sidebar-menu-item-border-color, 0.9);
                }
                .el-icon-arrow{
                    position:absolute;
                    right:0;
                    padding:10px;
                    cursor:default;
                }
                .el-icon-arrow:hover{
                    color:#ff8900;
                }
                .icon-menu-list{
                    display:none;
                    position:absolute;
                    top:0;
                    right:-130px;
                    width:130px;
                    padding:1px 0;
                    z-index:9;
                    background:#eee;
                    border:1px solid #ccc;
                    a{
                        text-decoration:none;
                        color:#333;
                        text-align:center;
                    }
                    a:hover{
                        background:$sidebar-menu-item-bg-color;
                        color:#ffffff;
                    }
                }
            }
            .sidebar-menu-item:hover{
                background:$sidebar-menu-item-bg-color;
                .icon-menu-list{
                    display:block;
                }
            }
        }
    }

    .sidebar-status-folding{
        .sidebar-container{
            .list-menu{
                .el-icon{
                    font-size:1.4em;
                    line-height:32px;
                    width:36px;
                    text-align:center;
                    margin-left:-10px;
                }
                .label{
                    opacity:0;
                    animation:delayHide .3s forwards;
                }
            }
        }
    }

    @keyframes delayHide{
        to{
            visibility:hidden;
        }
    }

    .sidebar-status-hide{
        .sidebar-container{
            .list-menu{
                opacity:0;
                visibility:hidden;
                .label{
                    visibility:hidden;
                    opacity:0;
                }
            }
        }
    }
</style>