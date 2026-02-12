/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})

export class  ReceivableService {
  private baseUrl = environment.API_BASE_URL+"/api"
   private isCheckedSubject = new BehaviorSubject<boolean>(false);
  public isChecked$ = this.isCheckedSubject.asObservable();
  constructor(private http:HttpClient, private adminService: AdminService) { }

  checkUserIsAdmin(){
    return this.adminService.isAssociationUser();
  }
  

  public getCompanyReceivables():Observable<any>{
    if (this.checkUserIsAdmin()) {
      return this.http.get(this.baseUrl+"/reportloss/get-receivable-company?association=true");
    }else{
    return this.http.get(this.baseUrl+"/reportloss/get-receivable-company");
    }
}

  public getCompanyPayables():Observable<any>{
    if (this.checkUserIsAdmin()) {
       return this.http.get(this.baseUrl+"/reportloss/get-payable-company?association=true");
    }else{
       return this.http.get(this.baseUrl+"/reportloss/get-payable-company");
    }
}

  public getAllReceivables():Observable<any>{
  return this.http.get(this.baseUrl+"/reportloss/get-total-receivables");
}

  public getAllPayables():Observable<any>{
  return this.http.get(this.baseUrl+"/reportloss/get-total-payables");
}
  
  public getPayableList(list : any):Observable<any>{
    if (this.checkUserIsAdmin()) {
      return this.http.post(this.baseUrl+"/all-receivable-list",list);
    }else{
    return this.http.post(this.baseUrl+"/get-payable-list",list);
    }
  }

  public getPayableCount(list : any):Observable<any>{
    if (this.checkUserIsAdmin()) {
      
      return this.http.post(this.baseUrl+"/all-receivable-listCount",list);
    }else{
    return this.http.post(this.baseUrl+"/get-payableCount",list);
    }
  }

  public getReceivableList(list : any):Observable<any>{
    if (this.checkUserIsAdmin()) { 
      return this.http.post(this.baseUrl+"/all-payable-list",list);
    }else{
    return this.http.post(this.baseUrl+"/get-receivable-list",list);
    }
  }

  public getReceivableTotalCount(list : any):Observable<any>{
    if (this.checkUserIsAdmin()) { 
      return this.http.post(this.baseUrl+"/all-receivable-list-count",list);
    }else{
    return this.http.post(this.baseUrl+"/get-receivable-listCount",list);
    }
  }

  public DeleteReceivabletList(claimId):any{
    return this.http.post(this.baseUrl+"/receivable/DeleteId" +'?claimId=' + claimId,{});
  }

  getCheckbox():Observable<boolean> {
    return this.isCheckedSubject;
   
  }
  setCheckbox(value:boolean){
    return this.isCheckedSubject.next(value);
   
  }
}
  export interface ClaimTable{
    claimNo: string;
    insurarName: string;
    atFaultCompany: string;
    lossOfDate: string;
    totalLossAmount: string;
    img:string;
    stageSection: string;
    status: string;
  }
  
