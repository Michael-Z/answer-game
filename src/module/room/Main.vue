<template>
    <div class="answer-page">
        <loading
                v-if="loading"
                :self="user"
                :cost="10"
                :opponent="opponent"
                :cancel="handleClose">

        </loading>
        <answer
                ref="answer"
                :data="data"
                :selected="sendMsg"
                :opponent="opponent"
                :self="user"
                :reconnect="reconnect"
                v-if="!loading && !isOver">
        </answer>
        <result
                v-if="isOver"
                :data="resultData"
                :self="user"
                :opponent="opponent">

        </result>
        <div class="waitConnect" v-if="wait">
            <span><i class="icon el-icon-loading"></i>{{this.waitText}}</span>
        </div>
    </div>
</template>
<script>
    import Answer from './Answer';
    import Loading from './Load';
    import Result from './Result';
    import { Toast } from 'mint-ui';
    export default {
        components:{ Answer, Loading, Result },
        data(){
            return{
                loading: true,
                isOver: false,
                wait: false,
                waitText: '网络已断开，正在重新连接',
                room: '',
                user:{},
                socket: null,
                data:{
                    step:'',
                    type:'',
                    index:'',
                    question: '',
                    options:{}
                },
                opponent:{
                    head:'',
                    name:''
                },
                resultData:{
                    opponent:{
                        score: 0,
                        num: 0,
                        success: 0,
                    },
                    self:{
                        score: '',
                        num: 0,
                        success: 0,
                    },
                    catBean:'',
                    result: 0,
                },
                reconnect:{},
            }
        },
        watch:{
            'userInfo'(val){
                this.user = val;
            }
        },
        computed:{
            'userInfo'(){
                return this.$store.state.user.userInfo;
            },
        },
        mounted(){
            this.room = this.$route.params.room_id;
            if(!this.user.token){
                this.$store.dispatch('getUserInfo').then((data)=>{
                    this.user = data;
                    this.initWebSocket();
                })
            }
        },
        beforeRouteEnter (to, from, next) {
            if(from.path == '/game/home'){
                next();
            }else{
                next(vm=>{
                    vm.$router.push('/game/home');
                })
            }
        },
        methods:{
            initWebSocket(){
                if(!this.socket){
                    const uri = "ws://develop.csmall.com:3689?token="+this.user.token+"&room="+this.room;
                    this.socket = new WebSocket(uri);
                    this.socket.onmessage = this.receiveMessage;
                    this.socket.onclose = this.closeConnection;
                }
            },
            receiveMessage(e){
                let data = JSON.parse(e.data);
                if(data.code && data.code == '500'){
                    Toast(data.msg);
                    setTimeout(()=>{
                        this.$router.push('/game/home');
                    }, 1000)
                }
                if(data.step && data.step === 'wait'){
                    if(!this.loading && !this.isOver){
                        this.data.step = 'wait';
                    }
                }
                if(data.step && data.step === 'startGame'){
                    this.data.step = 'startGame';
                    this.loading = false;
                    this.setData(data);
                }
                if(data.step && data.step === 'pushOption'){
                    this.data.step = 'pushOption';
                    this.data.options = data.option;
                    this.data.options.map((item)=>{
                        item.style = '';
                        return item;
                    })
                }
                if(data.step && data.step === 'questionResult'){  //选择答案后的操作
                    this.data.step = 'questionResult';
                    if(this.$refs['answer']){
                        this.$refs['answer'].selectResult(data)
                    }
                }
                if(data.step && data.step === 'pushOpponentScore'){ //接收到对手答案后的操作

                    this.data.step = 'pushOpponentScore';
                    if(this.$refs['answer']){
                        this.$refs['answer'].opponentResult(data);
                    }
                }
                if(data.step && data.step === 'pushAnswer'){ //单题结束后的操作
                    this.data.step = 'pushAnswer';
                    if(this.$refs['answer']) {
                        this.$refs['answer'].questionResult(data);
                    }
                }
                if(data.step && data.step === 'end'){ //比赛结束后的操作
                    this.data.step = 'end';
                    this.socket.close();
                    this.isOver = true;
                    this.resultData.result = data.win;
                    this.resultData.catBean = data.catBean;
                    this.resultData.opponent = {
                        score: data.opponentScore,
                        num: data.opponentWinNum,
                        success: data.opponentRightNum,
                    };
                    this.resultData.self = {
                        score: data.score,
                        num: data.winNum,
                        success: data.rightNum,
                    };
                }
                if(data.step && data.step === 'reconnect'){ //断开连接后重新赋值
                    this.data.step = 'reconnect';
                    this.wait = false;
                    this.loading = false;
                    this.setData(data);
                    this.reconnect = data;
                }
            },
            closeConnection(e){
                if(!this.loading && !this.isOver){
                    this.wait = true;
                    this.socket = null;
                    this.initWebSocket()
                }
            },
            sendMsg(key){
                let msg = {"action":"answer","option": key};
                this.socket.send(JSON.stringify(msg));
            },
            handleClose(){
                this.socket.close();
            },
            setData(data){
                this.data.question = data.question;
                this.data.index = data.questionIndex;
                this.data.type = data.questionType;
                this.opponent.head = data.opponentHead;
                this.opponent.name = data.opponentName;
                if(data.option && data.option.length > 0){
                    this.data.options = data.option;
                }else{
                    this.data.options = [];
                }
            }
        },
        destroyed(){
            if(this.socket){
                this.socket.close();
            }
        }
    }
</script>
<style lang="scss">
    .answer-page{
        .waitConnect{
            position: fixed;
            top: 45%;
            text-align: center;
            width: 100%;
            .icon{
                margin-right: 5px;
            }
            span{
                background: #fff;
                padding: 5px 10px;
            }
        }
    }
</style>