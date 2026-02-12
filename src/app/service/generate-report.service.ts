import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerateReportService {
  private baseUrl = environment.API_BASE_URL+"/digital-paper"

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private http:HttpClient) { }

  public formDetails: string[] = [];



  savereport(values) :Observable<any>{

    return this.http.post(this.baseUrl+"/save-reports",values);

  }
  getReport():Observable<any>{
    return this.http.get(this.baseUrl+"/report/getData");
  }

  getSingleData(identity:string){
    return this.http.post<any>(this.baseUrl+"/get-reports",identity);
  }
  getPurchaseOrderColumn(){
    return this.http.get<any>(this.baseUrl+"/get-purchaseOrder-column");
  }

  getDigitalPaperColumn(){
    return this.http.get<any>(this.baseUrl+"/get-digitalpaper-column");
  }

  getReportdata(report:any,minLength:number,maxLength:number):Observable<any>{
    return this.http.post(this.baseUrl+"/get-previewData"+"?min="+minLength+"&max="+maxLength,report);
  }

  getReportDataCount(report:any):Observable<any>{
    return this.http.post(this.baseUrl+"/get-previewData-count",report);
  }

  updateValue(report:any){
    return this.http.post(this.baseUrl+"/updateData",report);
  }

  getByteSourceForExcelReport(report:any):Observable<any>{
    return this.http.post(this.baseUrl+"/generate/report/export-to-excel", report, { responseType: 'blob' });
  }

  getByteSourceForCsvReport(report: any): Observable<any> {
    return this.http.post(this.baseUrl+"/generate/report/export-to-csv", report, { responseType: 'blob' });
  }

  getByteSourceForPdfReport(report: any): Observable<any> {
    return this.http.post(this.baseUrl+"/generate/report/export-to-pdf", report, { responseType: 'blob' });
  }
}
