<!--suppress ALL -->
<template>
    <div class="login-body">
        <div class="login-bg">

        </div>
        <div class="page-login" ref="content" :style="{right: '20%'}">
            <div class="login-box" :style="{paddingTop:pos.top + 'px'}">
                <div class="login-form" ref="loginBox">
                    <h1 class="projectName">登录CSmall运营平台</h1>
                    <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm" size="medium" v-show="isLogin">
                        <el-form-item prop="account" label="账号">
                            <el-input autofocus type="text" placeholder="手机/电子邮箱" v-model="loginForm.account"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="密码">
                            <el-input type="password" placeholder="***" v-model="loginForm.password"></el-input>
                        </el-form-item>
                        <el-button native-type="submit" type="primary" size="large">登录</el-button>
                        <a href="#" @click="findPassword" class="forgetPassword">忘记密码?</a>
                        <!--<span class="switch" @click="switchLoginType('qr-code')">扫码登录</span>-->
                        <i class="pic qrcode" @click="switchLoginType('qr-code')"></i>
                    </el-form>

                    <div class="qr-code-iframe" v-show="!isLogin">
                        <i class="pic pc" @click="switchLoginType('account')"></i>
                        <iframe class="qr-code" :src="'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid='+appid+'&agentid='+agentid+'&redirect_uri='+to+'&state='+state+'&href='+href">

                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    $icon-bg-size: 68px;
    .login-body{
        width:100%;
        height:100%;
    }

    .login-bg{
        width:100%;
        height:100%;
    }

    .login-box .el-input input{
        background:rgba(255, 255, 255, 0.8);
        padding:0 0.4em;
    }

    .login-box .el-input{
        max-width:14em;
    }

    .login-box .el-form-item .el-form-item__error{
        left:7.2em;
        margin-top:-3px;
    }

    .login-box .el-button{
        margin-top:1.5em;
        padding:0.8em 2em;
    }
    .login-box .el-form-item{
        margin-bottom:20px;
    }

    .login-box .el-form-item__label{
        padding:0 2em;
        color:#ffffff;
        background:rgba(213, 133, 18, 0.8);
        margin-right:-2px;
    }

    .login-box .el-form-item.is-required .el-form-item__label:before{
        content:'';
    }

    .page-login{
        width:90%;
        max-width:1200px;
        height:100%;
        margin:0 auto;
        position:absolute;
        top:0;
        visibility:hidden;
    }

    .login-box{
        width:380px;
        height:100%;
        margin:0 0 0 auto;
        background:rgba(213, 133, 18, 0.5);
    }

    .projectName{
        font-size:1.5em;
        text-align:center;
        padding:0 2em 2em 0;
        color:rgba(255, 255, 255, 0.71);
    }

    .login-form{

        padding:1em 0 0 3em;

        .el-form{
            position: relative;
            padding-top: 3em;
        }
        .switch{
            margin-left: 5px;
            color: #fff;
        }
        .pic{
            position: absolute;
            top:0;
            right: 0;
            width: $icon-bg-size;
            height: $icon-bg-size;
        }
        .pc{
            background: url("../../assets/pc.png") no-repeat;
            background-size: $icon-bg-size $icon-bg-size;
        }
        .qrcode{
            background: url("../../assets/qrcode.png") no-repeat;
            background-size: $icon-bg-size $icon-bg-size;
        }
    }

    .login-form .forgetPassword{
        color:rgba(253, 253, 255, 0.76);
        font-size:0.8em;
        margin:1.5em 0 0 .5em;
    }

    .qr-code-iframe{
        position: relative;
        margin-left: -3em;
        padding-top: 3em;
        .qr-code{
            width: 100%;
            height: 260px;
        }
    }

    .switch{
        text-align: center;
        margin-top: 15px;
        color: rgba(213, 133, 18, 1);
        text-decoration: underline;
        cursor: pointer;
    }
</style>
<script>
    import Vue from 'vue';
    import {Form, Button, FormItem, Input, Icon} from 'element-ui';

    import r from 'csmall-ajax';


    Vue.use(Form);
    Vue.use(Input);
    Vue.use(FormItem);
    Vue.use(Button);
    Vue.use(Icon);

    export default {
        data(){
            return {
                isLogin: false,
                loginForm: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                },
                pos: {
                    top: 0,
                    //left: 0
                },
                appid: 'ww3e3f3c8b831e7d87',
                agentid:'1000065',
                state:'csmall',
                href:'https://docs-resource.csmall.com/css/wechat.css',
                to: encodeURI('http://pt.try.csmall.com/account/wxLogin.act'),
            };
        },
        methods: {
            submitForm(){
                // const form = this.$refs['loginForm'];
                // form.validate((valid) =>{
                //     if(valid){
                //         r.post('account/login', {
                //             data: {account: form.model.account, password: form.model.password},
                //         }).success(() =>{
                //             let to = '/user/team/entry';
                //             console.log(this.$router);
                //             let ref = this.$router.currentRoute.query.ref || '';
                //             if(ref.indexOf(to) === 0){
                //                 to = ref;
                //             }else if(ref){
                //                 to += '?ref=' + ref;
                //             }
                //             this.$router.push(to);
                //         });
                //     }else{
                //         return false;
                //     }
                // });
                this.$router.push('home');
                return false;
            },
            findPassword(){

            },
            switchLoginType(type){
                if(type === 'account'){
                    this.isLogin = true;
                }else{
                    this.isLogin = false;
                }
            }
        },
        mounted(){
            this.$refs.loginForm.$el.onsubmit = () =>{
                return this.submitForm();
            };
            let self = this;
            const box = this.$refs.content;
            const size = {
                width: box.clientWidth,
                height: this.$refs.loginBox.clientHeight
            };
            const de = document.documentElement;
            window.onresize = () =>{
                Vue.set(self, 'pos', {
                    top: (Math.min(300, de.clientHeight - size.height)) / 2,
                    //left: (Math.max(0, de.clientWidth - size.width)) / 2
                });
            };
            window.onresize();
            box.style.visibility = 'visible'
        }
    }
</script>