import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import * as $ from 'jquery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { LoginManager, ApiService, StorageService, ToastService, AuthGuard, CartService } from './services';
import { MainModule } from './component/main.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    MainModule,
    BrowserAnimationsModule,
    MatCheckboxModule
  ],
  providers: [LoginManager, ApiService, StorageService, ToastService, AuthGuard, CartService, MainModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
