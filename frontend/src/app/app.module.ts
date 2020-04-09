import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {UserService, GlobalService, JoueurService} from './services/services.index';

//components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent} from './signup/signup.component';
import { MainModule } from './main/main.module';

import { APP_ROUTING } from './app.routes';
import { ChooseusernameComponent } from './chooseusername/chooseusername.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    APP_ROUTING,
    ReactiveFormsModule,
    MainModule
  ],
  providers: [UserService, GlobalService, JoueurService],
  bootstrap: [AppComponent],
})

export class AppModule {}


