import '../../style/comm.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import Login from './Login.vue';
import Entry from './Entry.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
        {path: '/', component: Login},
        {path: '/user/team/entry', component: Entry}
    ]
});

new Vue({
    router,
    el: '#app',
    render: h => h(App)
});