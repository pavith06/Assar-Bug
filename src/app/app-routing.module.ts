import { DashboardLineComponent } from './dashboard-charts/dashboard-line/dashboard-line.component';
import { CommonResetPasswordComponent } from './common/components/common-reset-password/common-reset-password.component';
import { AuthGuard } from './service/guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './common/components/pagenotfound/pagenotfound.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { RouteDashboardService } from './service/routedashboard.service';


const routes: Routes = [
  {
    path: 'login',
    canActivate:[RouteDashboardService],
    loadChildren: () =>
      // import('./login/login.module').then((m) => m.LoginModule)
      import('ncloud-common-ui').then((m)=> m.LoginModule)
  },
  {
    path: 'entitymanagement',
    loadChildren: () =>
      // import('./login/login.module').then((m) => m.LoginModule)
      import('ncloud-common-ui').then((m)=> m.EntityManagementModule)
  },
  { path: 'export-import', 
    loadChildren: () => import('ncloud-common-ui').then(m => m.ExportImportModule) },
  {
    path: 'common-reset-password/:userIdentity/:userName',
    component: CommonResetPasswordComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),canActivate:[AuthGuard]
  },
  {
    path: 'profile',  component: ProfileComponent,canActivate:[AuthGuard]
  }
,

  {
    path: 'purchase-stock',
    loadChildren: () =>
      import('./purchase-stock-list/purchase-stock-list.module').then(
        (m) => m.PurchaseStockListModule
      ),canActivate:[AuthGuard]
  },
  {
    path: 'paper-details',
    loadChildren: () =>
      import('./paper-details-list/paper-details-list.module').then(
        (m) => m.PaperDetailsListModule
      ),canActivate:[AuthGuard]
  },

  {
    path: 'authority-paper-details',
    loadChildren: () =>
      import('./authority-paper-details-list/authority-paper-details-list.module').then(
        (m) => m.AuthorityPaperDetailsListModule
      ),canActivate:[AuthGuard]
  },
  {
    path: 'generate-paper',
    loadChildren: () =>
      import('./generate-paper/generate-paper.module').then(
        (m) => m.GeneratePaperModule
      ),canActivate:[AuthGuard]
  },

  {
    path: 'report-Data',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),canActivate:[AuthGuard]
  },

  {
    // path: 'usermanagement',
    // loadChildren: () =>
    //   import('./user-management/user-management.module').then(
    //     (m) => m.UserManagementModule
    //   ),canActivate:[AuthGuard],
    // data: { skipBreadcrumb: true }
      path: 'usermanagement',
      loadChildren: () => import('ncloud-common-ui').then((m) => m.UserManagementModule),
      canActivate: [AuthGuard]
  },
  // {
  //   path:'entitymanagement',
  //   loadChildren :()=>
  //   import('./entity-management/entity-management.module').then((m) => m.EntityManagementModule),canActivate:[AuthGuard],
  //   data: { skipBreadcrumb : true}
  // },

  { path: '', redirectTo: 'login/insurance-company', pathMatch: 'full' },
  {
    path:'page-config',
    loadChildren:()=> import('./page-config/page-config.module').then((m)=> m.PageConfigModule),canActivate:[AuthGuard]
  },
  // Route for 404 request
  { path: 'check', component: DashboardLineComponent, },
  { path: '**', component: PagenotfoundComponent, },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
