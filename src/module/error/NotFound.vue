<template>
    <div class="not-found-page">
        功能不存在或在开发中
    </div>
</template>

<script>
    export default {
        beforeRouteEnter(to, from, next){
            next();
        }
    }
</script>

<style>
.not-found-page{
    padding:16px;
}
</style>