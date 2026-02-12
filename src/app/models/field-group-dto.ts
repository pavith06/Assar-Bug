import { FieldValueDTO } from "./field-value-dto";

export interface FieldGroupDTO {
    groupName: string;
    fieldValues: FieldValueDTO[];
    fieldGroups: FieldGroupDTO[];
}

export class PurchaseStockData {
    numberOfPapers: number;
    totalCostValue: number;
    paymentMethod: string;
    uploadFileName: boolean;
    currencyType: string;
}

export class AllocateStockVo {
    numberOfPaper: number;
    allocatepaperType: string;
    companyId:number;
}
