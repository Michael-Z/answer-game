<template>
    <transition name="fade" mode="out-in">
        <keep-alive :include="cachedViews">
            <router-view></router-view>
        </keep-alive>
    </transition>
</template>
<script>
    import Scrollbar from '../component/Scroller';

    export default {
        components: {Scrollbar},
        computed: {
            cachedViews(){
                return [];
            }
        }
    };
</script>
<style>
    .stage-no-sidebar{
        position:absolute;
        background: #28449e;
        top:50px;
        left:0;
        right:0;
        bottom:0;
    }
</style>