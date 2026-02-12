import { DemoMaterialModule } from './../../../common/components/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StagesRoutingModule } from './stages-routing.module';
import { StagesComponent } from './stages.component';


@NgModule({
  declarations: [
    StagesComponent
  ],
  imports: [
    CommonModule,
    StagesRoutingModule,
    DemoMaterialModule

  ],
  exports:[
    StagesComponent
  ]
})
export class StagesModule { }
