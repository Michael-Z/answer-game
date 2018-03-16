<template>
    <div class="test">
        <count-down :width="width" :height="height" :progressWidth="progressWidth"></count-down>
    </div>
</template>
<script>
    import CountDown from '../../component/CountDown';
    export default {
        components:{CountDown},
        data(){
            return{
                width: 70,
                height: 70,
                progressWidth: 6,
            }
        }
    }
</script>
<style>

</style>