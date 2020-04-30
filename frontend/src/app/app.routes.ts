import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SignupComponent} from './signup/signup.component';
import {ChooseusernameComponent} from './chooseusername/chooseusername.component';
import {CreateorjoinpartieComponent} from './createorjoinpartie/createorjoinpartie.component';
import {EntercodeComponent} from './entercode/entercode.component';
import {CreatepersoComponent} from './createperso/createperso.component';
import {TheendComponent} from './theend/theend.component';

const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chooseusername', component: ChooseusernameComponent },
  { path: 'creategame', component: CreateorjoinpartieComponent },
  { path: 'joingame', component: CreateorjoinpartieComponent },
  { path: 'entergamecode', component: EntercodeComponent },
  { path: 'createperso', component: CreatepersoComponent},
  { path: 'theend', component: TheendComponent},
  { path: '', component: HomeComponent }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
