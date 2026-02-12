import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthorityPaperDetailsListComponent } from "./authority-paper-details-list.component";
import { TransactionsListComponent } from "./purchase-history/transactions-list/transactions-list.component";

const routes : Routes =  [
  {
    path: '', 
    component: AuthorityPaperDetailsListComponent,
    children : [
      { 
        path : 'paper-details',
        loadChildren: ()=> import('./paper-details/paper-details.module').then(m=> m.PaperDetailModule),
      },
      { 
        path : 'purchase-history',
        loadChildren: ()=> import('./purchase-history/purchase-history.module').then(m=> m.PurchaseHistoryModule),
      },
      { 
        path : 'transaction-history',
        component: TransactionsListComponent
      },
      { 
        path : 'transaction-history/:notificationId',
        component: TransactionsListComponent
      },
      {
        path:'',
        redirectTo:'paper-details', 
        pathMatch:'full'
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthorityPaperDetailsListRoutingModule { }
