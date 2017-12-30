<template>
  <div id="issueList">
    <h1>Issues</h1>
    <div id="filters">
      <ul class="filter-status"> Filters:
        <button v-on:click="all">All</button>
        <button v-on:click="open">Open</button>
        <button v-on:click="assignee(current_user.id)">My Issues</button>
        <button v-on:click="watching(current_user.id)">Watching</button>
      </ul>
    </div>
    <h3>Issues ({{issues.length}})</h3>
    <b-table striped hover responsive="md" :items="issues" :fields="fields">
      <template slot="Title" scope="data">
        <router-link :to="{ name: 'issue', params: { id: data.item.id }}">{{ data.item.Title }}</router-link>
      </template>
      <template slot="Type" scope="data">
        <span class="td-clickable" v-on:click="type(data.item.Type)">{{ data.item.Type }}</span>
      </template>
      <template slot="Priority" scope="data">
        <span class="td-clickable" v-on:click="priority(data.item.Priority)">{{ data.item.Priority }}</span>
      </template>
      <template slot="Status" scope="data">
        <span class="td-clickable" v-on:click="status(data.item.Status)">{{ data.item.Status }}</span>
      </template>
      <template slot="_links" scope="data">
        <span class="td-clickable" v-on:click="assignee(data.value.assignee.id)">{{ data.value.assignee.name }}</span>
      </template>
      <template slot="created_at" scope="data">
        {{data.item.created_at | humanReadableTime}}
      </template>
      <template slot="updated_at" scope="data">
        {{data.item.updated_at | humanReadableTime}}
      </template>
    </b-table>
    <!--
    <table>
      <thead>
        <tr>
            <th scope="col">Title</th>
            <th scope="col">Type</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Votes</th>
            <th scope="col">Assignee</th>
            <th scope="col">Created</th>
            <th scope="col">Updated</th>
            <th colspan="3"></th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="issue in issues">
          <td v-if="issue.id" class="td-clickable"><router-link :to="{ name: 'issue', params: { id: issue.id }}">{{ issue.Title }}</router-link></td>
          <td class="td-clickable" v-on:click="type(issue.Type)">{{ issue.Type }}</td>
          <td class="td-clickable" v-on:click="priority(issue.Priority)">{{ issue.Priority }}</td>
          <td class="td-clickable" v-on:click="status(issue.Status)">{{ issue.Status }}</td>
          <td>{{ issue.Votes }}</td>
          <td v-if="issue._links" class="td-clickable" v-on:click="assignee(issue._links.assignee.id)">{{ issue._links.assignee.name }}</td>
          <td>{{ issue.created_at | humanReadableTime }}</td>
          <td>{{ issue.updated_at | humanReadableTime }}</td>
        </tr>  
      </tbody>
    </table>
    -->
    <ul v-if="errors && errors.length">
      <li v-for="error of errors">
        {{error.message}}
      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
import {HTTP} from './http-common';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'issueList',
  filters: {
    humanReadableTime: function(value) {
      return moment(value).fromNow();
    }
  },
  data () {
    return {
      currentUser: {},
      fields: ['Title', 'Type', 'Priority', 'Status', 'Votes', {key:'_links', label:'Assignee'}, {key:'created_at', label:'Created'}, {key:'updated_at', label:'Updated'}],
      issues: [],
      errors: []
    }
  },
  created() {
    HTTP.get('/issues').then(response => {
      this.issues = response.data;
    }).catch(e => {
      this.errors.push(e);
    });
    HTTP.get('/users/current_user').then(response => {
      this.current_user = response.data;
    }).catch(e => {
      this.errors.push(e);
    });
  },
  methods: {
    all: function (event) {
      HTTP.get('/issues').then(response => {
        this.issues = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
    },
    open: function (event) {
      HTTP.get('/issues?status=New%26Open').then(response => {
        this.issues = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
    },
    assignee: function (id) {
      HTTP.get('/issues?assignee='+id).then(response => {
        this.issues = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
    },
    watching: function (id) {
      HTTP.get('/issues?watcher='+id).then(response => {
        this.issues = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
    },
    status: function (status) {
      HTTP.get('/issues?status='+status).then(response => {
        this.issues = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
    },
    priority: function (priority) {
      HTTP.get('/issues?priority='+priority).then(response => {
        this.issues = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
    },
    type: function (type) {
      HTTP.get('/issues?type='+type).then(response => {
        this.issues = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
    }
  }
}
</script>

<style>
#issueList {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}

.td-clickable:hover {
  color: #008ae6
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
