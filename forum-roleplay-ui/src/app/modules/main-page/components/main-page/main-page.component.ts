import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GameCreatorComponent } from '../game-creator/game-creator.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    this.userService.isAuthenticated().subscribe(res => console.log(res));
  }

  openNewGameDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(GameCreatorComponent, dialogConfig);
  }

}
