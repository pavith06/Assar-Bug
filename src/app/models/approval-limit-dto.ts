export class ApprovalLimitDto{
    approvalLimitId:number;
    fieldName:string;
    approvalLevel:ApprovalLevelDto[];
    isActive:string;
    stageName:string;
    sectionName:string;
    role?:string[];

}

export class ApprovalLevelDto{

    roleId:number;
	minValue:DoubleRange;
     maxValue:DoubleRange;
     roleName:string;

}