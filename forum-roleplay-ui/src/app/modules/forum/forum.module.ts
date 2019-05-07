import { NgModule } from '@angular/core';
import { MaterialModule } from '../../feature/materialize.module';
import { CommonModule } from '@angular/common';
import { ForumComponent } from './components/forum/forum.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ForumComponent],
  imports: [CommonModule, MaterialModule, SharedModule],
  providers: [],
  exports: [],
  entryComponents: []
})
export class ForumModule { }
