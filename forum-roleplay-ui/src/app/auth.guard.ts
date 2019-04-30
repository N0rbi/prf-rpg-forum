import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {

  }
  canActivate(): boolean {
    const user = localStorage.getItem('user');
    if (!user || user.length <= 0) {
        this.router.navigate(['']);
        return false;
      }
    return true;
  }
}