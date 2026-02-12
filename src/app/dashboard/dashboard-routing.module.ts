import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { ProfileComponent } from "./profile/profile.component";


const routes : Routes =  [
  {
    path: 'dash', component: DashboardComponent,
    children : [
      {
        path: 'profile',  component: ProfileComponent
      },
    ]
  },
  {
    path: '',  redirectTo: 'dash', pathMatch: "full"
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
