import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Forum } from '../../../../models/forum.interface';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { ForumService } from 'src/app/services/forum.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-game-creator',
  templateUrl: './game-creator.component.html',
  styleUrls: ['./game-creator.component.less']
})
export class GameCreatorComponent implements OnInit {
  forum: Forum = {
    theme: '',
    creator: null,
    playerNumber: 0,
    minLevel: 0,
  };

  constructor(private ngZone: NgZone,
              private forumService: ForumService,
              private toastr: ToastrService,
              private userService: UserService,
              public dialogRef: MatDialogRef<GameCreatorComponent>
    ) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  ngOnInit() {
    this.userService.fetchAuthenticatedUser().subscribe(currentUser => {
      this.forum.creator = currentUser;
    });
  }

  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  createGame() {
    this.forumService.createForum(this.forum).subscribe(res => {
      this.toastr.success(res.message);
      this.dialogRef.close();
    }, err => {
      const errorMessage = JSON.stringify(err);
      this.toastr.error(errorMessage);
    });
  }

}
