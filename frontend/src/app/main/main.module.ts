import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main.routing.module';
import { MainComponent } from './main.component';
import { HomeComponent } from '../home/home.component';
import {ChooseusernameComponent} from '../chooseusername/chooseusername.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        ChooseusernameComponent
    ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class MainModule {}
