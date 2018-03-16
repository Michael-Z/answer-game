/**
 * Created by ax on 2017/5/13.
 */
import Vue from 'vue';
import ajax from 'csmall-ajax';

export default {
    state: {
        userInfo:{},
        roomList:[],
    },
    mutations: {
        ['SET_USER_DATA'](state, data){
            state.userInfo = data;
        },
        ['SET_ROOM_LIST'](state, data){
            state.roomList = data;
        }
    },
    actions: {
        getUserInfo(context){
            if(connect){
                return new Promise((resolve,reject)=>{
                    resolve(context.state.userInfo);
                });
            }
            const connect = new Promise((resolve, reject)=>{
                ajax.get('customer/info').success((data) =>{
                    context.commit('SET_USER_DATA', data);
                    resolve(data);
                }).ill((err,xhr)=>{
                    reject(xhr);
                });
            });
            return connect;
        },
        getRoomList(context){
            if(connect){
                return new Promise((resolve,reject)=>{
                    resolve(context.state.roomList);
                });
            }
            const connect = new Promise((resolve, reject)=>{
                ajax.get('game/list').success((data) =>{
                    context.commit('SET_ROOM_LIST', data);
                    resolve(data);
                }).ill((err,xhr)=>{
                    reject(xhr);
                });
            });
            return connect;
        }
    }
};