import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.isAuthenticated().subscribe(res => console.log(res))
  }

}