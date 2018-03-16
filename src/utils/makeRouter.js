import Vue from 'vue';
const load = require('../utils/loadModule');
import VueRouter from 'vue-router';
import Stage from '../layout/Stage';

Vue.use(VueRouter);
export default routes =>{
    const loadComponent = list =>{
        list.forEach(item =>{
            if(typeof(item.component) === 'undefined'){
                item.component = Stage;
            }else if(typeof(item.component) === 'string'){
                item.component = load(item.component);
            }
            if(typeof(item.children) === 'string'){ //自行加载子节点路由
                let path = item.children.replace(/^[\s\uFEFF\xA0\/]+|[\s\uFEFF\xA0\/]+$/g, '');
                const conf = require('@/module/' + path + '/router.js');
                conf.fallback = conf.fallback || '/error/NotFound';

                item.children = conf.children;

                item.children.push({
                    path: '*',
                    component: conf.fallback
                });
                item.children.forEach(r =>{
                    if(typeof(r.component) === 'string'){
                        if(r.component.substr(0, 1) !== '/'){
                            r.component = path + '/' + r.component;
                        }else{
                            r.component = r.component.substr(1);
                        }
                    }
                });
            }
            if(item.children){
                loadComponent(item.children);
            }
        });
    };
    routes.push({
        path: '*',
        component: 'error/TopNotFound'
    });
    loadComponent(routes);

    return new VueRouter({
        mode: 'history',
        base: '/',
        routes
    });
};