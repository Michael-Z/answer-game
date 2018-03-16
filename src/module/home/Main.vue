<template>
    <div class="home">
        <div class="infoBox">
            <div class="avatar">
                <img :src="user.headImg">
            </div>
            <div class="info">
                <div class="name">{{user.nickName}}</div>
                <div class="peas">
                    <span class="label">猫豆<i class="icon cs-icon-maodou"></i></span>
                    <span class="num">{{user.catBean}}</span>
                </div>
            </div>
            <div class="operation">
                <div class="btn">
                    <button class="credit" @click="handleCredit">充值</button>
                </div>
                <a href="/#/My/StoreExchangeRecord" class="record">出入金记录<i class="icon el-icon-arrow-right"></i></a>
            </div>
        </div>
        <div class="floor-box">
            <div :class="'floor floor-0'+(index+1)" @click="handleEntry(item.id, item.price)" v-for="(item,index) in rooms">
                <div class="text-box">
                    <div class="title">
                        LV.{{index+1}}<span>{{item.name}}</span>
                        <i class="icon cs-icon-star" v-for="(item,key) in rooms" v-if="key <= index"></i>
                    </div>
                    <div class="cont">
                        <p class="label">入场费</p>
                        <p class="num">{{item.price}}</p>
                        <p class="reward">奖励<span>×2</span></p>
                    </div>
                </div>
                <img :src="item.img"/>
            </div>
            <!--<div class="floor-02 floor">
                <div class="text-box">
                    <div class="title">
                        LV.2<span>顽强青铜</span>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                    </div>
                    <div class="cont">
                        <p class="label">入场费</p>
                        <p class="num">50</p>
                        <p class="reward">奖励<span>×2</span></p>
                    </div>
                </div>
                <img src="../../assets/floor_02.png"/>
            </div>
            <div class="floor-03 floor">
                <div class="text-box">
                    <div class="title">
                        LV.3<span>傲气白银</span>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                    </div>
                    <div class="cont">
                        <p class="label">入场费</p>
                        <p class="num">100</p>
                        <p class="reward">奖励<span>×2</span></p>
                    </div>
                </div>
                <img src="../../assets/floor_03.png"/>
            </div>
            <div class="floor-04 floor">
                <div class="text-box">
                    <div class="title">
                        LV.4<span>聪慧黄金</span>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                    </div>
                    <div class="cont">
                        <p class="label">入场费</p>
                        <p class="num">500</p>
                        <p class="reward">奖励<span>×2</span></p>
                    </div>
                </div>
                <img src="../../assets/floor_04.png"/>
            </div>
            <div class="floor-05 floor">
                <div class="text-box">
                    <div class="title">
                        LV.5<span>智者大师</span>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                        <i class="icon cs-icon-star"></i>
                    </div>
                    <div class="cont">
                        <p class="label">入场费</p>
                        <p class="num">1000</p>
                        <p class="reward">奖励<span>×2</span></p>
                    </div>
                </div>
                <img src="../../assets/floor_05.png"/>
            </div>-->
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { Toast } from 'mint-ui';

    export default {
        data(){
            return{
                user:{},
                socket: null,
                rooms:[]
            }
        },
        watch:{
            'userInfo'(val){
                this.user = val;
            },
            'roomList'(val){
                val.map((item,index)=>{
                    item.img = require('../../assets/floor_0'+(index+1)+'.png');
                })
                this.rooms = val;
            }
        },
        computed:{
            'userInfo'(){
                return this.$store.state.user.userInfo;
            },
            'roomList'(){
                return this.$store.state.user.roomList
            }
        },
        mounted(){
            this.$store.dispatch('getUserInfo').then(()=>{
                this.$store.dispatch('getRoomList');
            });
        },
        methods:{
            handleEntry(num, cost){
                if(parseInt(this.user.catBean) > cost){
                    this.$router.push('/game/room/'+num+'?cost='+cost);
                }else{
                    Toast('您的猫豆不足')
                }
            },
            handleCredit(){
                window.location.href = '/#/MoneyIn/Financialingot';
            }
        }
    }
</script>

<style lang="scss">
    .home{
        display: flex;
        padding: .3rem;
        flex-flow: column;
        overflow: hidden;
        padding-bottom: 1.6rem;
        background-image: url("../../assets/top-bg.png"), url("../../assets/bottom-bg.png");
        background-repeat: no-repeat;
        background-position: top center, bottom right;
        background-size: 2.67rem auto, 3.01rem auto;
        .infoBox{
            position: relative;
            display: flex;
            width: 100%;
            flex: 0 0 2.2rem;
            padding: .28rem;
            background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1));
            .avatar,.info,.credit{
                display: flex;
            }
            .avatar{
                flex: 0 0 1rem;
                img{
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    border: .04rem solid #fff;
                }
            }
            .info{
                display: flex;
                flex-grow: 1;
                flex-flow: column;
                .name{
                    display: flex;
                    flex: 0 0 1rem;
                    font-size: 16px;
                    color: #fff;
                    padding: 0 .2rem;
                    align-items: center;
                }
                .peas{
                    padding: 0 .2rem;
                    display: flex;
                    flex-flow: column;
                    flex-grow: 1;
                    justify-content: flex-end;
                    color: #fed64e;

                    .icon{
                        display: inline-block;
                        margin-left: 5px;
                    }
                    .num{
                        font-size: 24px;
                    }
                }
            }
            .operation{
                display: flex;
                flex: 0 0 1.8rem;
                flex-flow: column;
                a{
                    text-decoration: none;
                }
                .btn{
                    display: flex;
                    flex: 0 0 1rem;
                    align-items: center;
                    justify-content: flex-end;
                    .credit{
                        display: inline-block;
                        width: 1.32rem;;
                        height: .6rem;
                        border-radius: .3rem;
                        background: #fed95a;
                        font-size: 14px;
                        color: #445cb6;
                        box-shadow: 0 0 .2rem #fed95a;
                    }
                }
                .record{
                    display: flex;
                    flex-grow: 1;
                    align-items: flex-end;
                    color: #fff;
                }
            }
        }
        .info:before{
            content: '';
            position: absolute;
            top: -.06rem;
            left: -.06rem;
            width: .51rem;
            height: .49rem;
            background: url("../../assets/zj-left.png") no-repeat;
            background-size: .51rem .49rem;
        }
        .info:after{
            content: '';
            position: absolute;
            top: -.06rem;
            right: -.06rem;
            width: .51rem;
            height: .49rem;
            background: url("../../assets/zj-right.png") no-repeat;
            background-size: .51rem .49rem;
        }
        .floor-box{
            flex-grow: 1;
            margin-top: .6rem;
            img{
                display: block;
                width: 100%;
            }
            .floor{
                position: relative;
                .text-box{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    color: #fff;
                    display: flex;
                    flex-flow: column;
                    .title{
                        flex: 0 0 .48rem;
                        padding-left: 1rem;
                        font-size: 14px;
                        line-height: .48rem;
                        span{
                            margin: 0 .2rem;
                        }
                    }
                    .cont{
                        width: 5.2rem;
                        display: flex;
                        flex-grow: 1;
                        flex-flow: column;
                        align-items: flex-end;
                        padding-right: .5rem;
                        margin-top: .2rem;
                        margin-bottom: .4rem;
                        justify-content: space-between;
                        .num{
                            font-size: 36px;
                        }
                    }
                    .icon{
                        color: #fed64e;
                        margin-right: .1rem;
                        text-shadow: 0 0 5px #fed64e;
                    }
                }
                .reward span{
                    color: #fed64e;
                }
            }
            .floor-02 .text-box{
                padding-left: 1.7rem;
            }
            .floor-04 .text-box{
                padding-left: 1.7rem;
            }
            .floor-01{
                .text-box{
                    .title{
                        padding-left: .88rem;
                    }
                }
            }

            .floor-03,.floor-04,.floor-05{
                .text-box .cont{
                    margin-top: .25rem;
                    margin-bottom: .35rem;
                }
            }
        }

        @media (max-width: 360px) {
            .floor-box{
                .floor {
                    .text-box {
                        .cont {
                            font-size: 12px;
                            .num{
                                font-size: 26px;
                            }
                        }
                        .icon{
                            font-size: 12px;
                        }
                        .title{
                            span{
                                margin: 0 .1rem;
                            }
                        }
                    }
                }
            }
            .infoBox{
                .info{
                    .peas {
                        font-size: 12px;
                        .num{
                            font-size: 22px;
                        }
                    }
                }
                .operation {
                    .record{
                        font-size: 12px;
                    }
                }
            }
        }
        @media (max-width: 320px) {

        }
    }


</style>