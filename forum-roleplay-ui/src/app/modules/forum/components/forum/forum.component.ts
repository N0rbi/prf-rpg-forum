import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { ForumService } from 'src/app/services/forum.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.less']
})
export class ForumComponent implements OnInit {
  message = {
    content: '',
    challange: {}
  };
  threadMessage = {
    message: ''
  };
  forumID: string;
  postList: any;
  panelOpenState = false;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private ngZone: NgZone, private forumService: ForumService, private route: ActivatedRoute) {
    this.forumID = this.route.snapshot.params.forum_id;
  }

  ngOnInit() {
    this.updateForum();
    this.forumService.postListStore.subscribe(postList => {
      this.postList = postList;
    });
  }

  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  sendPostMessage(event) {
    if (event.keyCode !== 13) {
      return;
    }
    this.forumService.sendMessage(this.forumID, this.message).subscribe(() => {
      this.updateForum();
      this.message = {content: '', challange: {}};
    });
  }

  sendThreadMessage(event, postID) {
    if (event.keyCode !== 13) {
      return;
    }
    this.forumService.sendThreadMessage(this.forumID, postID, this.threadMessage).subscribe(() => {
      this.updateForum();
      this.panelOpenState = true;
      this.threadMessage.message = '';
    });
  }

  deleteThreadMessage(postID, threadID) {
    this.forumService.deleteThreadMessage(this.forumID, postID, threadID).subscribe(() => {
      this.updateForum();
    })
  }

  deletePostMessage(postID) {
    this.forumService.deletePostMessage(this.forumID, postID).subscribe(() => {
      this.updateForum();
    });
  }

  private updateForum() {
    this.forumService.fetchForum(this.forumID).subscribe(postList => {
      this.postList = postList;
      this.forumService.updatePostList(postList);
    });
  }
}
