import { FilterOrSortingVo } from "../Filter-dto/filter-object-backend";

export class PurchaseHistoryDto {
    companyId:number;
    comapanyName:string;
    totalCount:string;
    pendingCount:string;
    notification?:any;
    
}

export class ExcelDownloadVo {
    filterVo:FilterOrSortingVo[];
    columnList:string[];
    companyId:number[];
    
}
