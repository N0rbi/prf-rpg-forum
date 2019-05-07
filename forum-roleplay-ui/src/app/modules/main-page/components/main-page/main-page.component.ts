import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GameCreatorComponent } from '../game-creator/game-creator.component';
import { Router } from '@angular/router';
import { ForumService } from 'src/app/services/forum.service';
import { CharacterSelectorComponent } from '../character-selector/character-selector.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {

  forums = [];
  currentUser: any;

  constructor(private userService: UserService,
              private dialog: MatDialog,
              private router: Router,
              private forumService: ForumService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.userService.isAuthenticated().subscribe((res: any) => {
      if (!res.isAuthenticated) {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });

    this.userService.fetchAuthenticatedUser().subscribe(currentUser => {
      this.currentUser = currentUser;
    });

    this.forumService.fetchAllForum().subscribe((forums: any) => {
      this.forums = forums.forum;
    });

    this.forumService.forumStore.subscribe(forums => {
      this.forums = forums;
    });
  }

  openNewGameDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(GameCreatorComponent, dialogConfig);
  }

  joinGameAsPlayer(game) {
    game.players.forEach(player => {
      if (player._id === this.currentUser._id) {
        this.toastr.info('Már tagja vagy a szobának!');
        return;
      }
    });
    this.openCharacterSelector(game);
  }

  joinGame(game) {
    this.router.navigate(['/forum/', game._id]);
  }

  canJoinInGame(game): boolean {
    const player = game.players.find(player => player.user._id === this.currentUser._id);
    if (player) {
      return true;
    }
    if (this.currentUser._id === game.creator._id) {
      return true;
    }
    return false;
  }

  private openCharacterSelector(game) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = game._id;
    this.dialog.open(CharacterSelectorComponent, dialogConfig);
  }

}
