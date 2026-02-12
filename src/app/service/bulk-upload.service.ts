import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BulkUploadService {

  private baseUrlName = environment.API_BASE_URL+"/api";
  private baseUrl = environment.API_BASE_URL+ "/api/report-loss/bulk-import/download-sample-excel";

  private errorHistoryurl = environment.API_BASE_URL + "/api/report-loss/bulk-import/import-history";
  private downloadErrorHistoryUrl = environment.API_BASE_URL + "/api/report-loss/bulk-import/error-data";
  private bulkUploadUrl = environment.API_BASE_URL + "/api/report-loss/bulk-import/excel";
  constructor(private http: HttpClient) { }

  downLoadSampleExcelFile(){
   return this.http.get(this.baseUrl, {responseType: 'blob'});
  }


  getErrorHistory(){
    return this.http.get<any>(this.errorHistoryurl);
  }

  getBulkImportHistroryData(isBulkUpload:boolean){
    return this.http.get<any>(this.baseUrlName+"/get-bulkimport_histrory?isBulkUploadPage="+isBulkUpload);
  }

  downloaderrorData(id:string){
    return this.http.get(this.downloadErrorHistoryUrl + '?upload_id='+id, {responseType: 'blob'});
  }

  bulkUpload(file){
    const pageId = 'sdjashbsdadajdkui';
     const formData = new FormData();
     formData.append("bulk_import_file", file);
     return this.http.post(this.bulkUploadUrl+'?page_id=' + pageId, formData)
  }

}

export class ErrorHistory{
  uploadId:number;
  successCount:number;
  failureCount:number;
  totalCount:number;
  status:string;
  pageId:number;
  createdBy:string;
  createdDate:string;
  identity:string;
}
