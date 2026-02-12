import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageConfigComponent } from './page-config.component';


const routes: Routes = [
  {
    path:'', component:PageConfigComponent,pathMatch:'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageConfigRoutingModule { }
