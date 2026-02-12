import { FilterOrSortingVo } from "../Filter-dto/filter-object-backend";

export class CompanyTransaction{
    companyId:number[] = [];
    min?:number;
    max?:number;
    filter:FilterOrSortingVo[];
    selectedColumn:String[]=[];
    isNotification?:boolean;
    view:string;
}