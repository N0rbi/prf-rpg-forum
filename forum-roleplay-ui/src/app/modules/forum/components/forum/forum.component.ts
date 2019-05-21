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
      this.updateCharacter();
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

  getCharacterName(creatorID): string {
    let characterName = 'Mesélő';
    this.postList.players.forEach((player: any) => {
      if (player.user._id === creatorID) {
        characterName = player.character.name;
      }
    });
    return characterName;
  }

  private updateCharacter() {
    let updatedCharacter: any = {};
    this.postList.players.forEach((player: any) => {
      if (player.user._id === this.currentUser._id) {
        player.character.commentNum += 1;
        player.character.level += 1;
        player.character.hp *= 1.1;
        player.character.attack *= 1.1;
        updatedCharacter = player.character;
        this.characterService.updateCharacter({
          character_id: updatedCharacter._id,
          character: {
            name: updatedCharacter.name,
            race: updatedCharacter.race,
            type: updatedCharacter.type,
            commentNum: updatedCharacter.commentNum,
            hp: updatedCharacter.hp,
            attack: updatedCharacter.attack,
            level: updatedCharacter.level
          }
        }).subscribe(() => {
          console.log('update');
        });
      }
    });
  }

  private updateForum() {
    this.forumService.fetchForum(this.forumID).subscribe(postList => {
      this.postList = postList;
      this.forumService.updatePostList(postList);
    });
  }
}
