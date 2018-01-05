<template>
  <div id="issueList">
    <h1>Issues</h1>
    <div id="filters">
      <ul class="filter-buttons">Filters:
        <b-button v-on:click="all">All</b-button>
        <b-button v-on:click="open">Open</b-button>
        <b-button v-on:click="assignee(current_user.id)">My Issues</b-button>
        <b-button v-on:click="watching(current_user.id)">Watching</b-button>
      </ul>
      <a href="/issues/new" id="create-button" class="btn btn-primary">New</a> 
    </div>
    <template>
      <router-link :to="{ name: 'issueNew', params: {}}">{{'+ New Issue'}}</router-link>
    </template>
    
    <h3>Issues ({{issues.length}})</h3>
    <b-table striped hover responsive="lg" :items="issues" :fields="fields">
      <template slot="Title" slot-scope="data">
        <router-link :to="{ name: 'issue', params: { id: data.item.id }}">{{ data.item.Title }}</router-link>
      </template>
      <template slot="Type" slot-scope="data">
        <span class="td-clickable" v-on:click="type(data.item.Type)">{{ data.item.Type }}</span>
      </template>
      <template slot="Priority" slot-scope="data">
        <span class="td-clickable" v-on:click="priority(data.item.Priority)">{{ data.item.Priority }}</span>
      </template>
      <template slot="Status" slot-scope="data">
        <span class="td-clickable" v-on:click="status(data.item.Status)">{{ data.item.Status }}</span>
      </template>
      <template slot="_links" slot-scope="data">
        <span class="td-clickable" v-on:click="assignee(data.value.assignee.id)">{{ data.value.assignee.name }}</span>
      </template>
      <template slot="created_at" slot-scope="data">
        {{data.item.created_at | humanReadableTime}}
      </template>
      <template slot="updated_at" slot-scope="data">
        {{data.item.updated_at | humanReadableTime}}
      </template>
      <template slot="is_watched_by_current_user" slot-scope="data">
        <b-button size="sm" @click.stop="watch(data.item.id, data.index)" class="mr-2">
          {{data.item.is_watched_by_current_user ? 'Unwatch' : 'Watch'}}
        </b-button>
      </template>
    </b-table>

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
      fields: ['Title', 'Type', 'Priority', 'Status', 'Votes', {key:'_links', label:'Assignee'}, {key:'created_at', label:'Created'}, {key:'updated_at', label:'Updated'}, {key: 'is_watched_by_current_user', label:' '}],
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
    },
    watch: function (id, index) {
      HTTP.post("/issues/" + id + "/watch").then(response => {
        this.issues[index].is_watched_by_current_user = !this.issues[index].is_watched_by_current_user;
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

.filter-buttons{
  font-size: 150%;
  color: gray;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

.filters {
  display: inline-block;
}

#create-button {
  float: right;
}
</style>
