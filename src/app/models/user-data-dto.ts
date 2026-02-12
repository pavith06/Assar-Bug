export interface UserDataDTO {
    RoleName: string;
    Description: string;
    AddedData: string;
    Mapped: string;
    Status: string;
    RoleId:number;
}

export interface UserTotalDTO {
    name: string;
  }


  export class Messager{
    message:string;
    status:string;
    isReceivable:boolean;
    createdDate:string;
    createdTime:string;
    companyName:string;
    userName:string;
  }


