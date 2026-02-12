import { ConfigurationModule } from './configuration/configuration.module';
import { StagesModule } from './stages/stages.module';



import { InsuredDetailModule } from './insured-detail/insured-detail.module';
import { DemoMaterialModule } from './../../common/components/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldConfigureRoutingModule } from './field-configure-routing.module';
import { FieldConfigureComponent } from './field-configure.component';
import { AppCommonModule } from 'src/app/common/components/app-common.module';
import { TranslateModule } from '@ngx-translate/core';
import { SectionPopupComponent } from './section-popup/section-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FieldConfigureComponent,
    SectionPopupComponent
  ],
  imports: [
    CommonModule,
    FieldConfigureRoutingModule,
    DemoMaterialModule,
    InsuredDetailModule,



    FormsModule,
    StagesModule,
    ConfigurationModule,
    AppCommonModule,
    TranslateModule,ReactiveFormsModule
  ],
  exports:[
    FieldConfigureComponent
  ]
})
export class FieldConfigureModule { }
