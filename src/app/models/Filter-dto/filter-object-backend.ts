export class FilterOrSortingVo{
  columnName:string;
  condition:string;
  filterOrSortingType:string;
  intgerValueList:number[] = [];
  valueList:string[] = [];
  isAscending = true;
  type:string;
  value:string;
  value2:string;
}

export class DownloadVo{
  filterVo : FilterOrSortingVo[] = [];
  min:number;
  max:number;
  columnList:String[]=[];
}
