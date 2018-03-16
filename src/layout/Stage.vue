<template>
    <div :class="'container-box sidebar-status-' + sidebarStatusClass[status]">
        <div class="sidebar-container">
            <ele-sidebar :status="status" @statusChange="handleStatusChange" :menu="menu" ref="sidebar"></ele-sidebar>
        </div>
        <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
                <div class="stage-container">
                    <router-view></router-view>
                </div>
            </keep-alive>
        </transition>
    </div>
</template>
<script>
    import EleSidebar from '../component/Sidebar';

    let rootPath = '';

    const findRootNode = (list) =>{
        let reserve = [];
        for(let i in list){
            if(list.hasOwnProperty(i)){
                if(list[i].key === rootPath){
                    return list[i];
                }else if(list[i].list){//加入后备队
                    reserve = reserve.concat(list[i].list);
                }
            }
        }
        if(reserve.length){
            return findRootNode(reserve);
        }

        return {
            name: '---',
            list: []
        };
    };

    export default {
        components: {EleSidebar},
        data(){
            return {
                menu: {
                    name: '---',
                    list: []
                },
                sidebarStatusClass: ['hide', 'folding', 'expand'],
                status: 2
            };
        },
        computed: {
            cachedViews(){
                return [];
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm =>{
                rootPath = vm.$route.matched[0].path.trim();
                if(rootPath.slice(0, 1) === '/'){
                    rootPath = rootPath.slice(1);
                }
                if(rootPath.slice(-1, 1) === '/'){
                    rootPath = rootPath.slice(0, -1);
                }
                vm.setSideMenuList(to.path);
            });
        },
        beforeRouteUpdate(to, from, next){
            this.focusToMenu(to.path);
            next();
        },
        methods: {
            setSideMenuList(path){
                this.$store.dispatch('getUserInfo').then(() =>{//获取功能菜单
                    const item = findRootNode(this.$store.state.user.menu.list);
                    this.menu.name = item.name;
                    this.menu.list = item.list;
                    this.focusToMenu(path);
                });
            },
            focusToMenu(path){
                this.$refs.sidebar.setFocus(path);
            },
            handleStatusChange(type){
                if(type === 1){//全部隐藏
                    this.status = this.status < 1? 2: 0;
                }else{
                    this.status = this.status < 2? this.status + 1: 1;
                }
            }
        }
    };
</script>
<style lang="scss">
    .container-box{
        height:100%;
        width:100%;
    }

    .sidebar-container{
        position:absolute;
        /*overflow:hidden;*/
        top:50px;
        left:0;
        width:200px;
        bottom:0;
        transition:width .5s;
        z-index:2;
    }

    .stage-container{
        background:#f9faff;
        position:absolute;
        overflow:hidden;
        top:50px;
        left:200px;
        right:0;
        bottom:0;
        transition:left .5s;
        z-index:1;
    }

    .sidebar-status-hide{
        .sidebar-container{
            width:16px;
        }
        .stage-container{
            left:0;
        }
    }

    .sidebar-status-folding{
        .sidebar-container{
            width:36px;
            .cs-scroll-stage, .list-menu{
                overflow:visible;
            }
        }
        .stage-container{
            left:36px;
        }
    }
</style>