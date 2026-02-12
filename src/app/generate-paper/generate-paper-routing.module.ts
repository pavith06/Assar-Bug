import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GeneratePaperComponent } from "./generate-paper.component";
import { ManualComponent } from "./manual/manual.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { TotalRecordsListComponent } from "./total-records-list/total-records-list.component";


const routes: Routes = [
    {
        path: '',
        component: GeneratePaperComponent,
        children: [

            {
                path: 'manual', component: ManualComponent
            },
            {
              path: 'manual/:uploadType/:actionType', component: ManualComponent
            },
            {
                path: 'bulk', component: BulkUploadComponent
            },
            {
                path: 'bulk-revoke', component: BulkUploadComponent
            },
            {
                path: 'total_records/bulk-upload/:id/:uploadType/:actionType', component: TotalRecordsListComponent
            },
            {
              path: 'total_records/bulk-revoke/:id/:uploadType/:actionType', component: TotalRecordsListComponent
          },
            {
                path:'',
                redirectTo:'manual',
                pathMatch:'full'
              },]
    }
]



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class GeneratePaperRoutingModule { }
