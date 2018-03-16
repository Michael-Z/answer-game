import '../style/comm.scss';
import '../style/theme-gray/icon.scss';
import Vue from 'vue';
import Vuex from 'vuex';
import Layout from '../layout/Layout';
import makeRouter from '../utils/makeRouter';
import user from '../store/user';
import routes from './router';

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        user
    }
});

const router = makeRouter(routes);

new Vue({
    store,
    router,
    el: '#app',
    render: h => h(Layout)
});