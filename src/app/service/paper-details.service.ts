import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn:'root'
})
export class PaperDetailService{

  constructor(private http:HttpClient){}
   baseUrl = environment.API_BASE_URL;

  sendBulkUploadFileData(file:File,uploadType:string,uploadAction:string):Observable<any>{
    const pageId = 'c741ae6b5c3a49b888d2592a51c6bu8u';
    const formData = new FormData();

       // Store form name as "file" with file data
        formData.append("bulk_import_file", file);
        formData.append("page_id",pageId);
        formData.append("upload_type",uploadType);
        formData.append("upload_action",uploadAction);
    return this.http.post(this.baseUrl+'/api/paper-details/bulk-import/excel',formData);


  }

  getImageFromUrl(url:string){
   return this.http.get(url, { responseType: 'blob' });
  }

}
