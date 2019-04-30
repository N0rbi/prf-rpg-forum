import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/components/login/login.component';
import { SignupComponent } from './modules/login/components/signup/signup.component';
import { MainPageComponent } from './modules/main-page/components/main-page/main-page.component';
import { AuthGuard } from './auth.guard';
import { UserDetailsComponent } from './modules/main-page/components/user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'main', component: MainPageComponent, canActivate: [AuthGuard] },
  { path: 'user-details', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
