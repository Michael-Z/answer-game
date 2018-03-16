<template>
    <div class="main-container">
        <router-view></router-view>
    </div>
</template>

<script>
    import ajax from 'csmall-ajax';

    ajax.option.judge['401'] = xhr =>{
        let url = (xhr.data && xhr.data.data && xhr.data.data.loginUrl) || '/';
        location.href = url + '?ref=' + window.location.pathname;
    };

    export default {
        data(){
            return {};
        }
    }
</script>
<style>
    .main-container{
        position: relative;
        width:100%;
        background: #28449e;
    }
</style>