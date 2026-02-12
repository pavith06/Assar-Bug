import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { AuthorityLoginComponent } from "./authority-login/authority-login.component";
import { InsuredCompanyLoginComponent } from "./insured-company-login/insured-company-login.component";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TranslateModule } from "@ngx-translate/core";
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations:[
    LoginComponent,
    InsuredCompanyLoginComponent,
    AuthorityLoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports:[
    CommonModule,MatIconModule,
    MatFormFieldModule,
    FormsModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})

export class LoginModule{

}
