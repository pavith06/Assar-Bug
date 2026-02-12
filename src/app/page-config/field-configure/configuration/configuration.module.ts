import { DemoMaterialModule } from './../../../common/components/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports:[
    ConfigurationComponent
  ]
})
export class ConfigurationModule { }
