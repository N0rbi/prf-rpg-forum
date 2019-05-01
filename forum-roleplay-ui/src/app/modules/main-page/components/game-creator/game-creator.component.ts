import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Forum } from '../../../../models/forum.interface';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-game-creator',
  templateUrl: './game-creator.component.html',
  styleUrls: ['./game-creator.component.less']
})
export class GameCreatorComponent implements OnInit {
  forum: Forum = {
    theme: '',
    creator: null,
    post: [],
    players: [],
    playerNumber: 0,
    minLevel: 0,
  };

  constructor(private ngZone: NgZone) { }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  ngOnInit() {
  }

  triggerResize() {
    this.ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  createGame() {
    
  }

}
