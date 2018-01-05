<template>
  <div id="issueNew">
    <h1>New Issue</h1>
    <br>
    <div id="formulario">
      <lu>
        <p>Title <input v-model="title" placeholder="Title"></p>
        <p>Description <textarea v-model="description" placeholder="Description"></textarea></p>
        <p>Type<select v-model="type">
          <option disabled value="">Please select one</option>
          <option>Bug</option>
          <option>Proposal</option>
          <option>Task</option>
          <option>Enhancement</option>
        </select></p>
        <p>Priority <select v-model="priority">
          <option disabled value="">Please select one</option>
          <option>Trivial</option>
          <option>Minor</option>
          <option>Major</option>
          <option>Critical</option>
          <option>Blocker</option>
        </select></p>
        <p>Status <select v-model="status">
          <option disabled value="">Please select one</option>
          <option>New</option>
          <option>Open</option>
          <option>On hold</option>
          <option>Resolved</option>
          <option>Duplicate</option>
          <option>Invalid</option>
          <option>Won't fix</option>
          <option>Closed</option>
        </select></p>
        <p>Assignee <select v-model="assignee">
          <option disabled value="">Please select one</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select></p>
      </lu>
    </div>
    <br>
    <button v-on:click="newIssue(postbody)">Create Issue</button>
    <template>
      <router-link :to="{ path: '/', params: {}}">{{'Cancel'}}</router-link>
    </template>

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
  name: 'issueNew',
  filters: {
    humanReadableTime: function(value) {
      return moment(value).fromNow();
    }
  },
  data () {
    return {
      currentUser: {},
      issues: [],
      commentTextArea: {},
      errors: []
    }
  },
  created() {
    /*HTTP.get('/issues').then(response => {
      this.issues = response.data;
    }).catch(e => {
      this.errors.push(e);
    });
    HTTP.get('/users/current_user').then(response => {
      this.current_user = response.data;
    }).catch(e => {
      this.errors.push(e);
    });*/
  },
  methods: {
    cancel: function () {
      
    },
    newIssue: function (event) {
      
    }
  }
}
</script>

<style>
#issueNew {
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
</style>
