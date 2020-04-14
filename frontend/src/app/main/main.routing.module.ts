import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { HomeComponent } from '../home/home.component';
import  { ChooseusernameComponent } from '../chooseusername/chooseusername.component';
import {CreateorjoinpartieComponent} from '../createorjoinpartie/createorjoinpartie.component';
import {EntercodeComponent} from '../entercode/entercode.component';

const MAIN_ROUTES: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'chooseusername', component: ChooseusernameComponent},
            { path: 'creategame', component: CreateorjoinpartieComponent},
            { path: 'entergamecode', component: EntercodeComponent},
          { path: 'joingame', component: CreateorjoinpartieComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(MAIN_ROUTES)],
    exports: [RouterModule]
})
export class MainRoutingModule {}
