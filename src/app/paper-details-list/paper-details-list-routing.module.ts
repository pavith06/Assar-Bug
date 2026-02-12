import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaperDetailsListComponent } from "./paper-details-list.component";




const routes : Routes =  [
  {
    path: '', component: PaperDetailsListComponent,
  },
  {
    path:':viewtype',component:PaperDetailsListComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaperDetailsListRoutingModule { }
