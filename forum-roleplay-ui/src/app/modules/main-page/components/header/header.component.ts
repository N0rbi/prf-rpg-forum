import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.username = localStorage.getItem('user');
  }

  onLogout() {
    this.userService.logout().subscribe((res: any) => {
      this.toastr.success(res.message);
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }

  onUserDetails() {
    this.router.navigate(['/user-details']);
  }

}
