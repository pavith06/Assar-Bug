
import { DemoMaterialModule } from './../common/components/material-module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
import { PaperDetailsListRoutingModule } from './paper-details-list-routing.module';
import { PaperDetailsListComponent } from './paper-details-list.component';
import { ViewPaperDetailsPopupComponent } from './view-paper-details-popup/view-paper-details-popup.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RevokeDigitalPaperPopupComponent } from './revoke-digital-paper-popup/revoke-digital-paper-popup.component';
import { DashboardChartModule } from '../dashboard-charts/dashboard-chart.module';



@NgModule({
  declarations:[
    ViewPaperDetailsPopupComponent,
    RevokeDigitalPaperPopupComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    TranslateModule,
    DemoMaterialModule,
    PaperDetailsListRoutingModule,MatTooltipModule,DashboardChartModule
  ],
  exports:[
  ]
})

export class PaperDetailsListModule{

}
