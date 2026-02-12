import { Directive } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
@Directive({
    selector: '[ErrorHandler]',
  })
  export class ErrorHandlerDirective {
    DEFAULT_ERROR_MSG = "Unknown error! Please contact your administrator.";
    DEFAULT_REF_DIV_ID = "errorhandler";
    DEFAULT_ERROR_DIV_ID = "errorMsg";
    DANGER = "errorMsgDanger";
    SUCCESS = "success-msg";
    private subscriptions: any[] = [];
    constructor(public toastr: ToastrService, 
      private route: Router, private cookie : CookieService) {}
    public getErrorCode(response: any) {
      let result;
      let errorCode = "";
      try {
        result = JSON.parse(response.error.message);
      } catch (e) {
        return errorCode;
      }
      let errorList = [];
      if (result?.errorIds != null && result.errorIds != "") {
        for (let i = 0; i < result.errorIds.length; i++) {
          errorList.push(result.errorIds[i]);
        }
      }
      if (errorList.length > 0) {
        errorCode = errorList[0].errorCode;
      }
      return errorCode;
    }
    public getMessage(response: any) {
      const fatalErrorList: any[] = [];
      const generalErrorList: any[] = [];
      if(response?.error?.status || response?.error?.httpStatus){
        if (response.error.status === 401 || response.error.httpStatus === "UNAUTHORIZED") {
          this.cookie.deleteAll();
          this.route.navigateByUrl("/auth/signin");
        }
      }
      if (!response?.error?.message) {
        if (
          response.error.status === 401 ||        response.error.httpStatus === "UNAUTHORIZED" ||        response.error.status === 403 || response.status === 401      ) {
          const errorMessage = response?.error?.error;
          this.toastr.error(errorMessage);
          if (response.error.status === 401 || response.error.httpStatus === "UNAUTHORIZED") {
            this.cookie.deleteAll();
            this.route.navigateByUrl("/auth/signin");
          }
          return;
        }
      }
      this.displayError(response, generalErrorList, fatalErrorList);
    }
    private displayError(
      response: any,
      generalErrorList: any[],
      fatalErrorList: any[]
    ) {
      let result;
      try {
        result = JSON.parse(response.error.message);
      } catch (e) {
        generalErrorList.push({ errorMessage: "Unknown error! Please contact your administrator." });
        this.getErrorMessage({
          fatalErrorList: fatalErrorList,
          generalErrorList: generalErrorList,
        });
      }
      if (result?.errorIds != null && result.errorIds != "") {
        for (let i = 0; i < result.errorIds.length; i++) {
          if (result.errorIds[i].severity == "FATAL") {
            fatalErrorList.push(result.errorIds[i]);
          } else {
            generalErrorList.push(result.errorIds[i]);
          }
        }
        this.getErrorMessage({
          fatalErrorList: fatalErrorList,
          generalErrorList: generalErrorList,
        });
      }
    }
    // Not used now, will be used in future 
     public showErrorMessage(errorMsg: any, refDivId: any) {
      // remove first if any previous error message displayed  
         this.removeErrorMessage();
      // setting default error message. eg. - something went wrong & Message Property    
      const errorMsgDivId = this.DEFAULT_ERROR_DIV_ID;
      const errorMsgDivClass = this.DANGER;
      if (errorMsg == undefined || errorMsg == null) {
        errorMsg = this.DEFAULT_ERROR_MSG;
      }
      if (refDivId == undefined || document.getElementById(refDivId) == null) {
        refDivId = this.DEFAULT_REF_DIV_ID;
      }
      const errorMsgElement = document.createElement("div");
      errorMsgElement.innerHTML =      ' <i class="fa fa-times" style="margin:5px;" onclick="document.getElementById(' +      errorMsgDivId +      '.id).remove();"></i><span><b>' +      errorMsg +      "</b></span>";
      errorMsgElement.setAttribute("class", errorMsgDivClass);
      errorMsgElement.setAttribute("id", errorMsgDivId);
      const refElement = document.getElementById(refDivId);
      return;
    }
    unsubscribe() {
      for (let index = 0; index < this.subscriptions.length; index++) {
        let subscription = this.subscriptions[index];
        if (subscription) {
          subscription.unsubscribe();
          this.subscriptions.splice(index, 1);
        }
      }
    }
    public removeErrorMessage() {
      const errorMsgDivId = this.DEFAULT_ERROR_DIV_ID;
      if (
        errorMsgDivId != undefined &&      document.getElementById(errorMsgDivId) != null    ) {
        document.getElementById(errorMsgDivId)!.remove();
      }
      return this.DEFAULT_REF_DIV_ID;
    }
    private getErrorMessage = (errorList: any) => {
      let errorMessage = this.DEFAULT_ERROR_MSG;
      if (errorList?.generalErrorList) {
        if (
          errorList.generalErrorList[0] != undefined &&        errorList.generalErrorList[0].errorMessage != undefined      ) {
          errorMessage = errorList.generalErrorList[0].errorMessage;
          if (
            errorList.generalErrorList[0].hints != undefined &&          errorList.generalErrorList[0].hints.length > 0        ) {
            for (let i = 0; i < errorList.generalErrorList[0].hints.length; i++) {
              errorMessage =              errorMessage +              ". " +              errorList.generalErrorList[0].hints[i].hintKey +              " " +              errorList.generalErrorList[0].hints[i].hintValue;
            }
          }
        } else if (
          errorList.fatalErrorList[0] != undefined &&        errorList.fatalErrorList[0].errorMessage != undefined      ) {
          errorMessage = errorList.fatalErrorList[0].errorMessage;
        }
      }
      if (errorMessage && errorMessage != "") {
        this.toastr.error(errorMessage, "", {
          timeOut: 2000,
        });
      }
    };
  }
