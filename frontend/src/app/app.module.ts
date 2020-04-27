import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {UserService, GlobalService, JoueurService} from './services/services.index';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent} from './signup/signup.component';
import { MainModule } from './main/main.module';

import { APP_ROUTING } from './app.routes';
import { ChooseusernameComponent } from './chooseusername/chooseusername.component';
import { CreateorjoinpartieComponent } from './createorjoinpartie/createorjoinpartie.component';
import {TokenInterceptor} from './services/token-interceptor';
import {PartieService} from './services/partie.service';
import {EquipeService} from './services/equipe.service';
import { EntercodeComponent } from './entercode/entercode.component';
import { CreatepersoComponent } from './createperso/createperso.component';
import {PersonnageService} from './services/personnage.service';
import { MancheComponent } from './manche/manche.component';
import {MancheService} from './services/manche.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    EntercodeComponent
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
  providers: [UserService, GlobalService, JoueurService, PartieService, EquipeService, PersonnageService, MancheService,
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent],
})

export class AppModule {}


