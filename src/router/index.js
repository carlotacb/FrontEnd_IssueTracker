import Vue from 'vue'
import Router from 'vue-router'
import IssueList from '@/components/IssueList'
import IssueDescription from '@/components/IssueDescription'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {path: '/', component: require("@/components/IssueList.vue").default},
    {name: 'issue', path: '/issues/:id', component: require("@/components/IssueDescription.vue").default},
    {name: 'issueNew', path: '/issues/new', component: require("@/components/IssueNew.vue").default},
    {name: 'editIssue', path: '/issues/:id/edit', component: require("@/components/IssueEdit.vue").default},
    {name: 'create', path: '/issues/new', component: require("@/components/IssueCreation.vue").default},
    {name: 'issue', path: '/issues/:id', component: require("@/components/IssueDescription.vue").default}
  ]
})
