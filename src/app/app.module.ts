import { HttpErrorInterceptorService } from './service/httperror-interceptor.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagenotfoundComponent } from './common/components/pagenotfound/pagenotfound.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgbDateCustomParserFormatter } from './common/components/datepicker/datepicker.component';
import {MatDividerModule} from '@angular/material/divider';
import { DashboardChartModule } from './dashboard-charts/dashboard-chart.module';
import { CommonResetPasswordComponent } from './common/components/common-reset-password/common-reset-password.component';
// import { ReportManagementComponent } from './report-management/report-management.component';
// import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
// import { ReportComponent } from './report-management/report/report.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ErrorHandlerDirective  } from "./common/directives/errorHandler.directive";
import { BreadcrumbModule } from 'xng-breadcrumb';
import { AppCommonModule } from './common/components/app-common.module';
import { PageConfigModule } from './page-config/page-config.module';
import { PurchaseStockListComponent } from './purchase-stock-list/purchase-stock-list.component';
import { PaperDetailsListComponent } from './paper-details-list/paper-details-list.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LoginModule,EntityManagementModule } from 'ncloud-common-ui';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    CommonResetPasswordComponent,
    PurchaseStockListComponent,

         PaperDetailsListComponent,



  ],
  imports: [
    LoginModule.forRoot(environment),
    CommonModule,
    MatSelectModule,
    BreadcrumbModule,
    // DemoMaterialModule,
    MatCheckboxModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatIconModule,
   MatPaginatorModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppCommonModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTableModule,
    MatChipsModule,
    FormsModule,
    MatDividerModule,
    MatRadioModule,
    DashboardChartModule,
    MatSortModule,
    NgxUiLoaderModule,
    // MatExpansionModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      },

    }),
    MatPaginatorModule,MatCardModule,MatExpansionModule
  ],
  providers: [
                ErrorHandlerDirective,
                CookieService,
               {
                  provide:HTTP_INTERCEPTORS,
                  useClass:TokenInterceptorService,
                  multi:true
                },
              {
                provide:HTTP_INTERCEPTORS,
                  useClass:HttpErrorInterceptorService,
                  multi:true
              },
              {
                provide: NgbDateParserFormatter,
                 useClass: NgbDateCustomParserFormatter
              },
              { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
              CurrencyPipe, DecimalPipe,

            ],
  exports:[
    // DemoMaterialModule
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http);
}
