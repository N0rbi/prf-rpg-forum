import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  user = {username: '', password: ''};

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    localStorage.removeItem('user');
  }

  onLogin() {
    this.userService.login(this.user).subscribe((res: any) => {
      localStorage.setItem('user', res.user.username);
      this.toastr.success(res.message);
      this.router.navigate(['/main']);
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  jumpToSignup() {
    this.router.navigate(['/signup']);
  }

}
