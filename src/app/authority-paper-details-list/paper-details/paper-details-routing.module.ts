
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PaperDetailsComponent } from './paper-details.component';
import { AuthorityPaperDetailsListComponent } from "../authority-paper-details-list.component";
import { AuthorityPaperDetailsCardComponent } from "./authority-paper-details-card/authority-paper-details-card.component";


const routes : Routes =  [
  {
    path: '',
    component:PaperDetailsComponent,
    children: [
      {
        path:'list', 
        component: AuthorityPaperDetailsListComponent,
      },
      {
        path:'card/:viewType', 
        component: AuthorityPaperDetailsCardComponent,
      },
      {
        path: '',
        redirectTo: 'card',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaperDetailRoutingModule { }
