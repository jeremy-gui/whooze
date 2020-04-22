import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main.routing.module';
import { MainComponent } from './main.component';
import { HomeComponent } from '../home/home.component';
import {ChooseusernameComponent} from '../chooseusername/chooseusername.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CreateorjoinpartieComponent} from '../createorjoinpartie/createorjoinpartie.component';
import {CreatepersoComponent} from '../createperso/createperso.component';

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        ChooseusernameComponent,
        CreateorjoinpartieComponent,
        CreatepersoComponent
    ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class MainModule {}
