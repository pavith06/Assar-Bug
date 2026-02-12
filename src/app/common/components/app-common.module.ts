import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {MatCardModule} from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import {MatDividerModule} from '@angular/material/divider';
import {  TranslateModule } from '@ngx-translate/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from "./popup/popup.component";
import { HeaderComponent } from "./header/header.component";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { CommonCardComponent } from "./card-component/common-card.component";
import { DemoMaterialModule } from "./material-module";
import{BreadcrumbComponent} from './breadcrumb/breadcrumb.component'
import{BreadcrumbService,BreadcrumbModule} from 'xng-breadcrumb'
import {RouterModule} from '@angular/router';
import { AppService } from "src/app/service/role access/service/app.service";
import { NotificationPopupComponent } from './notification-popup/notification-popup.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SearchBarComponent } from "./search-bar/search-bar.component";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CustomDirectiveModule } from "../directives/custom-directive.module";
import {MatRadioModule} from '@angular/material/radio';
import { CommonDownloadComponent } from './common-download/common-download.component';
import { DisablePopupInUserComponent } from "./disable-popup/disable-popup.component";
import { LanguageComponent } from "src/app/language/language.component";
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations:[
    HeaderComponent,
    PagenotfoundComponent,
    CommonCardComponent,
    PopupComponent,
    BreadcrumbComponent,
    NotificationPopupComponent,
    SearchBarComponent,
    CommonDownloadComponent,
    DisablePopupInUserComponent,
    LanguageComponent,
    LoaderComponent,

  ],
  imports:[
    CommonModule,MatDialogModule,
    FormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDividerModule,
    TranslateModule,
    NgbPopoverModule,
    DemoMaterialModule,
    BreadcrumbModule,
    RouterModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CustomDirectiveModule,
    MatRadioModule
  ],
  exports:[
    HeaderComponent,
    PagenotfoundComponent,
    CommonCardComponent,
    PopupComponent,
    BreadcrumbComponent,
    SearchBarComponent,
    CommonDownloadComponent,
    LanguageComponent

  ],
  providers:[
    BreadcrumbService,
    CommonCardComponent,
    AppService
  ]
})

export class AppCommonModule{

}
