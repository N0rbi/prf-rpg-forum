import { Component, OnInit, NgZone, ViewChild, OnDestroy, DoCheck } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { ForumService } from 'src/app/services/forum.service';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from 'src/app/services/character.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.less']
})
export class ForumComponent implements OnInit {
  challenge = {hp: 0, attack: 0};
  message = {
    content: '',
    challenge: null
  };
  threadMessage = {
    message: '',
    challenge: null
  };
  forumID: string;
  postList: any;
  panelOpenState = false;
  currentUser;
  currentCharacter;
  diceRoll: number;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private ngZone: NgZone, private forumService: ForumService, private route: ActivatedRoute,
              private characterService: CharacterService, private userService: UserService, private toastr: ToastrService,
              private router: Router) {
    this.forumID = this.route.snapshot.params.forum_id;
  }

  ngOnInit() {
    this.userService.fetchAuthenticatedUser().subscribe(currentUser => {
      this.currentUser = currentUser;
      console.log('currentUser', currentUser);
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

  getcurrentCharacter() {
    this.postList.players.forEach((player: any) => {
      if (player.user.username === this.currentUser.username) {
        this.currentCharacter =  player.character;
      }
    });
  }

  public checkChallenge() {
    this.getcurrentCharacter();
    console.log('currentCharacter', this.currentCharacter);
    const lastPost = this.postList.post[this.postList.post.length - 1];
    this.diceRoll = Math.floor(Math.random() * 6) + 1;
    this.diceRoll = 6.0;
    this.forumService.takeChallenge(this.forumID, lastPost._id, this.diceRoll).subscribe((res: any) => {
      this.toastr.info(res.message);
      if (res.message === 'A karaktered elesett.') {
          this.router.navigate(['/main']);
      }
    });
  }

  sendPostMessage(event) {
    if (event.keyCode !== 13) {
      return;
    }
    if (this.challenge.attack > 0 && this.challenge.hp > 0) {
      this.message.challenge = this.challenge;
      this.challenge = {hp: 0, attack: 0};
    }
    console.log(this.message);
    this.forumService.sendMessage(this.forumID, this.message).subscribe(() => {
      this.updateForum();
      this.message = {content: '', challenge: null};
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

  endGame() {
    this.forumService.endGame(this.forumID).subscribe(() => {
      this.router.navigate(['/main']);
    });
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

  // private updateCharacter() {
  //   let updatedCharacter: any = {};
  //   this.postList.players.forEach((player: any) => {
  //     if (player.user._id === this.currentUser._id) {
  //       player.character.commentNum += 1;
  //       player.character.level += 1;
  //       player.character.hp *= 1.1;
  //       player.character.attack *= 1.1;
  //       updatedCharacter = player.character;
  //       console.log('character', player.character);
  //       this.characterService.updateCharacter({
  //         character_id: updatedCharacter._id,
  //         character: {
  //           name: updatedCharacter.name,
  //           race: updatedCharacter.race,
  //           type: updatedCharacter.type,
  //           commentNum: updatedCharacter.commentNum,
  //           hp: updatedCharacter.hp,
  //           attack: updatedCharacter.attack,
  //           level: updatedCharacter.level
  //         }
  //       }).subscribe(() => {
  //         console.log('update');
  //       });
  //     }
  //   });
  // }

  private updateForum() {
    this.forumService.fetchForum(this.forumID).subscribe(postList => {
      this.postList = postList;
      this.forumService.updatePostList(postList);
    });
  }
}
