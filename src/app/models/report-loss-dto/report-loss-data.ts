import { MetaDataDto } from 'src/app/models/report-loss-dto/meta-data-dto';
import { FilterOrSortingVo } from '../Filter-dto/filter-object-backend';
export class ReportLossData{
  claimId:string;
  insuredName:string;
  atFaultCompanyName:string;
  receivableAmount:number;
  status:string;
  metaData:MetaDataDto;
  receivable:boolean;
  insurerName:string;
  lastStatus:string;
  totalLossType:string;
  claimSequenceId:string;
}


export class reportCardVo{
  insuredName:string;
  fromDate:Date;
  toDate:Date;
  reportType:number;
  fileType:number;
  selectedColumn:[];
  insuredCompanyId:number;
  selectedColumnCount:number;
  status:[];
  period:string;
  identity:string;
  reportName:string;
  purchaseOrderTotalCount:number;
  purchaseOrderPendingCount:number;
  purchaseOrderSuccessCount:number;
  paperDetailsTotalCount:number;
  paperDetailsActiveCount:number;
  paperDetailsExpiredCount:number;
}

export class PreviewReportVo{
  reportData :reportCardVo;
  filterVo: FilterOrSortingVo[]=[];
}
