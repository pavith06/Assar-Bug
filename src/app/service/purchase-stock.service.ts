import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PurchaseStockListDto } from '../models/purchase-stock-dto/purchase-stock-list-dto';
import { DownloadVo, FilterOrSortingVo } from '../models/Filter-dto/filter-object-backend';

@Injectable({
  providedIn: 'root'
})
export class PurchaseStockService {
 
  constructor(private request : HttpClient) { }

  private baseUrl = environment.API_BASE_URL+"/digital-paper";

  getPurchaseDetails(min:number, max:number,searchValue:string,fitervo:FilterOrSortingVo[]){
    return this.request.post<PurchaseStockListDto[]>(this.baseUrl+"/getPurchaseList?min="+min+"&max="+max+"&searchValue="+searchValue,fitervo);
  }

  getDrowpDownData(){
    return this.request.get(this.baseUrl+"/get-dropdownList");
  }

  getPurchaseOrderCount(filterVo:FilterOrSortingVo[],searchValue:string){
    return this.request.post<number>(this.baseUrl+"/getCount?searchValue="+searchValue,filterVo);
  }

  getPurchaseStockFile(id:number){
    return this.request.get<number>(this.baseUrl+"/get-stockFileId?id="+id);
  }

  purchaseStockDownload(downloadVo: DownloadVo,searchValue:string) {
      return this.request.post(this.baseUrl+"/purchaseStock-download?searchValue="+searchValue,downloadVo, { responseType: 'blob' });
  }

  getPurchaseStockData(purchaseStockId: number) {
    return this.request.get(this.baseUrl+"/get-purchaseOrder?id="+purchaseStockId);
  }
}
