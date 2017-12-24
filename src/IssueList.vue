<template>
  <div id="issueList">
    <table class="issue-list">
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
        <td>{{ issue.Title }}</td>
        <td>{{ issue.Type }}</td>
        <td>{{ issue.Priority }}</td>
        <td>{{ issue.Status }}</td>
        <td>{{ issue.Votes }}</td>
        <td>{{ issue._links.assignee.name }}</td>
        <td>{{ issue.created_at | humanReadableTime }}</td>
        <td>{{ issue.updated_at | humanReadableTime }}</td>
      </tr>  
    </tbody>
    </table>
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
export default {
  name: 'issueList',
  filters: {
    humanReadableTime: function(value) {
      return moment(value).fromNow();
    }
  },
  data () {
    return {
      issues: [],
      errors: []
    }
  },
  created() {
    HTTP.get('/issues').then(response => {
      this.issues = response.data;
    }).catch(e => {
      this.errors.push(e);
    })
  }
}
</script>

<style lang="scss">
#issueList {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
