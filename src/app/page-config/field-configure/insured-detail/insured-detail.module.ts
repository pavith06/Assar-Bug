import { DemoMaterialModule } from './../../../common/components/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuredDetailRoutingModule } from './insured-detail-routing.module';
import { InsuredDetailComponent } from './insured-detail.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    InsuredDetailComponent
  ],
  imports: [
    CommonModule,
    InsuredDetailRoutingModule,
    DemoMaterialModule,
    TranslateModule
  ],
  exports:[
    InsuredDetailComponent
  ]
})
export class InsuredDetailModule { }
