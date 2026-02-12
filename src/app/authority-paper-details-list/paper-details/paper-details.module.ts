
import { DemoMaterialModule } from './../../common/components/material-module';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppCommonModule } from 'src/app/common/components/app-common.module';
import { PaperDetailsComponent } from './paper-details.component';
import { AuthorityPaperDetailsCardComponent } from './authority-paper-details-card/authority-paper-details-card.component';
import { AuthorityPaperDetailsListComponent } from './authority-paper-details-list/authority-paper-details-list.component';
import { PaperDetailRoutingModule } from './paper-details-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AuthorityViewPapersListComponent } from './authority-paper-details-list/authority-view-papers-list/authority-view-papers-list.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations:[
    AuthorityPaperDetailsCardComponent,AuthorityPaperDetailsListComponent,PaperDetailsComponent, AuthorityViewPapersListComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    DemoMaterialModule,
    AppCommonModule,
    PaperDetailRoutingModule,
    MatCardModule,MatTableModule,TranslateModule,MatTooltipModule
   
  ],
})

export class PaperDetailModule{
}
