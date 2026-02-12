import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { DownloadVo } from 'ncloud-common-ui/lib/dto/Filter-dto/filter-object-backend';
import { ExcelDownloadVo } from 'ncloud-common-ui/lib/dto/purchase-history-dto';
import { BehaviorSubject } from 'rxjs';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { FieldDTO } from 'src/app/models/field-dto';
import { CompanyTransaction } from 'src/app/models/purchase-stock-dto/transaction-dto';
// import { customerData } from 'src/app/user-management/customer/customer-list/customer-list.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaperService {


    constructor(private http:HttpClient) { }

  @Output()
  // eslint-disable-next-line @typescript-eslint/ban-types
  passObject= new EventEmitter<Object>();

  private product$ = new BehaviorSubject<any>({});
  selectedProduct$ = this.product$.asObservable();

  setProduct(product: any) {
    this.product$.next(product);
  }

  baseUrl=environment.API_BASE_URL+"/digital-paper";
  getErrorTable(skip:number,limit:number,id:number,filter:FilterOrSortingVo[]){
   return this.http.post(this.baseUrl+"/get-ErrorData?bulkUploadId="+id+"&pageIdentity=c741ae6b5c3a49b888d2592a51c6bu8u&skip="+skip+"&limit="+limit,filter);
  }

  getSuccessTable(skip:number,limit:number,id:number,filter:FilterOrSortingVo[]){
    return this.http.post(this.baseUrl+"/get-successData?bulkUploadId="+id+"&pageIdentity=c741ae6b5c3a49b888d2592a51c6bu8u&skip="+skip+"&limit="+limit,filter);
  }

  getErrorTableCount(id:number) {
    return this.http.get(this.baseUrl+"/get-ErrorRecordsCount?bulkUploadId="+id);
  }

  getSuccessTableCount(id:number) {
    return this.http.get(this.baseUrl+"/get-SuccessRecordsCount?bulkUploadId="+id);
  }

  getTotalRecordsCount(id:number) {
    return this.http.get(this.baseUrl+"/get-TotalRecordsCount?bulkUploadId="+id);
  }

  deleteErrorDetails(id:number,identity:string){
    return this.http.get(this.baseUrl+"/deleteScratch?scratchIdentity="+identity+"&scratchId="+id);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  passDataObject(element:Object) {
    this.passObject.emit(element);
  }

  getDropdownData(){
    return this.http.get(this.baseUrl+"/column-data?pageIdentity=c741ae6b5c3a49b888d2592a51c6bu8u")
  }

  paperDetailsExcelDownload(excelDownloadVo:ExcelDownloadVo,searchValue:string){
    return this.http.post(this.baseUrl+"/paper-details-list-download?searchValue="+searchValue,excelDownloadVo,{ responseType: 'blob' });
  }

  paperDetailsExcelAllDownload(searchValue: string, view: string, filterOrSortingVos: FilterOrSortingVo[], digitalPaperIds: string[]) {
    const allSelectDto = { filterOrSortingVos, digitalPaperIds };
    return this.http.post(this.baseUrl + "/all-papers-download?searchValue=" + searchValue + "&view=" + view, allSelectDto,{ responseType: 'blob' });
  }

  // getAllCustomerData(minimum: number, maximum: number,searchValue:string, filterVo: FilterOrSortingVo[]) {
  //   return this.http.post(this.baseUrl+"/get-customerList?min="+minimum+"&max="+maximum+"&searchValue="+searchValue,filterVo);
  // }

  getCustomerCount(filterVo: FilterOrSortingVo[],searhValue:string) {
    return this.http.post(this.baseUrl+"/get-customer-cout"+"?searchValue="+searhValue,filterVo);
  }

  // updateCustomerData(updatData: customerData) {
  //   return this.http.post(this.baseUrl+"/update-customerData",updatData);
  // }

  customExcelDownload(excelDownloadVo:CompanyTransaction, searchValue:string) {
    return this.http.post(this.baseUrl+"/custome-excel-download?searchValue="+searchValue,excelDownloadVo,{ responseType: 'blob' });
  }

  getBulkUploadHistory(id: number) {
    return this.http.get<any>(environment.API_BASE_URL+'/api/auth/paper-details/bulk-import/get-history?bulkId='+id)
  }

}
