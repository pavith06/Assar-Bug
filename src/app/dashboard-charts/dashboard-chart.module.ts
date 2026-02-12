import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import {  TranslateModule } from '@ngx-translate/core';

import {MatTooltipModule} from '@angular/material/tooltip';
import { DashboardBarComponent } from './dashboard-bar/dashboard-bar.component';
import { DashboardDoughnutComponent } from './dashboard-doughnut/dashboard-doughnut.component';
import { DashboardLineComponent } from './dashboard-line/dashboard-line.component';
import { RecentDigitalPapersComponent } from './recent-digital-papers/recent-digital-papers.component';
import { UpcomingExpiryDigitalPapersComponent } from './upcoming-expiry-digital-papers/upcoming-expiry-digital-papers.component';
import { RecentTransactionsComponent } from './recent-transactions/recent-transactions.component';
import { RecentDigitalPapersAuthorityComponent } from './recent-digital-papers-authority/recent-digital-papers-authority.component';
import { DashboardTopPurchaseChartComponent } from './dashboard-top-purchase-chart/dashboard-top-purchase-chart.component';



@NgModule({
  declarations:[
    DashboardBarComponent,
                  DashboardDoughnutComponent,
                  DashboardLineComponent,
                  RecentDigitalPapersComponent,
                  UpcomingExpiryDigitalPapersComponent,
                  RecentTransactionsComponent,
                  RecentDigitalPapersAuthorityComponent,
                  DashboardTopPurchaseChartComponent
  ],
  imports:[
    CommonModule,MatTooltipModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    TranslateModule,
  ],
  exports:[
    DashboardBarComponent,
    DashboardDoughnutComponent,
    DashboardLineComponent, RecentDigitalPapersComponent,
    UpcomingExpiryDigitalPapersComponent,RecentTransactionsComponent,
    RecentDigitalPapersAuthorityComponent,DashboardTopPurchaseChartComponent
   
  ],
  providers:[
    DatePipe
  ]
})

export class DashboardChartModule{
  static count: any;
  static label: unknown[];

}
