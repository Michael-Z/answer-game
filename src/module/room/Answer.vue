<template>
    <div class="answer">
        <div class="left">
            <img v-if="self.headImg" :src="self.headImg"/>
        </div>
        <div class="right">
            <img :src="opponent.head"/>
        </div>
        <div class="time">
            <div class="clock">
                <svg width="66" height="66" viewbox="0 0 66 66">
                    <circle cx="33" cy="33" r="26" stroke-width="6" stroke="#fd7059" fill="none"></circle>
                    <!---加v-if去判断，主要是为了解决ios兼容性的问题，不加ios上圆圈会有缝隙--->
                    <circle cx="33" cy="33" r="26" stroke-width="8" stroke="#fff" fill="none" v-if="startClock" :stroke-dasharray="dasharray+' 3600'"></circle>
                    <circle cx="33" cy="33" r="18" fill="#28449e"></circle>
                </svg>
                <div class="text">{{num}}</div>
            </div>
        </div>
        <div class="nick-name">
            <div class="left-name">{{self.nickName}}</div>
            <div class="right-name">{{opponent.name}}</div>
        </div>
        <div class="question">
            <div class="type">第{{data.index+1}}题 / {{data.type}}</div>
            <div class="msg">
                <transiton name="fade" mode="out-in">
                    <div class="msg-bg-01 left-win" v-if="showLeftInning && leftWinNum > 1">
                        <div class="msg-bg-02">
                            <div class="msg-bg-03">
                                <div class="msg-bg-04">
                                    连续答对<span class="spec">{{leftWinNum}}</span>题
                                </div>
                            </div>
                        </div>
                    </div>
                </transiton>
                <transiton name="fade" mode="out-in">
                    <div class="msg-bg-01 right-win rotate" v-if="showRightInning && rightWinNum > 1">
                        <div class="msg-bg-02">
                            <div class="msg-bg-03">
                                <div class="msg-bg-04">
                                    <div class="rotate">连续答对<span class="spec">{{rightWinNum}}</span>题</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transiton>
            </div>
            <div class="text">{{data.question}}</div>
            <div class="notice">
                <transiton name="fade" mode="out-in">
                    <div class="notice-bg-01" v-if="isDouble">
                        <div class="notice-bg-02">
                            最后一题得分<span>X2</span>
                        </div>
                    </div>
                </transiton>
            </div>
        </div>
        <div class="result">
            <div class="l-mark">
                <div class="mark">{{l_mark}}</div>
                <div class="progress">
                    <div class="cur" :style="'margin-top:'+l_cur+'rem'"></div>
                </div>
            </div>
            <ul class="res-list">
                <li :class="item.style"
                    v-for="item in data.options"
                    @click="handleClick(item)">
                    <div>{{item.value}}</div>
                </li>
            </ul>
            <div class="r-mark">
                <div class="mark">{{r_mark}}</div>
                <div class="progress">
                    <div class="cur" :style="'margin-top:'+r_cur+'rem'"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            data: { //题目及选项信息
                type: Object,
                required: true
            },
            selected:{ //玩家选择
                type: Function,
                required:true
            },
            opponent:{ // 对手信息
                type: Object,
                required: true
            },
            self:{   //玩家信息
                type: Object,
                required: true
            },
            reconnect:{   //重新连接的数据
                type: Object
            }
        },
        data(){
            return{
                isDouble: false, //控制显示最后得分为双倍的信息
                allowClick: true, //是否允许点击
                waitSelect: true,  //等待玩家选择答案
                waitOpponent: true, //等待对手选择答案
                timer: null,  //timeout对象
                selectKey:'', //玩家选择的答案
                startClock: false,
                num: 10,  //倒计时数字
                dasharray: 0,  //倒计时圆圈进度值
                size: 1,  //用于计算运行多少秒
                l_mark: 0,  //左边分数
                r_mark: 0,  //右边分数
                fullProgress: 4.8,  //满分进度值
                scale: 0.004,  //进度条比例
                leftWinNum: 0,  //左边玩家胜利次数
                rightWinNum: 0,
                opponentRes: {},
                showLeftInning: true,
                showRightInning: true,
            }
        },
        watch:{
            'data.index'(to, f){
                this.clearClockStatus();
                this.startClock = false;
            },
            'data.step'(val){
                if(val && val == 'pushOption' && !this.timer){
                    this.startClock = true;
                    this.clock();
                }
            }
        },
        computed:{
            'l_cur': function(){
                return this.fullProgress - this.l_mark*this.scale;
            },
            'r_cur': function(){
                return this.fullProgress - this.r_mark*this.scale;
            }
        },
        mounted(){
            if(this.reconnect.step && this.reconnect.step == 'reconnect'){
                this.setReconnect(this.reconnect);
                if(this.reconnect.option && this.reconnect.option.length > 0 && !this.timer){
                    this.clock();
                }
            }
        },
        methods:{
            handleClick(item){
                if(this.allowClick){
                    this.allowClick = false;
                    this.selected(item.label);
                    this.$set(item, 'style', 'active');
                    this.selectKey = item.label;
                    this.waitSelect = false;
                    this.showLeftInning = true;
                }
            },
            clearClock(){  //清空倒计时
                clearTimeout(this.timer);
                this.timer = null;
                this.waitOpponent = true;
                this.waitSelect = true;
                this.showLeftInning = false;
                this.showRightInning = false;
                this.allowClick = false;
            },
            clearClockStatus(){ //清空倒计时状态
                this.num = 10;
                this.allowClick = true;
                this.dasharray = 0;
                this.size = 1;
                this.selectKey = '';
            },
            clock(){  // 倒计时
                this.timer = setTimeout(()=>{
                    if(this.size < 10){
                        this.size++;
                    }else{
                        this.size = 1;
                    }
                    if(this.num > 0){
                        if(this.size >=10){
                            this.num -= 1;
                        }
                        this.dasharray += 1.66;
                        this.clock();
                    }else{
                        this.clearClock();
                    }
                }, 100)
            },
            selectResult(data){ //玩家答完后显示分数和是否正确
                this.l_mark = data.total;
                if(this.waitOpponent && this.num > 0){
                    this.setLeftStyle(data);
                }
                if(data.right){
                    this.leftWinNum++;
                    if(this.data.index ==4){
                        this.isDouble = true;
                    }else{
                        this.isDouble = false;
                    }
                }else{
                    this.leftWinNum = 0;
                }
            },
            opponentResult(data){  //对手答完之后显示分数
                this.waitOpponent = false;
                this.r_mark = data.total;
                this.showRightInning = true;
                if(data.right){
                    this.rightWinNum++;
                }else{
                    this.rightWinNum = 0;
                }
            },
            setReconnect(data){   //设置重新链接的数据
                this.startClock = true;
                this.l_mark = data.score;
                this.r_mark = data.opponentScore;
                this.num = data.time;
                this.dasharray = (10 - this.num)*10*1.66;
                if(data.choose && data.choose != ''){
                    this.selectKey = data.choose;
                    this.setLeftStyle(data);
                }
            },
            questionResult(data){  //单次答题结束后显示结果
                this.data.options.forEach((item)=>{
                    if(data.rightAnswer == item.label){
                        if(data.opponentAnswer == data.rightAnswer && this.selectKey == data.rightAnswer){
                            this.$set(item, 'style', 'left-success right-success');
                        }else if(data.opponentAnswer == data.rightAnswer && this.selectKey != data.rightAnswer){
                            this.$set(item, 'style', 'right-success');
                        }else if(data.opponentAnswer != data.rightAnswer && this.selectKey == data.rightAnswer){
                            this.$set(item, 'style', 'left-success');
                        }else{
                            this.$set(item, 'style', 'success');
                        }
                    }else{
                        if(data.opponentAnswer == item.label && this.selectKey == item.label){
                            this.$set(item, 'style', 'left-error right-error');
                        }else if(data.opponentAnswer == item.label && this.selectKey != item.label){
                            this.$set(item, 'style', 'right-error');
                        }else if(data.opponentAnswer != item.label && this.selectKey == item.label){
                            this.$set(item, 'style', 'left-error');
                        }else{
                            this.$set(item, 'style', 'notAnswer');
                        }
                    }
                });
                this.$forceUpdate();
                this.clearClock();
            },
            setLeftStyle(data){
                this.data.options.forEach((item)=>{
                    if(this.selectKey == item.label){
                        if(data.right){
                            this.$set(item, 'style', 'left-success');
                        }else{
                            this.$set(item, 'style', 'left-error');
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .answer{
        position: relative;
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding-bottom: 1.1rem;
        background: url("../../assets/answer-bg.png") no-repeat top center,url("../../assets/answer-bottom.png") no-repeat bottom center;
        background-size: 3.74rem auto, 2.43rem auto;
        overflow: hidden;

        .left,.right{
            position: absolute;
            top: -.12rem;
            width: 2.4rem;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: .5rem;
            border-bottom-right-radius: 40px;
            border-top-right-radius: 40px;
            img{
                width: 64px;
                height: 64px;
                border-radius: 50%;
                border:4px solid #fff;
                margin-right: -.4rem;
            }
        }
        .left{
            left: -.12rem;
            background: #477fe6;
            transform:rotate(45deg);
            img{
                transform:rotate(-45deg);
            }
        }
        .right{
            right: -.12rem;
            background: #e64756;
            transform:rotate(135deg);
            img{
                transform:rotate(-135deg);
            }
        }
        .time{
            display: flex;
            flex: 0 0 1.72rem;
            justify-content: center;
            align-items: flex-end;
            padding-bottom: .15rem;
            svg{
                transform: rotate(-90deg);
            }
        }
        .nick-name{
            display: flex;
            flex: 0 0 .48rem;
            font-size: 12px;
            justify-content: space-between;
            .left-name, .right-name{
                display: flex;
                width: 2.94rem;
                color: #fff;
                justify-content: center;
                align-items: center;
            }
        }
        .clock{
            position: relative;
            width: 66px;
            height: 66px;
            border-radius: 50%;
            background: #fff;
            .text{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                font-size: 20px;
            }
        }
        .question{
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            justify-content: space-between;
            color: #fff;
            .type{
                flex: 0 0 .3rem;
                text-align: center;
                font-size: 14px;
            }
            .msg{
                position: relative;
                display: flex;
                align-items: center;
                flex: 0 0 .6rem;
                .right-win{
                    position: absolute;
                    right: 0;
                }
                .rotate{
                    transform: rotate(180deg);
                }
                .msg-bg-01,.msg-bg-02,.msg-bg-03,.msg-bg-04{
                    border-top-right-radius: .28rem;
                    border-bottom-right-radius: .28rem;
                }
                .msg-bg-01{
                    width: 2.72rem;
                    height: .56rem;
                    background: rgba(155, 199, 54, .2);
                }
                .msg-bg-02{
                    width: 2.48rem;
                    height: .56rem;
                    background: rgba(155, 199, 54, .4);
                }
                .msg-bg-03{
                    width: 2.24rem;
                    height: .56rem;
                    background: rgba(155, 199, 54, .6);
                }
                .msg-bg-04{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 2rem;
                    height: .56rem;
                    background: rgba(155, 199, 54, 1);
                    font-size: 12px;
                    span{
                        font-size: 18px;
                        margin-top: -2px;
                    }
                }
            }
            .text{
                flex-grow: 1;
                padding: 0 1rem;
                display: flex;
                font-size: 18px;
                line-height: 1.4;
                align-items: flex-end;
                justify-content: center;
            }
            .notice{
                display: flex;
                flex: 0 0 .6rem;
                justify-content: center;
                align-items: center;
                .notice-bg-01{
                    display: flex;
                    background: rgba(253, 112, 89, .5);
                    width: 3.6rem;
                    height: .4rem;
                    justify-content: center;
                    border-radius: .2rem;
                }
                .notice-bg-02{
                    display: flex;
                    background: rgba(253, 112, 89, 1);
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    height: .4rem;
                    width: 2.8rem;
                    font-size: 14px;
                    border-radius: .2rem;

                    span{
                        font-weight: 600;
                        font-size: 18px;
                    }
                }
            }
        }
        .result{
            display: flex;
            flex: 0 0 5.4rem;
            padding: 0 .2rem;
            .l-mark,.r-mark{
                position: relative;
                flex: 0 0 .7rem;
                display: flex;
                align-items: center;
                flex-direction: column;
                .mark{
                    position: absolute;
                    top:0;
                    display: flex;
                    justify-content: center;
                    flex-grow: 1;
                    font-size: 24px;
                    color: #669cff;
                    padding: 0 2px;
                }
                .progress{
                    margin-top: .6rem;
                    flex: 0 0 4.8rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    border: .06rem solid #3e57a8;
                    border-radius: .18rem;
                    width: .36rem;
                    background: #142e85;
                    padding: .02rem;
                    .cur{
                        background: #fd7059;
                        border-radius: .18rem;
                        flex:1;
                        margin-top: 4.8rem;
                        transition: all ease .3s;
                    }
                }
            }
            .res-list{
                display: flex;
                flex-grow: 1;
                flex-direction: column;
                padding: .1rem .2rem;
                justify-content: flex-end;
                li{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: .2rem;
                    height: 1rem;
                    width: 100%;
                    background: #fff;
                    border-radius: .1rem;
                    box-shadow: 0 .04rem 0 #142e85;
                    font-size: 16px;
                    color: #3e57a8;
                    padding: 0 .3rem;
                }
                .active{
                    background: #4f8dff;
                    color: #fff;
                }
                .left-success,.right-success,.both-success{
                    position: relative;
                    background: #9bc736;
                    color: #fff;
                }
                .left-success:before,.right-success:after{
                    content: '';
                    position: absolute;
                    top:.3rem;
                    width: .2rem;
                    height: .2rem;
                    border: .08rem solid #fff;
                    border-radius: 50%;
                }
                .left-success:before{
                    left: .15rem;
                }
                .right-success:after{
                    right: .15rem;
                }
                .left-error,.right-error{
                    position: relative;
                    background: #ea6c5f;
                    color: #fff;
                }
                .left-error:before,.right-error:after{
                    content: '×';
                    position: absolute;
                    top:.32rem;
                    width: .32rem;
                    height: .32rem;
                    line-height: .32rem;
                    font-size: 20px;
                }
                .left-error:before{
                    left: .15rem;
                }
                .right-error:after{
                    right: .15rem;
                }
                .success{
                    background: #4f8dff;
                    color: #fff;
                }
                .notAnswer{
                    background: none;
                    box-shadow: none;
                    div{
                        display: none;
                    }
                }
            }
        }


        @media(max-width: 360px) {
            .time{
                flex: 0 0 1.85rem;
            }
            .question {
                .text{
                    font-size: 14px;
                }
                .notice {
                    .notice-bg-02 {
                        font-size: 12px;
                        span{
                            font-size: 16px;
                        }
                    }
                }
            }
            .result{
                flex: 0 0 5rem;
                .res-list{
                    li{
                        font-size: 14px;
                        height: .9rem;
                    }
                }
                .r-mark, .l-mark {
                    .mark{
                        font-size: 16px;
                    }
                    .progress{
                        flex: 0 0 4.4rem;
                    }
                }
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave-to
        /* .component-fade-leave-active for below version 2.1.8 */ {
        opacity: 0;
    }
</style>