import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit {
  userData: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
    const username = localStorage.getItem('user');
    this.userService.fetchUser(username).subscribe(user => this.userData = user);
  }

}
