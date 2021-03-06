import Vue from "vue";
import store from "./store/index.js";
import router from "./router.js";

import "vux/src/styles/reset.less";
import "./index.scss";
import "@css/base/fonts/iconfont.css";

import FastClick from 'fastclick';
FastClick.attach(document.body);

import Msg from 'vux/src/components/msg';
Vue.component('msg', Msg);

//pages公用组件
import solidBtn from "solidBtn";
Vue.component('solid-button',solidBtn);
import pageLoading from "pageLoading";
Vue.component('page-loading',pageLoading);

//根实例
const app = new Vue({
    router,
    store
}).$mount("#view");
