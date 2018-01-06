<template>
<div class="container">
    <div class="row">
        <div class="col-md-8">
            <div class="container issue-description">
                <h1>{{ issue.Title }} <span class="badge badge-secondary"> {{issue.Status}} </span></h1>
                <p v-if="issue.creator"><b>{{issue.creator.name}}</b> created this issue {{issue.created_at | humanReadableTime }}</p>
                <p>{{ issue.Description }}</p>
                <div v-if="attachment.url" class="attachment">
                    <img v-if="attachment.attachment_content_type.startsWith('image')" :src="attachment.url">
                    <a class="caption" :href="attachment.url">{{attachment.attachment_file_name}}</a>
                </div>
                <div class="separator"><hr /></div>
            </div>
            <div class="container" id="comments">
                <h4>Comments ({{comments.length}})</h4>
                <div class="comment" v-for="comment in comments" :key="comment.id">
                    <p><b>{{comment.creator.name || "Nom usuari"}}</b><br>
                    {{comment.body}}</p>
                    <a v-if="comment.attachment" :href="comment.attachment.url"><img v-if="comment.attachment" :src="comment.attachment.url"></a>
                    <p>{{comment.created_at | humanReadableTime}}</p>
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

        <div class="col-md-4 issue-description">
            <div class="buttons">
                <b-button-group>

                    <b-button variant="primary" v-on:click="changetoResolvedOpen">
                    {{issue.Status}}
                    </b-button>

                    <b-dropdown right text="Menu">
                    <b-dropdown-item v-on:click="changestatus('New')">New</b-dropdown-item>
                    <b-dropdown-item v-on:click="changestatus('Open')">Open</b-dropdown-item>
                    <b-dropdown-item v-on:click="changestatus('On Hold')">On Hold</b-dropdown-item>
                    <b-dropdown-item v-on:click="changestatus('Resolved')">Resolved</b-dropdown-item>
                    <b-dropdown-item v-on:click="changestatus('Duplicate')">Duplicate</b-dropdown-item>
                    <b-dropdown-item v-on:click="changestatus('Invalid')">Invalid</b-dropdown-item>
                    <b-dropdown-item v-on:click="changestatus('Won\'t fix')">Won't fix</b-dropdown-item>
                    <b-dropdown-item v-on:click="changestatus('Closed')">Closed</b-dropdown-item>
                    </b-dropdown>
                </b-button-group>
            </div>
            <br>
            <div class="buttons">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#attachModal">
                    Attach
                </button>
                <b-button v-on:click="deleteIssue">Delete Issue</b-button>
                <router-link :to="{ name: 'editIssue', params: {}}" class="btn btn-primary">{{'Edit Issue'}}</router-link>
            </div>
            <br>
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

        <div class="col-md-4 margin">

            
            
            <div class="modal fade" id="attachModal" tabindex="-1" role="dialog" aria-labelledby="titleModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="titleModal">Attach file</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <input type="file" class="form-control-file" id="attachmentUploadIssue">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="attachIssue">Send file</button>
                </div>
                </div>
            </div>
            </div>
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
        attachment: {},
        comments: [],
        errors: [],
        commentTextArea: "",
        seen: true,
        button: {
          text: 'Resolved'
        }
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
    HTTP.get('/issues/' + this.$route.params.id + '/attachment').then(response => {
        this.attachment = response.data;
        this.$forceUpdate();
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
    attachIssue: function() {
        var issueAttachment = $('#attachmentUploadIssue').prop('files')[0];
        const formData = new FormData();
        formData.append('file', issueAttachment);
        HTTP.post("/issues/" + this.issue.id + "/attachment", formData)
        .then(response => {
            this.attachment = response.data;
            this.$forceUpdate();
        });
    },
    reload: function() {

    },
    vote: function(event) {

      HTTP.post("/issues/" + this.issue.id + "/vote").then(response => {
        this.issue = response.data;
      }).catch(e => {
        this.errors.push(e);
      })

    },
    watch: function(event) {

      HTTP.post("/issues/" + this.issue.id + "/watch").then(response => {
        this.issue = response.data;
      }).catch(e => {
        this.errors.push(e);
      })

    },
    changetoResolvedOpen: function (event) {
      data.seen = !data.seen;
      data.button.text = data.seen ? 'Resolved' : 'Open';

      // Falta que canvi l'estatus a Open o Resolved amb la URL
    },
    changestatus: function (newstatus) {
      HTTP.post("/issues/" + this.issue.id + "/status", {
        status: newstatus
      }).then(response => {
        this.issue = response.data;
      }).catch(e => {
        this.errors.push(e);
      })
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
    },
    deleteIssue: function (event){

        HTTP.delete("/issues/" + this.issue.id);
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
    margin-top: 1rem;
    text-align: left;
    padding: 5px;
    border: solid 1px #cccccc;
    border-radius: 5px;
}

.buttons {}

.right-box > dl {
    margin-bottom: 0.1rem;
}

.margin {
  margin-top: 5rem;
}

dt, dd {
    margin: 0;
    padding: 0;
}

dt {
    float: left;
    margin-right: 0.3em;
}

.attachment {
    vertical-align: top;
    display: inline-block;
    text-align: center;
}

.attachment > img {
    max-width: 100px;
}

.attachment > .caption {
    display: block;
}
</style>
