<template>
    <div class="login-mask">
        <div class="login-form" ref="loginBox">
            <h1 class="projectName">登录CSmall运营平台</h1>
            <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm" size="medium">
                <el-form-item prop="account" label="账号">
                    <el-input autofocus type="text" placeholder="手机/电子邮箱" v-model="loginForm.account"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input type="password" placeholder="***" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-button native-type="submit" type="primary" size="large">登录</el-button>
                <a href="#" @click="findPassword" class="forgetPassword">忘记密码?</a>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login-form"
    }
</script>

<style lang="scss">
    .login-mask{
        position:absolute;
        z-index:2000;
        background:rgba(15, 15, 15, 0.36);
        top:0;
        left:0;
        width:100%;
        height:100%;
        .login-form{

        }
    }
</style>