export class AllocationPoolDto {

    pool_Name: string;
    description: string;
    no_of_paper_allocated: number;
    no_of_paper_Issued: number;
    no_of_paper_available: number;
    status: boolean;

}

export class PoolDto{
  poolAction:string;
  stockCount:number;
  reAllocateToId:number;
  poolId:number;
  poolName:string;
}

export class stockDto{
  stockId:number;
  stockCount:number;
  usedCount:number;
  companyId:number;
  createdDate:string;
  identity:string;
  userTypeId:number;
  userTypeName:string;
  userTypeIdentity:string;
  active:boolean;
}
