
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { PurchaseHistoryComponent } from "./purchase-history.component";
import { PurchaseHistoryListComponent } from "./purchase-history-list/purchase-history-list.component";
import { PurchaseHistoryCardComponent } from "./purchase-history-card/purchase-history-card.component";
import { TransactionsListComponent } from "./transactions-list/transactions-list.component";


const routes : Routes =  [
  {
    path: '',
    component:PurchaseHistoryComponent,
    children: [
      {
        path:'list',
        component: PurchaseHistoryListComponent,
      },
      // {
      //   path:'transactionlist',
      //   component:TransactionsListComponent,

      // },

      {
        path:'card',
        component: PurchaseHistoryCardComponent,
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

export class PurchaseHistoryRoutingModule { }
