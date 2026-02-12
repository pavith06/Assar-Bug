import { FirstTimeLoginGuard } from './../service/guard/firstTimeLogin.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorityLoginComponent } from './authority-login/authority-login.component';
import { InsuredCompanyLoginComponent } from './insured-company-login/insured-company-login.component';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: 'insurance-company',
        component: InsuredCompanyLoginComponent,
      },
      {
        path: 'authority',
        component: AuthorityLoginComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: '',
        redirectTo: 'insurance-company',
        pathMatch: 'full',
      },
      {
        path: 'reset-password',
        pathMatch: 'full',
        component: ResetPasswordComponent,
        canActivate: [FirstTimeLoginGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
