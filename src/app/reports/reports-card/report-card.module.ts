import { DemoMaterialModule } from './../../common/components/material-module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {  FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { ReportCardRoutingModule } from "./report-card-routing.module";
import { ReportHeaderComponent } from "./report-header/report-header.component";
import { ReportsCardComponent } from "./reports-card.component";
import { TranslateModule } from "@ngx-translate/core";
import {MatTooltipModule} from '@angular/material/tooltip';
@NgModule({
  declarations:[
    ReportHeaderComponent,
    ReportsCardComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    ReportCardRoutingModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    TranslateModule,
    MatTooltipModule
  ]
})

export class ReportCardModule{

}
