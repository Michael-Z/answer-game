<template>
    <div class="loading">
        <div class="field">
            <div class="center-circle">
                <div class="circle-up info">
                    <div class="peas">
                        入场费<span class="num">{{$route.query.cost}}猫豆</span>
                    </div>
                    <div class="name">等待玩家入场</div>
                    <div class="wait" v-if="loading">
                        <svg width="66" height="66" viewbox="0 0 66 66">
                            <defs>
                                <linearGradient x1="1" y1="0" x2="0" y2="0" id="gradient">
                                    <stop offset="0%" stop-color="#9bc736"></stop>
                                    <stop offset="100%" stop-color="#ea6c5f"></stop>
                                </linearGradient>
                            </defs>
                            <circle cx="33" cy="33" r="30" stroke-width="2" stroke="url('#gradient')" fill="none"></circle>
                            <circle cx="33" cy="33" r="26" fill="#fff"></circle>
                        </svg>
                    </div>
                    <div class="head" v-else>
                        <img src="../../assets/head.jpg"/>
                    </div>
                </div>
                <div class="circle-down info">
                    <div class="head">
                        <img :src="self.headImg"/>
                    </div>
                    <div class="name">{{self.nickName}}</div>
                    <div class="peas">
                        入场费<span class="num">{{$route.query.cost}}猫豆</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cancel-box">
            <button class="cancelBtn" @click="handleCancel">取消挑战</button>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            self:{
                type: Object,
                required: true,
            },
            opponent:{
                type: Object,
            },
            cost:{
                type: Number,
                required: true
            },
            cancel:{
                type: Function,
            }
        },
        data(){
            return{
                loading: true,
            }
        },
        methods:{
            handleCancel(){
                this.cancel();
                this.$router.push('/game/home');
            }
        }
    }
</script>
<style lang="scss">
    .loading{
        display: flex;
        height: 100vh;
        flex-direction: column;

        .field{
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: url("../../assets/loading-bg.png") no-repeat center,
                        url("../../assets/loading-bg-0.png") no-repeat center .4rem,
                        url("../../assets/loading-bg-1.png") no-repeat center bottom;
            background-size: 2.82rem auto, 100% auto, 100%, auto;
            .center-circle{
                position: relative;
                flex: 0 0 5.2rem;
                width: 5.2rem;
                height: 5.2rem;
                border: .2rem solid #fed95a;
                border-radius: 50%;
                .info{
                    position: absolute;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: #fff;
                    height: 2.1rem;
                }
                .circle-up{
                    top: -1.5rem;
                }
                .circle-down{
                    bottom: -1.5rem;
                    .name,.peas{
                        display: flex;
                        align-items: flex-end;
                    }
                }
                .wait{
                    flex: 0 0 1.6rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .rotate{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 1.4rem;
                        height: 1.4rem;
                        border-radius: 50%;
                        border: 2px solid transparent;
                        border-image: -webkit-linear-gradient( #9bc736, #ea6c5f);
                    }
                }
                .head{
                    flex: 0 0 1.2rem;
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 50%;
                    border: .06rem solid #fff;

                    img{
                        width: 100%;
                        border-radius: 50%;
                    }
                }
                .name{
                    flex-grow: 1;
                    font-size: 16px;
                    font-weight: 600;
                }
                .peas{
                    flex: 0 0 .36rem;
                    font-size: 14px;
                    .num{
                        color: #fed95a;
                    }
                }
            }
            .arc{
                flex: 0 0 2.19rem;
                width: 100%;
                background: url("../../assets/loading-bg-0.png") no-repeat center;
                background-size: 100% auto;
            }
            .bottom-bg{
                transform: rotate(180deg);
            }
        }

        .cancel-box{
            flex: 0 0 1.94rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .cancelBtn{
                width: 2.4rem;
                height: .8rem;
                text-align: center;
                border-radius: 3px;
                border: .04rem solid #4263cb;
                color: #6288ff;
                font-size: 14px;
                background: #28449e;
            }
        }
        svg circle{
            animation: a 1000s linear;
            -webkit-animation: a 1000s linear;
            -moz-animation: a 1000s linear;
            transform-origin:center center;
        }
    }
    @keyframes a{
        form{
            transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
        }
        to{
            transform: rotate(360000deg);
            -webkit-transform: rotate(360000deg);
            -moz-transform: rotate(360000deg);
        }
    }
</style>