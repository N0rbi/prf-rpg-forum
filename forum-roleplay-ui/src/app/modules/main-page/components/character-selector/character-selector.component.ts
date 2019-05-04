import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Character } from 'src/app/models/character.interface';
import { ToastrService } from 'ngx-toastr';
import { ForumService } from 'src/app/services/forum.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-character-selector',
  templateUrl: './character-selector.component.html',
  styleUrls: ['./character-selector.component.less']
})
export class CharacterSelectorComponent implements OnInit {

  currentUser: any;
  characterList: Character[] = [];
  selectedCharacter: Character;
  gameID: string;

  constructor(private userService: UserService,
              private forumService: ForumService,
              public dialogRef: MatDialogRef<CharacterSelectorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string,
              private toastr: ToastrService,
              private router: Router) {
                this.gameID = data;
  }

  ngOnInit() {
    const username = localStorage.getItem('user');
    this.userService.fetchUser(username).subscribe((user: any) => {
      this.currentUser = user;
      this.characterList = user.characters;
    });
  }

  public navToCharacterCreator() {
    this.dialogRef.close();
    this.router.navigate(['/character-creator']);
  }

  public selectCharacter(character) {
    const playerData = {
      forumID: this.gameID,
      user: this.currentUser,
      characterName: character.name,
      characterRace: character.race,
      characterType: character.type,
      characterCommentNumber: character.commentNum,
      characterHp: character.hp,
      characterAttack: character.attack,
      characterLevel: character.level
    };
    this.forumService.playerJoin(playerData).subscribe(res => {
      this.toastr.success('Sikeresen csatlakoztál a játékhoz!');
      this.updateForumStore();
      this.dialogRef.close();
    }, err => {
      this.toastr.error('Nem sikerült a csatlakozás');
    });
  }

  private updateForumStore() {
    this.forumService.fetchAllForum().subscribe(forums => {
      this.forumService.updateForumStore(forums);
    });
  }

}