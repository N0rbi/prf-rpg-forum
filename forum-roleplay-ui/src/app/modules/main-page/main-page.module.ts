import { NgModule } from '@angular/core';
import { MaterialModule } from '../../feature/materialize.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HeaderComponent } from './components/header/header.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MainPageComponent, HeaderComponent, UserDetailsComponent],
  imports: [CommonModule, MaterialModule],
  providers: [],
  exports: [MainPageComponent]
})
export class MainPageModule { }
