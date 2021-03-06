import _promise from "es6-promise";
var Promise = _promise.polyfill();
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        pageLoading:false
    },
    mutations:{
        pageLoading(state,payload){
            state.pageLoading = payload.pageLoading;
        }
    },
    actions:{
        
    },
    modules:{

    }
})
