export interface ReportLossViewDto {
    claimId: number
    state: string
    claimSequenceId:string
    inInsuredInfoId: number;
    inVehicleId: number;
    inInsuredName: string;
    inInsurerName: string;
    inRegistrationNo: string;
    inMake: string;
    inModel: string;
    inPurchaseDate: string;
    inSumInsured: DoubleRange;
    thirdPartyInfoId: number;
    tpVehicleId: number;
    tpName: string;
    tpPolicyNumber: string;
    tpClaimNo: string;
    tpRegistrationNo: string;
    tpRegistrationType: string;
    tpMake: string;
    tpModel: string;
    lossDetailsId: number;
    ldDateOfLoss: string;
    ldClaimNumber: string;
    ldReportedDate: string;
    ldPolicyNumber: string;
    ldReserveAmount: DoubleRange;
    ldPoliceReportNumber: string;
    ldIsTotalLoss: boolean;
    policeReportId: number;
    prDocumentUpload: string;
    garageId: number;
    garageName: string;
    garageLocation: string;
    garageContactDetails: string;
    garageType: string;
    garageInvoiceName: string;

    surveyDetailsId: number;
    sdSurveyName: string;
    sdSurveyAllocationDate: string;
    sdSurveyDueDate: string;
    sdSurveyReportName: string;

    surveyReportId: number;
    srTotalLoss: boolean;
    srSpareParts: DoubleRange;
    srLabourCost: DoubleRange;
    srSurveyAmount: DoubleRange;
    srSurveyReportUpload: string;

    recoveryDetailsId: number;
    rdPoliceReportFee: DoubleRange;
    rdTowingCharge: DoubleRange;
    rdInspectionFee: DoubleRange;
    rdOtherExpenses: DoubleRange;
    rdCashSettlement: DoubleRange;
    rdSpareParts: DoubleRange;
    rdLabourCost: DoubleRange;
    rdTPSurveyAmount: DoubleRange;
    rdClaimAmount: DoubleRange;

    reserveReviewId: number;
    rrReserveAmount: DoubleRange;
    rrTPSurveyAmount: DoubleRange;
    rrTotalClaimAmount: DoubleRange;


    garageInvoiceId: string;
    giDocument: string;
    giGarageInvoiceNo: string;


    debitNoteId: number;
    dnDebitNoteNumber: string;
    dnDebitNoteDocument: string;

    creditNoteId: number;
    cnCreditNoteNumber: string;
    cnCreditNoteDocument: string;
}


