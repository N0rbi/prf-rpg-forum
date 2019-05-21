import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './feature/materialize.module';
import { LoginModule } from './modules/login/login.module';
import { MainPageModule } from '../app/modules/main-page/main-page.module';
import { ForumModule } from '../app/modules/forum/forum.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    LoginModule,
    MainPageModule,
    ForumModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
