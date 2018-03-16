<template>
    <div class="count-down" :style="'width:'+ width+'px;height:'+ height+'px;'">
        <svg :width="width" :height="height" :viewbox="'0 0 '+width+' '+height">
            <circle :cx="width/2" :cy="height/2" :r="width/2-(progressWidth+2)" :stroke-width="progressWidth" stroke="#fd7059" fill="none"></circle>
            <!---加v-if去判断，主要是为了解决ios兼容性的问题，不加ios上圆圈会有缝隙--->
            <circle :cx="width/2" :cy="height/2" :r="width/2-(progressWidth+2)" :stroke-width="progressWidth+2" stroke="#fff" fill="none" v-if="startClock" :stroke-dasharray="curPerimeter+' '+perimeter"></circle>
            <circle :cx="width/2" :cy="height/2" :r="width/2-(progressWidth+2)*2" fill="#28449e"></circle>
        </svg>
        <div class="text">{{num}}</div>
    </div>
</template>
<script>
    export default {
        props:{
            width:{
                type: Number,
            },
            height:{
                type: Number,
            },
            progressWidth:{
                type: Number,
            }
        },
        data(){
            return{
                startClock: true,
                num: 10,
                curPerimeter: 0,
                size: 1,
            }
        },
        computed:{
            perimeter(){
                return Math.PI*2*(this.width/2-(this.progressWidth+2))
            }
        },
        methods:{
            changeText(){

            },
            start(){
                let timer = null, onePerimeter = this.perimeter/100;
                const clock = () =>{
                    timer = setTimeout(()=>{
                        if(this.size < 10){
                            this.size++;
                        }else{
                            this.size = 1;
                        }
                        if(this.num > 0){
                            if(this.size >= 10){
                                this.num--;
                            }
                            this.curPerimeter += onePerimeter;
                            clock();
                        }else{
                            clearTimeout(timer);
                            timer = null;
                        }
                    }, 100)
                }
            },
            stop(){

            },
            pause(){

            },
            press(){

            }
        }
    }
</script>
<style lang="scss">
    .count-down{
        background: #fff;
        position: relative;
        border-radius: 50%;
        svg{
            transform: rotate(-90deg);
        }
        .text{
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            width: 100%;
            height: 100%;
        }
    }
</style>