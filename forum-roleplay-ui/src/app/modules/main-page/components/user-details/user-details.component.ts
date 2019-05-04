import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.interface';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit {
  userData: any;
  characterList = [];

  constructor(private userService: UserService, private characterService: CharacterService) { }

  ngOnInit() {
    this.getUserData();
  }

  deleteCharacter(characterID: string) {
    this.characterService.deleteCharacter(characterID).subscribe(() => {
      this.getUserData();
    });
  }

  private getUserData() {
    const username = localStorage.getItem('user');
    this.userService.fetchUser(username).subscribe((user: any) => {
      this.userData = user;
      this.characterList = user.characters;
    });
  }

}
