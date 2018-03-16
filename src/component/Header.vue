<template>
    <div class="header-con">
        <div class="logo-bar">
            <a href="/group/site-list" title="业务站点" target="_blank">CSmall 运营平台</a>
        </div>
        <ul class="menu-list">
            <li>
                <router-link to="/overview/">总览</router-link>
            </li>
            <li class="page-trigger" @mouseover="releaseHide"><span>功能<i class="icon el-icon-arrow-down"></i></span>
                <ul class="page-list" :class="pageList.className">
                    <li @mouseover.stop="switchHover(menu, 0)" @mouseout.stop="switchBlur"
                        :class="{hover:0 === (menu.hoverIndex || 0)}">
                        <span class="node-name">{{menu.allName}}<i class="arrow el-icon-menu"></i></span>
                        <div class="page-node page-all-node">
                            <ul v-for="item in menu.all" :key="item.key">
                                <li class="page-title"><span class="name">{{item.name}}</span></li>
                                <li v-for="page in item.list" @click="handlerNodeClick(page)" :key="page.key">
                                    <a v-if="menu.hot.editMode" :class="{disable: menu.hot.existsKeys[page.key]}" :href="page.to" @click.prevent :style="{'padding-left':page.level * 0.5 + 'em'}">
                                        <span class="page-name">{{page.name}}</span>
                                        <i class="add-to-common el-icon-circle-plus-outline"></i>
                                    </a>
                                    <router-link v-else-if="page.to" :to="page.to" :style="{'padding-left':page.level * 0.5 + 'em'}">
                                        <span class="page-name">{{page.name}}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li v-for="(module, index) in menu.list" @mouseover.stop="switchHover(menu, index + 1)" @mouseout.stop="switchBlur"
                        :class="{hover:index + 1 === menu.hoverIndex}" :key="module.key" @click.prevent="handlerNodeClick(module)">
                        <a v-if="menu.hot.editMode && module.to" class="node-name" :class="{disable: menu.hot.existsKeys[module.key]}" :href="module.to">{{module.name}}<i class="arrow el-icon-arrow-right"></i><i class="add-to-common el-icon-circle-plus-outline"></i>
                        </a>
                        <router-link v-else-if="module.to" class="node-name" :to="module.to">
                            {{module.name}}<i class="arrow el-icon-arrow-right"></i>
                        </router-link>
                        <span v-else class="node-name">{{module.name}}<i class="arrow el-icon-arrow-right"></i></span>
                        <ul class="page-node" v-if="module.list">
                            <li v-for="(group, index) in module.list" @mouseover.stop="switchHover(module, index)" @mouseout.stop="switchBlur"
                                :class="{hover:index === (module.hoverIndex || 0)}" :key="group.key" @click.prevent="handlerNodeClick(group)">
                                <a v-if="menu.hot.editMode && group.to" class="node-name" :class="{disable: menu.hot.existsKeys[group.key]}" :href="group.to">{{group.name}}<i class="arrow el-icon-arrow-right"></i><i class="add-to-common el-icon-circle-plus-outline"></i>
                                </a>
                                <router-link v-else-if="group.to" class="node-name" :to="group.to">
                                    {{group.name}}<i class="arrow el-icon-arrow-right"></i>
                                </router-link>
                                <span v-else class="node-name">{{group.name}}<i class="arrow el-icon-arrow-right"></i></span>
                                <ul class="page-node page-leaf" v-if="group.list">
                                    <li v-for="page in group.list" :key="page.key">
                                        <a v-if="menu.hot.editMode" :class="{disable: menu.hot.existsKeys[page.key]}" :href="page.to" @click.prevent="handlerNodeClick(page)">
                                            <span class="page-name">{{page.name}}</span>
                                            <span class="page-desc">{{page.desc}}</span>
                                            <i class="add-to-common el-icon-circle-plus-outline"></i>
                                        </a>
                                        <router-link v-else-if="page.to" :to="page.to">
                                            <span class="page-name">{{page.name}}</span>
                                            <span class="page-desc">{{page.desc}}</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="common-menu-list edit" v-if="menu.hot.editMode" ref="hotMenu">
            <li class="drag-cell" v-for="(page, index) in menu.hot.list" :key="page.key" :k="page.key"
                @mouseover="handleMouseOver"
                @mouseout="handleMouseOut"
                :draggable="true"
                @dragstart="handleDragStart"
                @dragover="handleDragOver"
                @dragenter="handleDragEnter"
                @dragleave="handleDragLeave"
                @drop="handleDrop">
                <span>{{page.name}}</span>
                <i class="right-icon el-icon-close" @click.stop="handleDelSelect(index)"></i>
            </li>
            <li class="common-menu-setting">
                <span v-if="menu.hot.list.length === 0" class="notice" title="设置常用功能" @click.stop="editHotMenu">将常用功能加在此处</span>
                <i class="icon el-icon-setting" v-if="pageList.className!=='for-select'" @click.stop="editHotMenu"></i>
                <i class="icon icon-btn el-icon-check" @click.stop="saveHotMenu" v-if="pageList.className === 'for-select'">保存</i>
            </li>
        </ul>
        <ul class="common-menu-list" v-else ref="hotMenu">
            <li class="drag-cell" v-for="page in menu.hot.list" :key="page.key">
                <router-link :to="page.to">{{page.name}}</router-link>
            </li>
            <li class="common-menu-setting">
                <span v-if="menu.hot.list.length === 0" class="notice" title="设置常用功能" @click.stop="editHotMenu">将常用功能加在此处</span>
                <i class="icon el-icon-setting" v-if="pageList.className!=='for-select'" @click.stop="editHotMenu"></i>
                <i class="icon icon-btn el-icon-check" @click.stop="saveHotMenu" v-if="pageList.className === 'for-select'">保存</i>
            </li>
        </ul>
        <ul class="info-bar">
            <li class="staff">
                <div class="info-title"><img class="staff-avatar-icon" :src="user.position.staff.avatar" alt="头像"/>{{user.position.staff.nickname
                    || user.position.staff.name}}<i class="icon el-icon-arrow-down"></i></div>
                <div class="sub-menu-list user-status">
                    <img class="staff-avatar" :src="user.position.staff.avatar" alt="头像"/>
                    <ul class="staff-info">
                        <li class="name">{{user.position.staff.familyName + user.position.staff.name}}（{{user.position.staff.nickname}}）</li>
                        <li class="sign">{{user.position.staff.sign}}</li>
                        <li class="mood">{{user.person.mood}}</li>
                    </ul>
                    <ul class="position-info">
                        <li>{{user.position.organization}} - {{user.position.name}}</li>
                        <li class="notice">角色: {{user.position.role}}</li>
                        <li class="btn">
                            <a href="/account/logout.act" class="logout-btn">退出</a>
                            <a href="/team/logout.act" class="cancel-btn">注销</a>
                        </li>
                    </ul>
                </div>
            </li>
            <li class="task">
                <div class="info-title">任务<i class="icon el-icon-arrow-down"></i></div>
                <ul class="sub-menu-list drop-menu">
                    <li class="menu-cell">
                        <router-link to="/task/queue">待处理</router-link>
                    </li>
                    <li class="menu-cell">
                        <router-link to="/task/process">处理中</router-link>
                    </li>
                    <li class="menu-cell">
                        <router-link to="/task/finish">已完结</router-link>
                    </li>
                    <li class="menu-separation"></li>
                    <li class="menu-cell">
                        <router-link to="/task/create">创建事项</router-link>
                    </li>
                </ul>
            </li>
            <li class="chat">
                <div class="info-title"><i class="icon icon-large cs-icon-chat-outline"></i></div>
                <div class="sub-menu-list">

                </div>
            </li>
            <li class="info">
                <div class="info-title"><i class="icon icon-large el-icon-message"></i></div>
                <div class="sub-menu-list">

                </div>
            </li>
            <li class="help">
                <div class="info-title"><i class="icon icon-large el-icon-question"></i></div>
                <div class="sub-menu-list">

                </div>
            </li>
            <li class="mobile">
                <div class="info-title"><i class="icon icon-large el-icon-mobile-phone"></i></div>
                <div class="sub-menu-list">

                </div>
            </li>
            <li class="history">
                <div class="info-title"><i class="icon icon-large cs-icon-history"></i></div>
                <ul class="sub-menu-list">

                </ul>
            </li>
            <li class="open-new-window">
                <a :href="location" target="_blank" title="在新窗口打开"></a>
            </li>
        </ul>
    </div>
</template>
<script>
    import '../style/header.scss';

    import Vue from 'vue';
    import {Icon} from 'element-ui';
    import ajax from 'csmall-ajax';

    let timer = null;
    let isObject = function(object){
        return Object.prototype.toString.call(object) === '[object Object]';
    };

    export default {
        components: {Icon},
        data(){
            return {
                location: window.location.href,
                pageList: {
                    className: ''
                },
                menu: {
                    allName: '正在加载...',
                    list: [],
                    all: [],
                    hot: {
                        list: [],
                        existsKeys: {},
                        moveNode: null,
                        move: true,
                        dragging: false,
                        editMode: false
                    }
                },
                user: {
                    login: {
                        account: '', //本次登录用的账号
                        time: 0,     //登录时间
                        token: ''    //会话令牌
                    },
                    person: {
                        familyName: '',
                        name: '',
                        nickname: '',
                        sex: 2,
                        avatar: '',
                        sign: '',
                        mood: 3
                    },
                    position: {
                        organization: '',//组织 公司/部门
                        name: '',
                        role: '', //所拥有的角色
                        staff: {
                            familyName: '',
                            name: '',
                            nickname: '',
                            sex: 2,
                            avatar: 'http://kibey-sys-avatar.b0.upaiyun.com/2015/5/b6ce862936027ab0caec5799cf58276c1430823355.png',
                            sign: '',
                            entryTime: 0 //入职时间
                        }
                    }
                }
            };
        },
        created(){
            this.$store.dispatch('getUserInfo').then(() =>{//获取功能菜单
                this.preProcessMenuList();
            });
        },
        methods: {
            editHotMenu(){
                this.pageList.className = 'for-select';
                this.menu.hot.editMode = true;
            },
            hideFeatureList(){
                this.menu.hot.editMode = false;
                this.pageList.className = 'hide';
            },
            handlerNodeClick(page){
                if(!page.to){
                    return false;
                }
                if(this.menu.hot.editMode){//添加到常用列表
                    if(!this.menu.hot.existsKeys[page.key]){
                        this.menu.hot.list.push({
                            name: page.name,
                            key: page.key,
                            to: page.to,
                            icon: page.icon
                        });
                        Vue.set(this.menu.hot.existsKeys, page.key, 1);
                    }
                }else{
                    this.hideFeatureList();
                }
                return false;
            },
            releaseHide(){
                this.pageList.className = this.pageList.className.replace(/ *hide */, '');
            },
            switchHover(obj, index){
                timer = setTimeout(() =>{
                    obj.hoverIndex = index;
                    this.$forceUpdate();
                }, 200);
            },
            switchBlur(){
                if(timer){
                    clearTimeout(timer);
                }
            },
            handleMouseOut(event){
                event.stopPropagation();
                let dom = event.target;
                if(event.target.tagName.toLowerCase() !== 'li'){
                    dom = dom.parentElement;
                }
                dom.className = 'drag-cell';
            },
            handleMouseOver(event){
                event.stopPropagation();
                if(!this.dragging){
                    let dom = event.target;
                    if(event.target.tagName.toLowerCase() !== 'li'){
                        dom = dom.parentElement;
                    }
                    dom.className = 'drag-cell drag-enter';
                }
            },
            handleDelSelect(index){
                if(index > -1){
                    Vue.delete(this.menu.hot.existsKeys, this.menu.hot.list[index].key);
                    Vue.delete(this.menu.hot.list, index);
                }
            },
            handleDragStart(event){
                this.dragging = true;
                event.dataTransfer.setData("text", event.target.innerText); //兼容火狐
                event.stopPropagation();
                this.moveNode = event.target;
            },
            handleDragEnter(event){
                let curDom = event.target, curIndex = 0, el = this.$refs.hotMenu;
                if(curDom.nodeName.toLowerCase() === 'li'){
                    el.childNodes.forEach((item, index) =>{
                        if(curDom === item){
                            curIndex = index;
                            item.className = 'drag-cell ';
                        }
                    });
                    el.removeChild(this.moveNode);
                    el.insertBefore(this.moveNode, el.childNodes[curIndex]);
                    el.childNodes[curIndex].className = 'drag-cell drag-enter';
                }
            },
            handleDragLeave(event){
                event.preventDefault();
            },
            handleDragOver(event){
                event.preventDefault();
            },
            handleDrop(event){
                event.dataTransfer.clearData("text"); //清除数据
                this.dragging = false;
                event.preventDefault();
                this.moveNode.className = 'drag-cell';
            },
            saveHotMenu(){
                const getKeys = (nodes) =>{
                    const collected = [];
                    nodes.forEach((item) =>{
                        if(item.nodeType === 1){
                            if(item.className.indexOf('drag-cell') !== -1){
                                collected.push(item.attributes.getNamedItem('k').textContent);
                            }else if(item.className.indexOf('drag-group') !== -1){
                                collected.push({
                                    name: '',
                                    node: getKeys(item.childNodes)
                                });
                            }
                        }
                    });
                    return collected;
                };
                const keys = getKeys(this.$refs.hotMenu.childNodes);

                ajax.put('team/position/common-menu', {
                    data: {list: keys}
                }).success(() =>{
                    this.hideFeatureList();
                });
            },
            preProcessMenuList(){
                let nodes = {};
                this.menu.allName = '所有产品';
                this.menu.list = this.$store.state.user.menu.list;
                this.user = this.$store.state.user.info;

                const pushTo = (node, item, level) =>{
                    if(node.to){
                        node.level = level;
                        item.push(node);
                        nodes[node.key] = node;
                    }
                    if(node.list){
                        node.list.forEach(f =>{
                            pushTo(f, item, level + 1);
                        });
                    }
                };

                this.menu.list.forEach((node) =>{
                    let item = [];
                    pushTo(node, item, 0);
                    this.menu.all.push({
                        name: node.name,
                        list: item
                    });
                });

                const fillCommon = (keys, common) =>{
                    keys.forEach(key =>{
                        if(isObject(key)){
                            let list = [];
                            fillCommon(key.list, list);
                            common.push({
                                name: key.name,
                                list: list
                            });
                        }else if(typeof nodes[key] !== 'undefined'){
                            this.menu.hot.existsKeys[key] = 1;
                            common.push(nodes[key]);
                        }
                    });
                };
                fillCommon(this.$store.state.user.menu.hot, this.menu.hot.list);
            }
        }
    };
</script>