import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GeneratePaperRoutingModule } from './generate-paper-routing.module';
import { GeneratePaperComponent } from './generate-paper.component';
import { ManualComponent } from './manual/manual.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadHistoryPopupComponent } from './bulk-upload/upload-history-popup/upload-history-popup.component';
import { TotalRecordsListComponent } from './total-records-list/total-records-list.component';
import { TranslateModule } from '@ngx-translate/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../common/components/material-module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CustomDirectiveModule } from '../common/directives/custom-directive.module';



@NgModule({
  declarations: [
    GeneratePaperComponent,
    ManualComponent,
    BulkUploadComponent,
    UploadHistoryPopupComponent,
    TotalRecordsListComponent,
  ],
  imports: [
    CommonModule,
    GeneratePaperRoutingModule,
    MatTooltipModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    DemoMaterialModule,
    MatDatepickerModule,
    CustomDirectiveModule

  ],
})
export class GeneratePaperModule {}
