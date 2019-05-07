import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { ForumService } from 'src/app/services/forum.service';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from 'src/app/services/character.service';
import { UserService } from 'src/app/services/user.service';

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
  currentUser;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private ngZone: NgZone, private forumService: ForumService, private route: ActivatedRoute,
              private characterService: CharacterService, private userService: UserService) {
    this.forumID = this.route.snapshot.params.forum_id;
  }

  ngOnInit() {
    this.userService.fetchAuthenticatedUser().subscribe(currentUser => {
      this.currentUser = currentUser;
    });
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
      this.updateCharacter();
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

  getCharacterName(creatorID): string {
    let characterName = 'Mesélő';
    this.postList.forum.players.forEach((player: any) => {
      if (player.user._id === creatorID) {
        characterName = player.character.name;
      }
    });
    return characterName;
  }

  private updateCharacter() {
    // let updatedCharacter: any = {};
    // let characterID = '';
    // this.postList.forum.players.forEach((player: any) => {
    //   if (player.user._id === postCreatorID) {
    //     player.character.commentNum += 1;
    //     if (player.character.commentNum % 3 === 0) {
    //       player.character.level += 1;
    //       player.character.hp *= 1.1;
    //       player.character.attack *= 1.1;
    //     }
    //     updatedCharacter = player.character;
    //   }
    // });
    // this.currentUser.characters.forEach((character: any) => {
    //   if (character.name === updatedCharacter.name) {
    //     characterID = character._id;
    //   }
    // });
  }

  private updateForum() {
    this.forumService.fetchForum(this.forumID).subscribe(postList => {
      this.postList = postList;
      this.forumService.updatePostList(postList);
    });
  }
}
