import { MetaDataDto } from "../report-loss-dto/meta-data-dto";
export class InsuranceCompanyDto{
        emInsCompanyId: number;
        emInsName: string;
        emInsPhone: string;
        emInsEmail: string;
        emInsPassword: string;
        emInsLocation: string;
        emInsAddress: string;
        emInsMaxPayableAmount: number;
        emMaxTime: number;
        emInsLogo: string;
        emInsShortName: string;
        emInsIsActive:string;
        emInsExceedDate:Date;

}

export interface FileUploadDTO {
        fileList: File[];
        referenceId?: string;
        companyId?:string;
        fieldName: string;
      }

export interface CompanyDto{
  companyId:number;
	name:string;
	shortName:string;
	identity:string;
	createdDate:any;
	createdBy:number;
	modifiedDate:any;
	modifiedBy:any;
	email:string;
	phone:string;
	location:string;
	password:string;
	address:string;
	logo:string;
	isDeleted:boolean;
}
