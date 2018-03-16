<template>
    <transition name="slide-left">
        <router-view></router-view>
    </transition>
</template>

<style>
    .slide-left-enter-active, .slide-left-leave-active{
        transition:transform .5s;
        transform-origin:left;
    }

    .slide-left-enter, .slide-left-leave-active{
        transform:scale(0, 1);
    }
    html, body{
        height:100%;
        background:#382423 url(../../assets/login_bg.jpg) no-repeat center center;
    }
</style>