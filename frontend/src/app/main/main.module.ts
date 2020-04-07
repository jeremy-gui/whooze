import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main.routing.module';
import { MainComponent } from './main.component';
import { HomeComponent } from '../home/home.component';

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
    ],
    imports: [
        CommonModule,
        MainRoutingModule,
        SharedModule
    ]
})
export class MainModule {}
