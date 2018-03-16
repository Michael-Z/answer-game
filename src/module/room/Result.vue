<template>
    <div class="result-view">
        <div :class="result"></div>
        <div class="flag-bar">
            <div :class="blueStyle">
                <div class="cont">
                    <div class="wins">
                        <span class="num" v-if="data.self.num">{{data.self.num}}连胜</span>
                    </div>
                    <div class="head">
                        <img :src="self.headImg"/>
                    </div>
                    <div class="name">{{self.nickName}}</div>
                    <div class="mark">
                        <span class="num">{{data.self.score}}</span>分
                    </div>
                    <div class="success">
                        <div class="num">答对{{data.self.success}}题</div>
                    </div>
                </div>
            </div>
            <div :class="redStyle">
                <div class="cont">
                    <div class="wins">
                        <span class="num" v-if="data.opponent.num">{{data.opponent.num}}连胜</span>
                    </div>
                    <div class="head">
                        <img :src="opponent.head"/>
                    </div>
                    <div class="name">{{opponent.name}}</div>
                    <div class="mark">
                        <span class="num">{{data.opponent.score}}</span>分
                    </div>
                    <div class="success">
                        <div class="num">答对{{data.opponent.success}}题</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="booty">
            <div class="booty-num"><i class="icon cs-icon-maodou"></i>+{{data.catBean}}</div>
            <div class="gradients"></div>
        </div>
        <div class="btn-box">
            <button class="btn" @click="handleContinue">继续挑战</button>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            'data':{
                type: Object,
                required: true
            },
            'self':{
                type: Object,
                required: true
            },
            'opponent':{
                type: Object,
                required: true
            },
        },
        computed:{
            'result'(){
                let style = 'success';
                switch (this.data.result){
                    case 0:
                        style = 'fail';
                        break;
                    case 1:
                        style = 'success';
                        break;
                    case 2:
                        style = 'draw';
                        break;
                }
                return style+'  result-pic';
            },
            'blueStyle'(){
                let style = '';
                switch (this.data.result){
                    case 0:
                        style = 'fail';
                        break;
                    case 1:
                        style = 'win';
                        break;
                    case 2:
                        style = '';
                        break;
                }
                return 'flag blue '+style;
            },
            'redStyle'(){
                let style = '';
                switch (this.data.result){
                    case 0:
                        style = 'win';
                        break;
                    case 1:
                        style = 'fail';
                        break;
                    case 2:
                        style = '';
                        break;
                }
                return 'flag red '+style;
            }
        },
        methods:{
            handleContinue(){
                this.$router.push('/game/home');
            }
        }
    }
</script>
<style lang="scss">
    $--win-color:#fed95a;
    $--self-color: #4f8dff;
    $--opponent-color:#e64756;
    .result-view{
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding-bottom: 1.1rem;
        background: url("../../assets/answer-bottom.png") no-repeat bottom center;
        background-size: 2.43rem auto;

        .flag-bar{
            display: flex;
            flex: 0 0 4.8rem;
            padding: 0 .2rem;
            justify-content: space-between;
            .flag{
                flex: 0 0 3.44rem;
                color: #fff;
                border-bottom-left-radius: 1.72rem;
                border-bottom-right-radius: 1.72rem;
                .cont{
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    .wins{
                        display: flex;
                        flex: 0 0 .4rem;
                        .num{
                            display: flex;
                            align-items:flex-start;
                            justify-content: center;
                            width: 1.32rem;
                            color: #28449e;
                            font-size: 12px;
                            background: $--win-color;
                            border-bottom-right-radius: .3rem;
                        }
                    }
                    .head{
                        display: flex;
                        flex: 0 0 1.4rem;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 1.2rem;
                            height: 1.2rem;
                            border-radius: 50%;
                            border: .06rem solid #fff;
                        }
                    }
                    .name{
                        display: flex;
                        flex: 0 0 .72rem;
                        align-items: flex-start;
                        justify-content: center;
                    }
                    .mark{
                        display: flex;
                        flex: 0 0 .72rem;
                        align-items: flex-end;
                        justify-content: center;
                        font-size: 16px;
                        .num{
                            font-size: 36px;
                        }
                    }
                    .success{
                        flex-grow: 1;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        padding-top: .2rem;
                        .num{
                            width: 2rem;
                            height: .48rem;
                            color: #28449e;
                            border-radius: .24rem;
                            background: #fff;
                            display: flex;
                            align-items: center;
                            font-size: 12px;
                            justify-content: center;
                        }
                    }
                }
            }
            .blue{
                background: $--self-color;
            }
            .red{
                background: $--opponent-color;
            }
            .win{
                border: .08rem solid $--win-color;
                box-shadow: 0 0 10px #000;
            }
            .fail{
                box-shadow: 2px 0 10px #142f84 inset;
            }
        }
        .booty{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            .booty-num{
                flex: 0 0 1.4rem;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 4.6rem;
                border-bottom: .08rem solid $--win-color;
                font-size: 40px;
                color: #fff;
                .icon{
                    color: $--win-color;
                    margin-right: .2rem;
                }
            }
            .gradients{
                margin-top: .08rem;
                width: 3.86rem;
                height: .04rem;
                background: -webkit-linear-gradient(left, rgba(250, 214, 91, 0), rgba(250, 214, 91, 1), rgba(250, 214, 91, 0));
            }
        }
        .btn-box{
            flex: 0 0 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .btn{
                width: 4.4rem;
                height: 1.14rem;
                background: none;
                border: .04rem solid #fff;
                border-radius: .2rem;
                font-size: 20px;
                color: #fff;
            }
        }
        .result-pic{
            position: absolute;
            width: 4.02rem;
            height: 3.01rem;
            top: 3.9rem;
            left: 50%;
            margin-left: -2.01rem;
        }
        .success.result-pic{
            background: url("../../assets/success.png") no-repeat center center;
            background-size: 100% auto;
        }
        .fail.result-pic{
            background: url("../../assets/fail.png") no-repeat center center;
            background-size: 100% auto;
        }
        .draw.result-pic{
            background: url("../../assets/draw.png") no-repeat center center;
            background-size: 100% auto;
        }
        @media (max-width: 360px) {
            .booty{
                .booty-num{
                    flex: 0 0 1rem;
                    font-size: 24px;
                }
            }
        }
    }

</style>