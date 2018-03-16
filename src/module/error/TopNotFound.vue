<template>
    <div class="not-found-page">
        功能不存在或在开发中
    </div>
</template>

<script>
    export default {
        beforeRouteUpdate(to, from, next){
            if(window.location.pathname === to.path){
                next();
            }else{
                window.location.href = to.path;
            }
        }
    }
</script>

<style>
.not-found-page{
    padding:56px 16px;
}
</style>