
import { DemoMaterialModule } from './../common/components/material-module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseStockListRoutingModule } from './purchase-stock-list-routing.module';
import { PurchaseStockPopupComponent } from './purchase-stock-popup/purchase-stock-popup.component';
import { ChequePopupComponent } from './cheque-popup/cheque-popup.component';
import {MatTableModule} from '@angular/material/table';

import { MatTooltipModule } from '@angular/material/tooltip';
import { PurchaseStockListComponent } from './purchase-stock-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ViewPurchaseStockPopupComponent } from './view-purchase-stock-popup/view-purchase-stock-popup.component';
import { AppCommonModule } from '../common/components/app-common.module';
import { PaymentStatusPopupComponent } from './payment-status-popup/payment-status-popup.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations:[
 
    PurchaseStockPopupComponent,
            ChequePopupComponent,
            ViewPurchaseStockPopupComponent,
            PaymentStatusPopupComponent,
            
  ],
  imports:[
    CommonModule,
    FormsModule, 
    TranslateModule,
    DemoMaterialModule,
    PurchaseStockListRoutingModule,MatTableModule,
    ReactiveFormsModule,
   MatTooltipModule,
   MatPaginatorModule,
   AppCommonModule,
   PdfViewerModule
  
  ],
  exports:[
  ]
})

export class PurchaseStockListModule{

}
