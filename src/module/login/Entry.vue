<!--suppress ALL -->
<template>
    <div id="role-select">
        <div class="person" :style="{width:pos.personWidth + 'px'}">
            <div class="cell" ref="personCell" :style="{top:pos.personTop + 'px'}">
                <img class="avatar" :src="person.avatar"/>
                <ul class="profile">
                    <li class="name">{{person.nickname}}</li>
                    <li class="mobile">{{person.mobile}}</li>
                    <li class="email">{{person.email}}</li>
                </ul>
                <div class="sign">{{person.sign}}</div>
                <div><a href="/person/modify_info" target="_self" title="修改个人资料">修改个人资料</a></div>
                <dl class="security">
                    <dt>最近一次登录</dt>
                    <dd>时间: <span class="last-login-time">{{person.lastLoginTime}}</span></dd>
                    <dd>地点: <span class="last-login-area">{{person.lastLoginArea}}</span></dd>
                    <dd><a href="/person/modify_password" target="_self" title="修改密码">修改密码</a></dd>
                </dl>
            </div>
        </div>
        <div class="position" ref="positionContainer" :style="{top:pos.positionTop + 'px',left:pos.personWidth + 'px'}">
            <div class="cell empty" v-if="positions.length <= 0">
                <p>没有可用职位</p>
                <p></p>
            </div>
            <div class="cell" v-for="(position, key) in positions" :key="key" @click="selectPosition(position.id)">
                <img class="avatar" :src="position.avatar"/>
                <ul class="profile">
                    <li class="name">{{position.name}}</li>
                    <li class="postion">{{position.positionName}}({{position.roleName}})</li>
                </ul>
                <div class="sign">{{position.desc}}</div>
            </div>
        </div>
    </div>
</template>
<style>
    #role-select{
        font-size:14px;
        height:100%;
        position:relative;
    }

    #role-select .avatar{
        width:80px;
        border-radius:10%;
    }

    #role-select .sign{
        margin-top:1em;
        line-height:1.5em;
        color:rgba(255, 255, 255, 0.8);
        text-align:left;
        text-indent:2em;
        text-shadow:0 2px 1px rgba(255, 255, 255, 0.4);
    }

    #role-select .position .sign{
        text-indent:0;
        margin:0;
        padding:.2em 1em;
        float:left;
        text-shadow:none;
    }

    #role-select .security{
        margin-top:2em;
        text-align:left;
        color:rgba(0, 155, 255, 0.5);
    }

    #role-select .security dd{
        margin:.2em 0;
    }

    #role-select .cell a{
        color:rgba(255, 255, 255, 0.6);
        float:right;
        font-size:.9em;
    }

    #role-select .security dd a{
        color:rgba(0, 155, 255, 0.5);
    }

    #role-select .person{
        background:rgba(56, 36, 35, 0.6);
        padding:3em;
        border-right:1px solid rgba(0, 0, 0, 0.1);
        height:100%;
        position:relative;
    }

    #role-select .cell{
        box-shadow:0 0 3px rgba(255, 255, 255, 0.1);
    }

    #role-select .cell:hover{
        box-shadow:0 0 7px rgba(255, 255, 255, 0.2);
    }

    #role-select .person .cell{
        padding:2em 2em;
        margin:0 1em;
        text-align:center;
        color:#dddddd;
        background:rgba(0, 0, 0, 0.05);
        overflow:hidden;
        width:260px;
        float:right;
        position:absolute;
        right:0;
    }

    #role-select .position{
        width:700px;
        text-align:center;
        position:absolute;
        top:0;
    }

    #role-select .profile{
        text-align:left;
    }

    #role-select .person .profile{
        margin-top:.5em;
    }

    #role-select .profile li{
        display:block;
        padding:.2em 0;
        color:#ffffff;
    }

    #role-select .person .profile li{
        text-align:center;
    }

    #role-select .person .profile li.name{
        padding-bottom:1em;
        font-weight:bold;
    }

    #role-select .position .cell{
        clear:both;
        padding:1em;
        overflow:hidden;
        margin:0 0 20px 50px;
        background:rgba(0, 0, 0, 0.3);
        border-radius:3px;
        cursor:pointer;
    }

    #role-select .position .cell .profile{
        padding:0 1em;
        overflow:hidden;
        display:block;
    }

    #role-select .position .profile li.name{
        padding-bottom:.5em;
        font-weight:bold;
        display:block;
        clear:both;
    }

    #role-select .position .avatar{
        float:left;
    }

    #role-select .position .empty{
        padding:3em;
        color:rgba(255, 255, 255, 0.7);
    }
</style>
<script>
    import Vue from 'vue';
    import {Form, Button, FormItem, Input} from 'element-ui';

    import r from 'csmall-ajax';

    Vue.use(Form);
    Vue.use(Input);
    Vue.use(FormItem);
    Vue.use(Button);

    export default {
        data(){
            return {
                person: {
                    avatar: '',
                    nickname: '',
                    mobile: '',
                    email: '',
                    sign: '',
                    lastLoginTime: '',
                    lastLoginArea: ''
                },
                positions: [],
                pos: {
                    personTop: 300,
                    personWidth: 600,
                    positionTop: 200
                }
            };
        },
        methods: {
            countPosition(){
                const size = {
                    cellWidth: this.$refs.personCell.clientWidth,
                    personHeight: this.$refs.personCell.clientHeight,
                    totalWidth: this.$refs.personCell.clientWidth + this.$refs.positionContainer.clientWidth,
                    positionHeight: this.$refs.positionContainer.clientHeight
                };
                const de = document.documentElement;
                let self = this;
                window.onresize = () =>{
                    Vue.set(self, 'pos', {
                        personTop: (de.clientHeight - size.personHeight) * 2 / 5,
                        personWidth: (de.clientWidth - size.totalWidth) / 2 + size.cellWidth,
                        positionTop: (de.clientHeight - size.positionHeight) * 2 / 5
                    });
                };
                window.onresize();
            },
            fillData(){//从服务器获取数据
                r.get('account/entry/info').success((data) =>{
                    this.$set(this, 'person', data.person);
                    this.$set(this, 'positions', data.positions);
                }).error(xhr =>{
                    if(xhr.code === '401'){
                        let ref = this.$router.currentRoute.query.ref;
                        window.location.href = ref? '/?ref=' + ref: '/';
                    }
                });
            },
            selectPosition(id){
                r.get('account/entry/position/:id', {
                    path: {id: id}
                }).success((data) =>{
                    let ref = this.$router.currentRoute.query.ref;
                    window.location.href = ref? ref: '/overview/';
                });
            }
        },
        mounted(){
            this.countPosition();
            this.fillData();
        }
    }
</script>