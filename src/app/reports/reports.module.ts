import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {  FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { ReportsConfigComponent } from "./reports-config/reports-config.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ReportCardModule } from "./reports-card/report-card.module";
import { ReportRoutingModule } from "./reports-routing.module";
import { DemoMaterialModule } from "../common/components/material-module";
import { TranslateModule } from "@ngx-translate/core";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRippleModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations:[
    ReportsComponent,
    ReportsConfigComponent,
  ],
  imports:[
    CommonModule,
    FormsModule,
    ReportCardModule,
    RouterModule,
    ReportRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    TranslateModule,MatTooltipModule,MatRippleModule,MatChipsModule
  ],
  exports:[
    DemoMaterialModule
  ]
})

export class ReportsModule{

}
