import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { FilterObject } from "src/app/models/Filter-dto/filter-object";
import { FilterOrSortingVo } from "src/app/models/Filter-dto/filter-object-backend";
import { environment } from "src/environments/environment";

@Injectable(
    {
        providedIn:'root'
    }
)
export class BulkRevokeService {

    private baseUrl = environment.API_BASE_URL+"/digital-paper";
    private commonbaseUrl=environment.API_BASE_URL+"/api";
    private ClickAddnew = new BehaviorSubject<boolean>(false);
    public ClickAdd$ = this.ClickAddnew.asObservable();

    @Output()
    emitFilterObject=new EventEmitter<FilterObject[]>();
    @Output()
    emitFilterVoObject=new EventEmitter<FilterOrSortingVo[]>();
    constructor(private http:HttpClient,private router:Router,) {}


    getBulkRevokeCount(bulkUploadId:number,filterVo: FilterOrSortingVo[]) {
        return this.http.post(this.baseUrl + "/get-revoke-scratch-count?bulkUploadId="+bulkUploadId, filterVo);
    }

    getBulkRevokeErrorData(bulkUploadId:number,skip: number, limit: number, filterVo: FilterOrSortingVo[]) {
        return this.http.post(this.baseUrl + "/get-br-error-data" + "?skip=" + skip + "&limit=" + limit+"&bulkUploadId="+bulkUploadId, filterVo);
    }

    getBulkRevokeSuccessData(bulkUploadId:number,skip: number, limit: number, filterVo: FilterOrSortingVo[]) {
        return this.http.post(this.baseUrl + "/get-br-success-data" + "?skip=" + skip + "&limit=" + limit + "&bulkUploadId="+bulkUploadId, filterVo);
    }

    getErrorCount(bulkUploadId:number,filterVo: FilterOrSortingVo[]) {
        return this.http.post(this.baseUrl+"/get-br-error-count?bulkUploadId="+bulkUploadId,filterVo);
    }

    getSuccessCount(bulkUploadId:number,filterVo: FilterOrSortingVo[]) {
        return this.http.post(this.baseUrl+"/get-br-success-count?bulkUploadId="+bulkUploadId,filterVo);
    }

    deleteBulkRevoke(identity: string) {
       return this.http.post<string>(this.baseUrl+"/delete-bulk-revoke?identity="+identity,{})
    }

    downloadErrorFile(pageIdentity: string,bulkUploadId:number): Observable<any> {
        return this.http.post(this.baseUrl+"/br-excel-file-download"+"?pageIdentity="+pageIdentity+ "&bulkUploadId="+bulkUploadId,{},{responseType: 'blob'});
    }

    getAddNew(): Observable<boolean> {
        return this.ClickAddnew;

    }
    setAddNew(value: boolean) {
        return this.ClickAddnew.next(value);

    }

    passFilterObject(value: FilterObject[]) {
        this.emitFilterObject.emit(value);
    }

    passFilterVoObject(value: FilterOrSortingVo[]) {
        this.emitFilterVoObject.emit(value);
    }
}
