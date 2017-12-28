import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import IssueList from './IssueList.vue'
import IssueDescription from './IssueDescription.vue'

window.Vue = Vue;

Vue.use(BootstrapVue);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/', component: require("./IssueList.vue").default},
    {name: 'issue', path: '/issues/:id', component: require("./IssueDescription.vue").default}
  ]
});

const app = new Vue({
  router
}).$mount('#app');
