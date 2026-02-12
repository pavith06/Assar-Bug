
import { DemoMaterialModule } from './../common/components/material-module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
import { AuthorityPaperDetailsListRoutingModule } from './authority-paper-details-list-routing.module';
import { AuthorityPaperDetailsListComponent } from './authority-paper-details-list.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import {MatCardModule} from '@angular/material/card';
import { AppCommonModule } from '../common/components/app-common.module';


@NgModule({
  declarations:[
    AuthorityPaperDetailsListComponent,
    
  
  ],
  imports:[
    CommonModule,
    FormsModule, 
    TranslateModule,
    AuthorityPaperDetailsListRoutingModule,MatCardModule,AppCommonModule
  ],

})

export class AuthorityPaperDetailsListModule{

}
