/* eslint-disable @typescript-eslint/no-unused-vars */
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportHeaderComponent } from "./reports-card/report-header/report-header.component";
import { ReportsCardComponent } from "./reports-card/reports-card.component";
import { ReportsComponent } from "./reports.component";


const routes : Routes =  [
  {
    path: 'reports-card', component: ReportsCardComponent,
    children : [
      // {
      //   path: 'card-report',  component: ReportsComponent
      // },
      {
        path: '',  redirectTo: 'reports-card', pathMatch: "full"
      },
    ]
  },
  {
    path:'report-list/:Identity', component:ReportsComponent
  },
  {
    path:'report-list', component:ReportsComponent
  },
  {
    path:'report-head', component:ReportHeaderComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportRoutingModule { }
