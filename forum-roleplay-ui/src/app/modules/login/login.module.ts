import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from '../../feature/materialize.module';
import { SignupComponent } from './components/signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [MaterialModule],
  providers: [],
  exports: [LoginComponent]
})
export class LoginModule { }
