<template>
    <div :class="'cs-scroll '+(autoHide?'cs-scroll-auto-hide':'')"
         @wheel="wheel"
         @touchstart="touchStart"
         @touchmove="touchMove"
         @touchend="touchEnd"
    >
        <div class="cs-scroll-stage" ref="stage">
            <slot></slot>
        </div>
        <div :style="yBarStyle" :class="'cs-scroll-bar cs-scroll-bar-y ' + (yPointerMouseDown?'cs-scroll-active':'')">
            <div class="cs-scroll-bar-bg cs-scroll-bar-bg-y"></div>
            <div class="cs-scroll-pointer cs-scroll-pointer-y" :style="yPointerStyle"
                 @mousedown="yPointerDown"
                 @click.stop.prevent>
            </div>
        </div>
        <div :style="xBarStyle" :class="'cs-scroll-bar cs-scroll-bar-x ' + (xPointerMouseDown?'cs-scroll-active':'')">
            <div class="cs-scroll-bar-bg cs-scroll-bar-bg-x"></div>
            <div class="cs-scroll-pointer cs-scroll-pointer-x" :style="xPointerStyle"
                 @mousedown="xPointerDown"
                 @click.stop.prevent>
            </div>
        </div>
    </div>
</template>

<script>
    const TypeMap = {'hidden': false, 'scroll': true, 'auto': null}, BarWidth = 7;
    const FreshDelay = 300;//ms
    let clientY = 0, clientX = 0;

    export default {
        props: {
            xType: {
                type: String, //auto,hidden,scroll
                default: 'auto'
            },
            yType: {
                type: String, //auto,hidden,scroll
                default: 'auto'
            },
            autoHide: {
                type: Boolean,
                default: false
            },
            animation: {
                type: Boolean,
                default: false
            },
            top: {
                type: Number,
                default: 0
            },
            left: {
                type: Number,
                default: 0
            }
        },

        data(){
            return {
                yDisplay: false,
                xDisplay: false,
                heightPercent: 0,
                widthPercent: 0,

                pointerTop: 0,
                pointerLeft: 0,
                scrollTop: this.top,
                scrollLeft: this.left,

                maxPointerTop: 0,
                maxPointerLeft: 0,
                maxScrollTop: 0,
                maxScrollLeft: 0,

                yPointerEmpty: false,
                xPointerEmpty: false,

                yPointerMouseDown: false,
                xPointerMouseDown: false,

                contentHeight: 0
            }
        },

        computed: {
            yBarStyle(){
                return {
                    display: this.yDisplay? 'block': 'none',
                    bottom: (this.xDisplay? BarWidth: 0) + 'px'
                }
            },
            xBarStyle(){
                return {
                    display: this.xDisplay? 'block': 'none',
                    right: (this.yDisplay? BarWidth: 0) + 'px',
                }
            },
            yPointerStyle(){
                return {
                    top: this.pointerTop + 'px',
                    height: this.heightPercent + '%',
                    display: this.yPointerEmpty? 'none': 'block'
                }
            },
            xPointerStyle(){
                return {
                    left: this.pointerLeft + 'px',
                    width: this.widthPercent + '%',
                    display: this.xPointerEmpty? 'none': 'block'
                }
            }
        },
        watch: {
            'contentHeight': function(cur, last){
                if(cur !== last){
                    this.freshScrollbar();
                }
            }
        },
        mounted(){
            this.$nextTick(() =>{
                this.stage = this.$refs.stage;
                window.addEventListener('resize', () =>{
                    this.freshScrollbar();
                });
                this.resetScrollbar();
            });
        },
        updated(){
            this.$nextTick(() =>{
                this.contentHeight = this.stage.scrollHeight;
            });
        },
        methods: {
            freshScrollbar(){
                clearTimeout(this.timer);
                this.timer = setTimeout(() =>{
                    this.resetScrollbar();
                }, FreshDelay);
            },
            resetScrollbar(){
                this.yDisplay = TypeMap[this.yType];
                this.xDisplay = TypeMap[this.xType];
                const ch = this.stage.clientHeight, sh = this.stage.scrollHeight;
                const cw = this.stage.clientWidth, sw = this.stage.scrollWidth;

                if(this.yDisplay === null){
                    this.yDisplay = ch < sh;
                }
                if(this.xDisplay === null){
                    this.xDisplay = cw < sw;
                }
                if(this.yDisplay){
                    this.heightPercent = ch / sh * 100;
                    this.maxScrollTop = sh - ch;
                    this.maxPointerTop = (ch - (this.xDisplay? BarWidth: 0)) * (1 - ch / sh);
                    this.yPointerEmpty = ch >= sh;
                    this.moveScroll('y', 'w');
                }
                if(this.xDisplay){
                    this.widthPercent = cw / sw * 100;
                    this.maxScrollLeft = sw - cw;
                    this.maxPointerLeft = (cw - (this.yDisplay? BarWidth: 0)) * (1 - cw / sw);
                    this.xPointerEmpty = cw >= sw;
                    this.moveScroll('x', 'w');
                }
            },

            moveScroll(axis, trigger){
                if(axis === 'y'){
                    if(trigger === 'w'){
                        this.pointerTop = this.maxPointerTop * this.scrollTop / this.maxScrollTop;
                    }else{
                        this.scrollTop = this.maxScrollTop * this.pointerTop / this.maxPointerTop;
                    }
                    this.stage.scrollTop = this.scrollTop;
                }else{
                    if(trigger === 'w'){
                        this.pointerLeft = this.maxPointerLeft * this.scrollLeft / this.maxScrollLeft;
                    }else{
                        this.scrollLeft = this.maxScrollLeft * this.pointerLeft / this.maxPointerLeft;
                    }
                    this.stage.scrollLeft = this.scrollLeft;
                }
            },

            wheel(evt){
                if(!this.yDisplay){
                    return;
                }
                let top = this.scrollTop;
                this.yPointerMouseDown = true;
                clearTimeout(this.wheelTimer);
                this.wheelTimer = setTimeout(() =>{
                    this.yPointerMouseDown = false;
                }, 500);

                if((top >= 0 && evt.deltaY < 0) || (top < this.maxScrollTop && evt.deltaY > 0)){
                    top += evt.deltaY;
                    this.scrollTop = top < 0? 0: top > this.maxScrollTop? this.maxScrollTop: top;
                    this.moveScroll('y', 'w');
                    evt.preventDefault();
                }
            },

            yPointerDown(evt){
                this.yPointerMouseDown = true;
                document.addEventListener('mouseup', this.yMouseUp);
                clientY = evt.clientY;
                document.addEventListener('mousemove', this.yMouseMove);
            },

            xPointerDown(evt){
                this.xPointerMouseDown = true;
                document.addEventListener('mouseup', this.xMouseUp);
                clientX = evt.clientX;
                document.addEventListener('mousemove', this.xMouseMove);
            },

            yMouseUp(){
                this.yPointerMouseDown = false;
                document.removeEventListener('mouseup', this.yMouseUp);
                document.removeEventListener('mousemove', this.yMouseMove);
            },

            xMouseUp(){
                this.xPointerMouseDown = false;
                document.removeEventListener('mouseup', this.xMouseUp);
                document.removeEventListener('mousemove', this.xMouseMove);
            },

            yMouseMove(evt){
                let cur = this.pointerTop + evt.clientY - clientY;
                clientY = evt.clientY;

                cur = cur < 0? 0: cur > this.maxPointerTop? this.maxPointerTop: cur;
                this.pointerTop = cur;

                this.moveScroll('y', 'm');

                evt.preventDefault();
                evt.stopPropagation();
            },

            xMouseMove(evt){
                let cur = this.pointerLeft + evt.clientX - clientX;
                clientX = evt.clientX;

                cur = cur < 0? 0: cur > this.maxPointerLeft? this.maxPointerLeft: cur;
                this.pointerLeft = cur;

                this.moveScroll('x', 'm');

                evt.preventDefault();
                evt.stopPropagation();
            },

            touchStart(evt){

            },

            touchMove(evt){

            },
            touchEnd(evt){

            }
        }
    };
</script>
<style lang="scss">
    @import "../style/var.scss";

    $--bar-blur-bg-color:rgba(115, 107, 119, 0.05);
    $--bar-active-bg-color:rgba(115, 107, 119, 0.15);

    $--bar-bg-color:rgba(115, 107, 119, 0);
    $--bar-bg-active-color:rgba(115, 107, 119, 0);

    $--pointer-blur-color:rgba(115, 107, 119, 0.3);
    $--pointer-active-color:rgba(115, 107, 119, 0.6);

    $--bar-width:7px;
    $--bar-radius:2px;

    .cs-scroll{
        top:0;
        left:0;
        right:0;
        bottom:0;
        position:absolute;
        .cs-scroll-stage{
            position:absolute;
            overflow:hidden;
            height:100%;
            width:100%;
        }

        .cs-scroll-bar{
            position:absolute;
            background:$--bar-blur-bg-color;
            z-index:1;
            transition:.5s;

            .cs-scroll-bar-bg{
                position:absolute;
                width:100%;
                height:100%;
                top:0;
                left:0;
                border:0 solid $--bar-bg-color;
            }
            .cs-scroll-bar-bg-y{
                width:50%;
                border-right-width:1px;
            }

            .cs-scroll-bar-bg-x{
                height:50%;
                border-bottom-width:1px;
            }

            .cs-scroll-pointer{
                position:absolute;
                border-radius:$--bar-radius;
                background:$--pointer-blur-color;
                transition:.5s;
                transition-property:background-color, width, height;
            }
            .cs-scroll-pointer-y{
                left:0;
                width:100%;
            }
            .cs-scroll-pointer-x{
                top:0;
                height:100%;
            }
            .cs-scroll-pointer:hover{
                background:$--pointer-active-color;
            }
        }
        .cs-scroll-bar-y{
            width:$--bar-width;
            top:0;
            bottom:$--bar-width;
            right:0;
        }
        .cs-scroll-bar-x{
            height:$--bar-width;
            bottom:0;
            left:0;
            right:$--bar-width;
        }
        .cs-scroll-bar:hover{
            background:$--bar-active-bg-color;
            .cs-scroll-bar-bg{
                border-color:$--bar-bg-active-color;
            }
            .cs-scroll-pointer{
                background:$--pointer-active-color;
            }
        }
        .cs-scroll-bar.cs-scroll-active{
            background:$--bar-active-bg-color;
            .cs-scroll-bar-bg{
                border-color:$--bar-bg-active-color;
            }
            .cs-scroll-pointer{
                background:$--pointer-active-color;
            }
        }
    }

    .cs-scroll-auto-hide{
        .cs-scroll-bar{
            visibility:hidden;
            opacity:0;
        }
    }

    .cs-scroll-auto-hide:hover{
        .cs-scroll-bar{
            visibility:visible;
            opacity:1;
        }
    }
</style>