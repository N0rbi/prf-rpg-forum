import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
  user = {username: '', password: ''};

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  onRegistration() {
    this.userService.registration(this.user).subscribe((res: any) => {
      this.toastr.success(res.message);
      this.jumpToLogin();
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  jumpToLogin() {
    this.router.navigate(['/login']);
  }

}
