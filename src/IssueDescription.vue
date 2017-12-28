<template>
<div class="container">
    <div class="row">
        <div class="col-md-8">
            <div class="container issue-description">
                <h1>{{ issue.Title }} <span class="badge badge-secondary"> {{issue.Status}} </span></h1>
                <p v-if="issue.creator"><b>{{issue.creator.name}}</b> created this issue {{issue.created_at | humanReadableTime }}</p>
                <p>{{ issue.Description }}</p>
                <div class="separator"><hr /></div>
            </div>
            <div class="container" id="comments">
                <h4>Comments ({{comments.length}})</h4>
                <div class="comment" v-for="comment in comments" :key="comment.id">
                    <p><b>{{comment.creator.name || "Nom usuari"}}</b><br>
                    {{comment.body}}</p>
                    <p>{{comment.created_at | humanReadableTime}}</p>
                    <img v-if="comment.attachment" :src="comment.attachment.url">
                </div>

                <form>
                    <div class="form-group">
                        <label for="commentBody">What do you want to say?</label>
                        <textarea v-model="commentTextArea" class="form-control" id="commentBody" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <input type="file" class="form-control-file" id="attachmentUpload">
                    </div>
                    <button type="button" v-on:click="sendComment" class="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
        <div class="col-md-4">
            <div class="right-box">
                <dl>
                    <dt>Assignee</dt> <dd v-if="issue._links"> {{issue._links.assignee.name}}</dd>
                    <dt>Type</dt> <dd> {{issue.Type}}</dd>
                    <dt>Status</dt> <dd> {{issue.Status}}</dd>
                    <dt>Priority</dt> <dd> {{issue.Priority}}</dd>
                    <dt>Votes</dt> <dd><span class="badge badge-pill badge-primary"> {{issue.Votes}}</span> <a href="#" v-on:click="vote"> vote this issue</a></dd>
                    <dt>Watchers</dt> <dd><span class="badge badge-pill badge-primary"> {{issue.Watchers}}</span> <a href="#" v-on:click="watch"> watch this issue</a></dd>
                </dl>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {HTTP} from './http-common';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import $ from 'jquery' 
import moment from 'moment'

export default {
  name: "IssueDescription",
  filters: {
    humanReadableTime: function(value) {
      return moment(value).fromNow();
    }
  },
  data() {
      return {
        currentUser: {},
        issue: {},
        comments: [],
        errors: [],
        commentTextArea: "",
      }
  },
  created() {
    HTTP.get('/issues/' + this.$route.params.id).then(response => {
        this.issue = response.data;
        this.issue.creator = this.issue._links.creator;
        var creationDate = new Date();
        creationDate.setTime(Date.parse(issue.created_at));
        this.issue.creationDateString =creationDate.toDateString();
    }).catch(e => {
        this.errors.push(e);
    });
    HTTP.get('/users/current_user').then(response => {
        this.currentUser = response.data;
    }).catch(e => {
        this.errors.push(e);
    });
    HTTP.get('/issues/' + this.$route.params.id + '/comments').then(response => {
        var comments = response.data;
        //this.comments = response.data;
        var i = 0;
        for (i = 0; i < comments.length; i++) {
           comments[i].creator = comments[i]._links.creator;
           var comment = comments[i];
           if (comment._links.attachment) {
                console.log(comment._links.attachment);
                HTTP.get(comment._links.attachment.href).then(response=> {
                    comment.attachment = response.data;
                    this.comments.push(comment);
                });
           }
           else {
               this.comments.push(comment);
           }
        }
    }).catch(e => {
        this.errors.push(e);
    })
  },
  methods: {
    reload: function() {

    },
    vote: function(event) {
        
    },
    watch: function(event) {

    },
    sendComment: function(event) {
        var commentAttachment = $('#attachmentUpload').prop('files')[0];
        const formData = new FormData();
        formData.append('file', commentAttachment);
        var commentBody = this.commentTextArea;
        console.log(commentBody);
        console.log(commentAttachment);
        HTTP.post("/issues/" + this.issue.id + "/comments", {
            body: commentBody
        }).then(response => {
            var comment = response.data;
            comment.creator = this.currentUser;
            console.log(comment);
            if (commentAttachment) {
                HTTP.post("/issues/" + this.issue.id + "/comments/" + comment.id + "/attachment", formData
                ).then(response => {
                    console.log("updating comments");
                    this.comments.push(comment);
                    console.log(this.comments);
                });
            }
            else {
                console.log("updating comments");
                this.comments.push(comment);
                console.log(this.comments);
            }
        });
        this.commentTextArea = "";
    }
  }
}
</script>
<style>
.separator {
    line-height: 1px;
}

.issue-description {
    margin-top: 20px;
}
.comment{
    padding: 1rem;
}

.right-box {
    margin-top: 2rem;
    text-align: left;
    padding: 5px;
    border: solid 1px #cccccc;
    border-radius: 5px;
}
.right-box > dl {
    margin-bottom: 0.1rem;
}

dt, dd { 
    margin: 0; 
    padding: 0; 
} 

dt { 
    float: left; 
    margin-right: 0.3em; 
}
</style>
