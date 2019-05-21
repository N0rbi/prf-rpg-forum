import { NgModule } from '@angular/core';
import { MaterialModule } from '../../feature/materialize.module';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, MaterialModule],
  providers: [],
  exports: [HeaderComponent],
  entryComponents: []
})
export class SharedModule { }
