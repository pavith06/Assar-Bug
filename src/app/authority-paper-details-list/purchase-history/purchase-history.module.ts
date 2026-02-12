
import { DemoMaterialModule } from './../../common/components/material-module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppCommonModule } from 'src/app/common/components/app-common.module';
import { PurchaseHistoryRoutingModule } from './purchase-history-routing.module';
import { PurchaseHistoryCardComponent } from './purchase-history-card/purchase-history-card.component';
import { PurchaseHistoryListComponent } from './purchase-history-list/purchase-history-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { PurchaseHistoryPopupComponent } from './purchase-history-card/purchase-history-popup/purchase-history-popup.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { PurchaseHistoryComponent } from './purchase-history.component';



@NgModule({
  declarations:[
  
    PurchaseHistoryCardComponent,
        PurchaseHistoryListComponent,
        TransactionsListComponent,
        PurchaseHistoryPopupComponent,
        PurchaseHistoryComponent,
  ],
  imports:[
    CommonModule,
    FormsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    AppCommonModule,
    PurchaseHistoryRoutingModule,TranslateModule,
    AppCommonModule, MatTooltipModule,

  ],
})

export class PurchaseHistoryModule{
}
