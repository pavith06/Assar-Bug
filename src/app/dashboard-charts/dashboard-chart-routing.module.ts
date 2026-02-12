import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardChartComponent } from "./dashboard-chart.component";


const routes : Routes =  [
  {
    path: '', component: DashboardChartComponent,
    children : [
      // {
      //   path: 'authority',  component: DashboardChartComponent
      // },
      {
        path: '',  redirectTo: 'authority', pathMatch: "full"
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardChartRoutingModule { }
