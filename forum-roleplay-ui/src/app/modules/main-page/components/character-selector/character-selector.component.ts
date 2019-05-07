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

  public selectCharacter(selectedCharacter) {
    const playerData = {
      forum_id: this.gameID,
      user: this.currentUser,
      character: selectedCharacter
    };
    console.log('playerData', playerData);
    this.forumService.joinGame(playerData).subscribe(res => {
      this.toastr.success(res.message);
      this.updateForumStore();
      this.dialogRef.close();
    }, err => {
      this.toastr.error(err.error.errors[0], err.error.message);
    });
  }

  private updateForumStore() {
    this.forumService.fetchAllForum().subscribe((forums: any) => {
      this.forumService.updateForumStore(forums);
    });
  }

}
