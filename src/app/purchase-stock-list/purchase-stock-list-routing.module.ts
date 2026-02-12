import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PurchaseStockListComponent } from "./purchase-stock-list.component";


const routes : Routes =  [
  {
    path: '', component: PurchaseStockListComponent,
  
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PurchaseStockListRoutingModule { }
