<template>
  <div class="container">
      <div class="row">
          <div class="edit">
            <h1>Edit Issue</h1>
            <form>
                    <div class="form-group">
                        <label for="title">Title</label>
                        <textarea id="title" class="form-control" rows="1" v-model="title"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea class="form-control" id="description" rows="3" v-model="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="assignee">Assignee</label>
                        <select class="form-control" id="assignee" v-model="assignee">
                            <option disabled selected value>{{ issue._links.assignee.name }}</option>
                            <option v-for="user in users" v-bind:key="user.id" :value="user.id">{{user.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="type">Type</label>
                        <select class="form-control" id="type" v-model="type">
                            <option disabled selected value>{{issue.Type}}</option>
                            <option value="Bug">Bug</option>
                            <option value="Enhancement">Enhancement</option>
                            <option value="Proposal">Proposal</option>
                            <option value="Task">Task</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="priority">Priority</label>
                        <select class="form-control" id="priority" v-model="priority">
                            <option disabled selected value>{{issue.Priority}}</option>
                            <option value="Trivial">Trivial</option>
                            <option value="Minor">Minor</option>
                            <option value="Major">Major</option>
                            <option value="Critical">Critical</option>
                            <option value="Blocker">Blocker</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="status">Status</label>
                        <select class="form-control" id="status" v-model="status">
                            <option id="newstatus" disabled selected value>{{issue.Status}}</option>
                            <option value="New">New</option>
                            <option value="Open">Open</option>
                            <option value="On hold">On hold</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Duplicate">Duplicate</option>
                            <option value="Invalid">Invalid</option>
                            <option value="Won't fix">Won't fix</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="attachment">Attachment</label>
                        <input type="file" class="form-control-file" id="attachment">
                    </div>
                    <a href="#" class="btn btn-primary" v-on:click="editIssue">Edit</a>
                    <template>
                      <router-link :to="{ path: '/issues', params: {}}" class="btn cancel-button" id="cancel-button" style="margin-right:85%">{{'Cancel'}}</router-link>
                    </template>
            </form>
          </div>
      </div>
  </div>
</template>
<script>
import {HTTP} from './http-common';
import 'jquery'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'

export default {
  name: "IssueEdit",
  data() {
      return {
          issue: [],
          issues: [],
          currentUser: {},
          users: {},
          errors: {},
          title: "",
          description: "",
          status: "",
          priority: "",
          type: "",
          assignee: ""
      }
  },
  created() {
    HTTP.get('/users/current_user').then(response => {
        this.currentUser = response.data;
    }).catch(e => {
        this.errors.push(e);
    });
    HTTP.get('/users').then(response => {
        this.users = response.data;
    }).catch(e => {
        this.errors.push(e);
    });
    HTTP.get('/issues/' + this.$route.params.id).then(response => {
        this.issue = response.data;
        this.priority = this.issue.Priority;
        this.type = this.issue.Type;
        this.status = this.issue.Status;
        this.title = this.issue.Title;
        this.description = this.issue.Description;
        this.assignee = this.issue.assignee_id;
    }).catch(e => {
        this.errors.push(e);
    })
  },
  methods: {
      editIssue: function() {
        var attachment = $('#attachment').prop('files')[0];
        const formData = new FormData();
        formData.append('file', attachment);
        var data = {
            Title: this.title,
            Description: this.description,
            Status: this.status,
            Priority: this.priority,
            Type: this.type
        };
        if (this.assignee && this.assignee !== "") {
            data.assignee_id = this.assignee;
        }
        console.log("data: ", data);
        HTTP.put('/issues/'+ this.issue.id, data).then(response => {
        var issue = response.data;
        if (attachment) {
            HTTP.post('/issues/' + this.$route.params.id + '/attachment', formData).then(response => {
                this.$router.push({ name: 'issue', params: { id: issue.id }});
            });
        }
        else {
            this.$router.push({ name: 'issue', params: { id: issue.id }});
        }
        });

      }
  }
}
</script>
<style>
.edit {
    margin-top: 20px;
    width: 100%;
}

form {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 5%;
    margin-right: 5%;
}
</style>


