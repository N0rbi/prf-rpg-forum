import { NgModule } from '@angular/core';
import { MaterialModule } from '../../feature/materialize.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [MainPageComponent, HeaderComponent],
  imports: [MaterialModule],
  providers: [],
  exports: [MainPageComponent]
})
export class MainPageModule { }
