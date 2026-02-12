import { CompanyDto, InsuranceCompanyDto } from './../models/entity-management-dto/insurance-company';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ExcelDownloadVo, PurchaseHistoryDto } from '../models/purchase-stock-dto/purchase-history-dto';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { FilterOrSortingVo } from '../models/Filter-dto/filter-object-backend';
import { TransactionsListDto } from '../models/purchase-stock-dto/transactions-list-dto';
import { CompanyTransaction } from '../models/purchase-stock-dto/transaction-dto';
import { PaymentDetailsDto } from '../models/paymentdetails-dto';
import { FilterObject } from '../models/Filter-dto/filter-object';
import { PaperDetailsListDto } from '../models/paper-details-dto/paper-details-list-dto';
import { CompanyDetails } from '../models/company-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthorityPaperService {


  sendMailForAllPapers(searchValue: string, filterOrSortingVos: FilterOrSortingVo[],digitalPaperIds:string[]) {
    const allSelectDto = { filterOrSortingVos, digitalPaperIds };
      return this.http.post(this.baseUrl+"/all-papers-mail?searchValue="+searchValue,allSelectDto);
  }

  getDropdownDataList() {
    return this.http.get(this.baseUrl+"/get-dropdown-paperdetails");
  }
  sendEmail(paperDetailsDtoCopy:PaperDetailsListDto[]) {
    return this.http.post(this.baseUrl+"/email-send",paperDetailsDtoCopy)
  }

  private baseUrl = environment.API_BASE_URL+"/digital-paper";
  private commonbaseUrl=environment.API_BASE_URL+"/api";
  private ClickAddnew = new BehaviorSubject<boolean>(false);
  public ClickAdd$ = this.ClickAddnew.asObservable();
  private resetCheckbox= new BehaviorSubject<boolean>(false);
  private searchFilter = new BehaviorSubject<FilterOrSortingVo[]>(null);
  public filter$ = this.searchFilter.asObservable();
  private passDownloadDisableValue= new BehaviorSubject<boolean>(false);
  @Output()
  emitFilterObject=new EventEmitter<FilterObject[]>();
  @Output()
  emitFilterVoObject=new EventEmitter<FilterOrSortingVo[]>();


  constructor(private http:HttpClient,private router:Router) { }
  private selectedColumnForDownlod = new BehaviorSubject([]);
  public isChecked$ = this.selectedColumnForDownlod.asObservable();

  getPurchaseHistoryCount(filterVo: FilterOrSortingVo[], searchValue:string) {
    return this.http.post(this.baseUrl+"/getPurchaseOrderEntityCount"+"?searchValue="+searchValue,filterVo)
  }


  getPurchaseHistory(skip:number,limit:number,filterVo: FilterOrSortingVo[],searcValue:string) {
    return this.http.post<PurchaseHistoryDto[]>(this.baseUrl+"/purchaseHistory"+"?skip="+skip+"&limit="+limit+"&searchValue="+searcValue,filterVo);
  }

  excelDownload(excelDownloadVo:ExcelDownloadVo,searchValue:string): Observable<any> {
    return this.http.post(this.baseUrl+"/purchase-history-download"+"?searchValue="+searchValue,excelDownloadVo,{ responseType: 'blob' });
  }

  excelDownloadForPaperDetails(excelDownloadVo:ExcelDownloadVo, searchValue:string): Observable<any> {
    return this.http.post(this.baseUrl+"/get-paperdetails-download"+"?searchValue="+searchValue,excelDownloadVo,{ responseType: 'blob' });
  }

  excelDownloadForPaperDetailsTransactionList(excelDownloadVo:ExcelDownloadVo,searchValue:string): Observable<any> {
    return this.http.post(this.baseUrl+"/download-view-paper"+"?searchValue="+searchValue,excelDownloadVo,{ responseType: 'blob' });
  }

  excelDownloadForTransaction(excelDownloadVo:CompanyTransaction, searchValue:string): Observable<any> {
    return this.http.post(this.baseUrl+"/transaction-download"+"?searchvalue="+searchValue,excelDownloadVo,{ responseType: 'blob' });
  }

  excelDownloadForDigitalPaper(id:number){
    return this.http.get(this.baseUrl+"/get-paperExcel?bulkUploadId="+id+"&pageIdentity=c741ae6b5c3a49b888d2592a51c6bu8u",{ responseType: 'blob' });
  }

  getSelectedColumn():Observable<string[]> {
    return this.selectedColumnForDownlod;

  }
  setSelectedColumn(value:string[]){
    return this.selectedColumnForDownlod.next(value);

  }

  getAllPurchaseOrderCount(transactionVo:CompanyTransaction,searchValue:string) {
    return this.http.post<number>(this.baseUrl+"/getAllCount"+"?searchValue="+searchValue,transactionVo);
  }

  getCompanyPurchaseTransaction(transactionVo:CompanyTransaction,searchvalue:string){
    return this.http.post<TransactionsListDto[]>(this.baseUrl+"/get-transactionDetails"+"?searchvalue="+searchvalue,transactionVo);
  }

  setApproveOrReject(paymentDetails:PaymentDetailsDto){
      return this.http.post<string>(this.baseUrl+"/purchase-details/status",paymentDetails);
  }

  getCompanyCount(){
    return this.http.get<number>(this.commonbaseUrl+"/entitymanagement/getInsuranceDataCount");
  }

  getCompanyList(min:number,max:number){
    return this.http.get<CompanyDetails[]>(this.commonbaseUrl+"/entitymanagement/getInsuranceData"+"?min="+min+"&max="+max);
  }

  getPaperDetailsCount(filterVo: FilterOrSortingVo[],view:string,searchValue:string) {
    return this.http.post(this.baseUrl+"/get-paperdetails-count"+"?view="+view+"&searchValue="+searchValue,filterVo);
  }

  getPaperDetailsList(skip: number, limit: number,searchvalue:string, filterVo: FilterOrSortingVo[],view:string) {
    return this.http.post<PaperDetailsListDto[]>(this.baseUrl+"/get-paperdetails-list"+"?skip="+skip+"&limit="+limit+"&view="+view+"&searchValue="+searchvalue,filterVo);
  }

  // updateRevokeStatusData(identity: string) {
  //   return this.http.post<string>(this.baseUrl+"/update-revoke-status?identity="+identity,{});
  // }

  
  // updateRevokeStatusData(identity: string,selectedReason:string) {
  //   return this.http.post<string>(this.baseUrl+"/update-revoke-status?identity="+identity,{});
  // }

updateRevokeStatusData(identity: string, reasonId: number) {
  return this.http.post<string>(
    `${this.baseUrl}/update-revoke-status?identity=${identity}&reasonId=${reasonId}`, {}
  );
}



  getPaperDetailsData(identity: string) {
    return this.http.get<PaperDetailsListDto>(this.baseUrl+"/get-revoke-data?identity="+identity,{});
  }

  downloadSampleExcel(sampleFileColumns: string[]) {
    return this.http.post(this.baseUrl+"/sample-file-download",sampleFileColumns,{responseType: 'blob'});
  }

  bulkUploadSampleExcelDownload(pageIdentity: string) : Observable<any> {
    return this.http.post(this.baseUrl+"/bulk-upload-excel-download?pageIdentity="+pageIdentity,{},{responseType: 'blob'});
  }

  getAuthorityPaperDetailsCount(filterVo: FilterOrSortingVo[], searchValue:string) {
    return this.http.post(this.baseUrl+"/authority/get-stock-count"+"?searchValue="+searchValue,filterVo);
  }

  getAuthorityPaperDetailsList(skip: number, limit: number,isCard:string, filterVo: FilterOrSortingVo[],searchValue:string) {
    return this.http.post(this.baseUrl+"/get-stock-data"+"?skip="+skip+"&limit="+limit+"&searchValue="+searchValue+"&isCard="+isCard,filterVo);
  }

  getAuthPaperDetailsCount(companyDetails: CompanyTransaction, searhValue:string) {
   return this.http.post<number>(this.baseUrl+"/get-paperdetailscount-bycompany"+"?searchValue="+searhValue,companyDetails);
  }

  getAuthPaperDetailsList(companyDetails: CompanyTransaction, searchValue:string) {
    return this.http.post<PaperDetailsListDto>(this.baseUrl+"/get-paperdetailslist-bycompany"+"?searchValue="+searchValue,companyDetails);
  }


  getAddNew():Observable<boolean> {
    return this.ClickAddnew;

  }
  setAddNew(value:boolean){
    return this.ClickAddnew.next(value);

  }

  passFilterObject(value:FilterObject[]){
      this.emitFilterObject.emit(value);
    }

  passFilterVoObject(value:FilterOrSortingVo[]){
    this.emitFilterVoObject.emit(value);
  }

  getCompanyDto() {
    return this.http.get<CompanyDto[]>(this.commonbaseUrl+"/entitymanagement/get-all-company");
  }

  setResetCheckBoxValue(value:boolean){
    this.resetCheckbox.next(value);
  }

  getResetCheckBoxValue(){
    return this.resetCheckbox.asObservable();
  }

  getFilterValue(): Observable<FilterOrSortingVo[]> {
    return this.searchFilter;
 }

 setFilterValue(value: FilterOrSortingVo[]) {
    return this.searchFilter.next(value);
  }

  setDownloadDisableValue(value:boolean){
    this.passDownloadDisableValue.next(value);
  }

  getDownloadDisableValue(){
    return this.passDownloadDisableValue.asObservable();
  }
}
