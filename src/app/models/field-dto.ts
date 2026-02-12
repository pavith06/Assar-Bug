export interface FieldDTO {
    fieldId: string;
    aliasName:string;
    fieldName: string;
    fieldType: string;
    fieldDefault:string;
    minlength:number;
    maxlength:number;
    regex:string;
    mandatory:boolean;
}


export class reportDataVo{
    companyName:string;
    thirdPartyCompanyName: Array<string>;
    fromDate:string;
    toDate:string;
    period:string
    claimType:Array<string>
    selectColumn: Array<string>;
    fileType:string;
    reportType:string;
    totalColumnCount:number;
    identity:string;
    status: Array<string>;
}
