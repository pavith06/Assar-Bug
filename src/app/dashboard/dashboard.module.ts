import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AppCommonModule } from "../common/components/app-common.module";
import { DashboardChartModule } from "../dashboard-charts/dashboard-chart.module";
import { DashboardHeaderComponent } from "./dashboard-header/dashboard-header.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProfileComponent } from './profile/profile.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';

import { ChangePasswordPopupComponent } from './profile/change-password-popup/change-password-popup.component';
import { PasswordChangedPopupComponent } from './profile/change-password-popup/password-changed-popup/password-changed-popup.component';
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations:[
    DashboardComponent,
    DashboardHeaderComponent,
    ProfileComponent,

    ChangePasswordPopupComponent,
      PasswordChangedPopupComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    DashboardChartModule,
    DashboardRoutingModule,
    AppCommonModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,

    MatTooltipModule,DashboardChartModule,MatMenuModule,MatDatepickerModule,MatButtonModule,TranslateModule

  ]
})

export class DashboardModule{

}
