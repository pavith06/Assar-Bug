import { AppCommonModule } from './../common/components/app-common.module';
import { DemoMaterialModule } from './../common/components/material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageConfigRoutingModule } from './page-config-routing.module';
import { PageConfigComponent } from './page-config.component';
import { FieldConfigureModule } from './field-configure/field-configure.module';

import { ImplementConfigComponent } from './implement-config/implement-config.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UserTypePopupComponent } from './implement-config/user-type-popup/user-type-popup.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PageConfigComponent,
    ImplementConfigComponent,
    UserTypePopupComponent
  ],
  imports: [
    CommonModule,
    FieldConfigureModule,

    PageConfigRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    DemoMaterialModule,
    AppCommonModule, DragDropModule, MatProgressBarModule
  ],

})
export class PageConfigModule { }
