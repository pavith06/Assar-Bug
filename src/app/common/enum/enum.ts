import { appConst } from "src/app/service/app.const";

export enum ErrorCode {
  serverDown = 0,
  unauthorised = 403,
  unauthenticated = 401
}

export enum ExpireTime {
  expirationTime = 12 * 60 * 60 * 1000
}

export enum StageNameReportLoss {

  insuredDetails = 'Insured Details',
  tpDetails = 'TP Details',
  lossDetails = 'Loss Details',
  policeDetails = 'Police Report',
  garageDetails = 'Garage Details',
  surveyDetails = 'Survey Details',
  surveyReport = 'Survey Report',
  recoveryDetails = 'Recovery Details',
  reserveReview = 'Reserve Review',
  contact = 'Contact',
  garageInvoice = 'Garage Invoice',
  debitNote = 'Debit Note',
  creditNote = 'Credit Note',
}

export enum UserList{
  userID="User ID",
  userName="User Name",
  emailId="Email Id",
  phoneNumber="Phone Number",
  userRole="User Role",
  addedDate="Added Date",
  status="Status"
}
export enum ReportLossStatus {
  draft = 'Draft',
  notificationOpen = 'Notification Open',
  notificationReceived = 'Notification Received',
  notificationAccepted = 'Notification Accepted',
  garageAndSurveyDetails = 'Garage And Survey Details Updated',
  movedToInspection = 'Moved To Inspection',
  underInspection = 'Under Inspection',
  expensesAndDocumentUpdated = 'Expenses And Document Updated',
  receivedLiabality = 'Received Liability',
  liabilityAccepted = 'Liability Accepted',
  liabilityReview = 'Liability Review',
  confirmLiability = 'Confirmed Liability',
  debitNoteGenerated = 'Debit Note Generated',
  claimSettled = 'Claim Settled',
  notificationRejected = 'Notification Rejected',
  receiveRejectedNotification = 'Received Rejected Notification',
  needMoreDetails = 'Need More Details',
  detailsProvided = 'Details Provided',
  reopen = 'Reopen',
  dispute = 'Dispute',
  disputeReopen = 'Dispute Reopen',
  totalLossInitiated = 'TotalLoss Initiated',
  totalLossAccepted = 'TotalLoss Accepted',
  surveyAssigned = 'Surveyor Assigned'
}

export enum ReportLossStatusValue {
  draft = 100,
  notificationOpen = 101,
  notificationReceived = 102,
  notificationAccepted = 103,
  garageAndSurveyDetails = 104,
  movedToInspection = 105,
  underInspection = 106,
  expensesAndDocumentUpdated = 107,
  receivedLiabality = 108,
  liabilityReview = 109,
  liabilityAccepted = 110,
  confirmLiability = 111,
  debitNoteGenerated = 112,
  claimSettled = 113,
  //fail flow
  // notificationRejected = 'NOTIFICATION REJECTED',
  // receiveRejectedNotification = 'RECEIVED REJECTED NOTIFICATION',
  // needMoreDetails = 'NEED MORE DETAIL',
  // detailsProvided = 'DETAILS PROVIDED',
  // reopen = 'REOPEN',
  // dispute = 'DISPUTE',
  // disputeReopen = 'DISPUTE REOPEN',
  // totalLossInitiated = 'TOTALLOSS INITITED',
  // totalLossAccepted = 'TOTALLOSS ACCEPTED',
  // surveyAssigned = 'SURVEYOR ASSIGNED'
}

export enum ReportLossStageEnum {
  notificationStage = 'Notification Stage',
  claimInspectionStage = 'Claim Inspection Stage',
  liabilityConfirmationStage = 'Liability Confirmation Stage',
  settlementStage = 'Settlement Stage'
}

export enum MimeTypeEnum {
  IMAGE = "image",
  PDF = "pdf"
}

export enum EntityName {
  insuredDetails = 'InsuredDetails',
  tpDetails = 'ThirdPartyDetails',
  lossDetails = 'LossDetails',
  policeDetails = 'PoliceReport',
  garageDetails = 'GarageInfo',
  surveyDetails = 'SurveyDetails',
  surveyReport = 'SurveyReport',
  recoveryDetails = 'RecoveryDetails',
  reserveReview = 'ReserveReview',
  contact = 'Contact',
  garageInvoice = 'GarageInvoice',
  debitNote = 'DebitNote',
  creditNote = 'CreditNote',
}

export enum REPORTHEADER {
  accepted = 'ACCEPTED',
  rejected = 'REJECTED',
  need_more_details = 'NEED_MORE_DETAILS',
  save = 'SAVE',
  assign_surveyor = 'ASSIGN_SURVEYOR',
  dispute = 'DISPUTE',
  details_provuded = 'DETAILS_PROVIDED',
  approved = 'APPROVED',
  reopen = 'REOPEN',
  dispute_repon = 'DISPUTE_REOPEN',
}

export enum ErrorCodeToIgnore {
  companyLogoError = 'E7112',
  dashboardDataError = 'E7137',
  noCompanySelectedError = '12345'
}

export enum File_ref_tupe {
  ref_type = 'stock'
}

export enum DateTime {
  startingTime = " 00:00:00",
  endingTime = " 23:59:00"
}

export const UserManagementRoleRestriction = [
  {
    menuName: appConst.MENU_CONSTANTS.MENUNAME.DASHBOARD.NAME,
    sectionName: [
      {
        name: appConst.MENU_CONSTANTS.MENUNAME.DASHBOARD.NAME,

        subSection: [
          {
            name: 'Digital Paper Taken',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Digital Paper Status',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Prediction',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Recent Digital Papers',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Upcoming Expiry Digital Papers',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Quick Links',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'No of Digital Paper Purchased vs No of Digital Paper Allocated',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Digital paper status',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Top purchases',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Recent Transaction',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Recent Digital papers',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
        ],
      },
    ],
  },
  {
    menuName: appConst.MENU_CONSTANTS.MENUNAME.REPORTS.NAME,
    sectionName: [
      {
        name: appConst.MENU_CONSTANTS.MENUNAME.REPORTS.NAME,

        subSection: [
          {
            name: 'Reports',
            isView: true,
            isEdit: true,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Generate Reports',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Preview Report',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
        ],
      },
    ],
  },
  {
    menuName: appConst.MENU_CONSTANTS.MENUNAME.USERMANAGEMENT.NAME,
    sectionName: [
      {
        name: 'Allocation Pool',
        subSection: [
          {
            name: 'Pool List',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Allocate Stock',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Reallocate',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Deallocate',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
        ]
      },
      {
        name: 'User Role',
        subSection: [
          {
            name: 'User Role List',
            isView: true,
            isEdit: true,
            isClone: true,
            isDisable: true,
            isDownload: true,
          },
          {
            name: 'Add New Role',
            isView: true,
            isEdit: true,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'User Role Card',
            isView: true,
            isEdit: true,
            isClone: true,
            isDisable: true,
            isDownload: false,
          }
        ],
      },
      {
        name: 'User Management',
        subSection: [
          {
            name: 'User List',
            isView: true,
            isEdit: true,
            isClone: true,
            isDisable: true,
            isDownload: true,
          },
          {
            name: 'Add New User',
            isView: true,
            isEdit: true,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
        ],
      },
      {
        name: 'Customer',
        subSection: [
          {
            name: 'Customer',
            isView: true,
            isEdit: true,
            isClone: false,
            isDisable: false,
            isDownload: true,
          }
        ],
      }
    ],
  },
  {
    menuName: appConst.MENU_CONSTANTS.MENUNAME.ENTITYMANAGEMENT.NAME,
    sectionName: [
      {
        name: appConst.MENU_CONSTANTS.MENUNAME.ENTITYMANAGEMENT.NAME,

        subSection: [
          {
            name: 'Company List',
            isView: true,
            isEdit: true,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Add New Company',
            isView: true,
            isEdit: true,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Company Card',
            isView: true,
            isEdit: true,
            isClone: true,
            isDisable: false,
            isDownload: false,
          },
        ],
      },
    ],
  },
  {
    menuName: appConst.MENU_CONSTANTS.MENUNAME.PURCHASESTOCK.NAME,
    sectionName: [
      {
        name: appConst.MENU_CONSTANTS.MENUNAME.PURCHASESTOCK.NAME,

        subSection: [
          {
            name: 'Purchase List',
            isView: true,
            isEdit: true,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'New Purchase',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
        ],
      },
    ],
  },
  {
    menuName: appConst.MENU_CONSTANTS.MENUNAME.PAPERDETAILS.NAME,
    sectionName: [
      {
        name: appConst.MENU_CONSTANTS.MENUNAME.PAPERDETAILS.NAME,

        subSection: [
          {
            name: 'Paper List',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Generate Paper (Manual)',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Generate Paper (Bulk)',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Revoke (Manual)',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Revoke (Bulk)',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Print',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
        ],
      },
    ],
  },
  {
    menuName: appConst.MENU_CONSTANTS.MENUNAME.AUTHORITYPAPERDETAILS.NAME,
    sectionName: [
      {
        name: appConst.MENU_CONSTANTS.MENUNAME.AUTHORITYPAPERDETAILS.NAME,

        subSection: [
          {
            name: 'Paper Details List',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Paper Details Card',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'View Paper',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Purchase History List',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Purchase History Card',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'View History',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: true,
          },
          {
            name: 'Approve',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
          {
            name: 'Reject',
            isView: true,
            isEdit: false,
            isClone: false,
            isDisable: false,
            isDownload: false,
          },
        ],
      },
    ],
  },
];

export enum ToasterMessage {
  claimAccepted = 'Claim Accepted',
  claimRejected = 'Claim Rejected',
  moreDetailsRequired = 'More Details Required',
  claimInitiatedSuccessfully = 'Claim Initiated Successfully',
  claimSubmitted = 'Claim Submitted',
  surveyorAssigned = 'Surveyor Assigned',
  disputeRaised = 'Dispute Raised',
  detailsProvided = 'Details Provided',
  claimApproved = 'Claim Approved',
  claimReponed = 'Claim Reopened',
  disputeReopened = 'Dispute Reopened'
}

export enum AllocationPool {
  pollName = 'Pool Name',
  description = 'Description',
  no_of_paper_allocated = 'No.of paper allocated',
  no_of_paper_Issued = 'No.of.paper Issued',
  no_of_paper_available = 'No.of.paper available',
  allocate_and_Revoke = 'Allocate and Revoke',
  status = 'Status'
}


export enum componentName {
  Purchase_History = "purchase-history",
  Purchase_Stock = "purchase-stock",
  TRANSACTION_LIST = "trasaction-list",
  PAPER_DETAILS = "paper_details",
  PAPER_DETAILS_TRANSACTION_LIST = "paper_details_transaction_list"
}

export enum PaymentChoice {
  CHEQUE = 'CHEQUE',
  CASH = 'CASH',
  CREDIDCARD = 'CREDIT CARD',
  UPI = 'UPI',
  AIRTELMONEY = 'AIRTEL MONEY',
  DEBITCARD = 'DEBIT CARD',
}

export enum AllocationPoolSortingColumn {
  USERTYPENAME = 'userTypeName',
  IDENTITY = 'identity',
  STOCKCOUNT = 'stockCount',
  USEDCOUNT = 'usedCount',
  NULL = 'null',
  ISACTIVE = 'isActive'
}

export enum Date_Select{
  YEAR='Year',
  MONTH='Month',
  Date='Date',
  CUSTOM='Custom'
}

export enum BulkUpload {
  ERRORFIELDS = 'Error Fields',
  ERRORMESSAGES = 'Error Message',
  SCRATCHID = "scratchId",
  IDENTITY = "identity"
}

export enum UserProfileReportType {
  RP_TYPE = "USER_PROFILE"
}

export enum ImplementConfigurationEnum {
  ALLOCATION_BASED_ON = 'allocation_type',
  DIGITAL_PAPER_COST = 'cost/paper',
  INSURANCE_USER_TYPE = 'Insurance User Type',
  SHARE_PERCENTAGE = 'Share Percentage',
  PAPER_AUTO_GENERATION_FORMATE = 'Paper auto generation no. format',
  PAPER_EXPIRATION_MAIL = 'Paper expiration mail trigger days',
  MINIMUM_PAPER_LIMIT = 'Minimum Paper Limit',
  SUFFIX = 'Suffix',
  PREFIX = 'Prefix'
}

export enum MaxInt{
  INT=2147483647
}
export enum MenuSectionNames{
  Digital_Paper_Taken="Digital Paper Taken",
  Digital_Paper_Status="Digital Paper Status",
  Prediction="Prediction",
  Recent_Digital_Papers="Recent Digital Papers",
  Upcoming_Expire_Digital_Papers="Upcoming Expire Digital Papers",
  Deallocate="Deallocate",
  User_Role_List="User Role List",
  User_Role_Card="User Role Card",
  Add_New_Role="Add New Role",
  User_List="User List",
  Add_New_User="Add New User",
  Company_List="Company List",
  Add_New_Company="Add New Company",
  Purchase_List="Purchase List",
  New_Purchase="New Purchase",
  View_Paper="View Paper",
  Paper_Details="Paper Details",
  Paper_Details_List="Paper Details List",
  Paper_Details_Card="Paper Details Card",
  Vehicle_Details="Vehicle Details",
  Generate_Paper_Manual="Generate Paper (Manual)",
  Generate_Paper_Bulk="Generate Paper (Bulk)",
  Revoke_Manual="Revoke (Manual)",
  Revoke_Bulk="Revoke (Bulk)",
  Reports="Reports",
  Generate_Reports="Generate Reports",
  Preview_Report = "Preview Report",
  Print="Print",
  Pool_List="Pool List",
  Allocate_Stock="Allocate Stock",
  Reallocate="Reallocate",
  Customer="Customer",
  View_History="View History",
  Purchase_History="Purchase History",
  Purchase_History_List="Purchase History List",
  Purchase_History_Card="Purchase History Card",
  Approve="Approve",
  Reject="Reject",
  Paper_List="Paper List"
}


export enum ErrorHints {
  fieldName = 'FIELD_NAME',
  aliasName = 'ALIAS_NAME',
  fieldFormat = 'FIELD_FORMAT',
  pool = "POOL"
}
