import { StageNameReportLoss } from "./enum";


export const ReportLossConst = {
    STATUS: {
      DRAFT: {
        ISRECEIVABLE: true,
        ENABLED_CARDS: [
          StageNameReportLoss.insuredDetails,
          StageNameReportLoss.tpDetails,
          StageNameReportLoss.lossDetails,
          StageNameReportLoss.policeDetails,
          StageNameReportLoss.garageDetails,
          StageNameReportLoss.surveyDetails
        ]
      },
      NOTIFICATION_OPEN: {
        ISRECEIVABLE: true,
        ENABLED_CARDS: [
          StageNameReportLoss.garageDetails,
          StageNameReportLoss.surveyDetails
        ]
      },
      NOTIFICATION_RECEIVED: {
        ISRECEIVABLE: false,
        ENABLED_CARDS: [
          StageNameReportLoss.tpDetails
        ]
      },
      NOTIFICATION_ACCEPTED:{
        ISRECEIVABLE:true,
        ENABLED_CARDS:[
          StageNameReportLoss.garageDetails,
          StageNameReportLoss.surveyDetails
        ]
      },
      MOVED_TO_INSPECTION:{
        ISRECEIVABLE:false,
        ENABLED_CARDS:[
          StageNameReportLoss.surveyReport
        ]
      },
      UNDER_INSPECTION:{
        ISRECEIVABLE:false,
        ENABLED_CARDS:[
          StageNameReportLoss.surveyReport
        ]
      }, RECEIVED_LIABILITY:{
        ISRECEIVABLE:true,
        ENABLED_CARDS:[
          StageNameReportLoss.recoveryDetails,
          StageNameReportLoss.surveyReport
        ]
      }, LIABILITY_ACCEPTED:{
        ISRECEIVABLE:true,
        ENABLED_CARDS:[
          StageNameReportLoss.garageInvoice,
          StageNameReportLoss.recoveryDetails
        ]
      }, SURVEYOR_ASSIGNED:{
        ISRECEIVABLE:true,
        ENABLED_CARDS:[
          StageNameReportLoss.surveyReport
        ]
      },RECOVERY_DTLS:{
        ISRECEIVABLE:true,
        ENABLED_CARDS:[
          StageNameReportLoss.recoveryDetails
        ]
      }
    }
  };
