import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

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
import { CreateorjoinpartieComponent } from './createorjoinpartie/createorjoinpartie.component';
import {TokenInterceptor} from './services/token-interceptor';
import {PartieService} from './services/partie.service';

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
  providers: [UserService, GlobalService, JoueurService, PartieService, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent],
})

export class AppModule {}


