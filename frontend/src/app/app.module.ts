import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {UserService, GlobalService, JoueurService} from './services/services.index';

// components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent} from './signup/signup.component';
import { MainModule } from './main/main.module';

import { APP_ROUTING } from './app.routes';
import {TokenInterceptor} from './services/token-interceptor';
import {PartieService} from './services/partie.service';
import {EquipeService} from './services/equipe.service';
import { EntercodeComponent } from './entercode/entercode.component';
import {PersonnageService} from './services/personnage.service';
import {MancheService} from './services/manche.service';
import {JwtInterceptor} from './jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    EntercodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    APP_ROUTING,
    ReactiveFormsModule,
    MainModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi(), withXhr()),
      UserService, GlobalService, JoueurService, PartieService, EquipeService, PersonnageService, MancheService,
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent],
})

export class AppModule {}


