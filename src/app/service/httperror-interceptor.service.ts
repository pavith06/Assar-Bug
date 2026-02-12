/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorCode, ErrorCodeToIgnore, ErrorHints } from './../common/enum/enum';
import { ConstantService } from './constants.service';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { throwError, Observable, of } from 'rxjs';
import { catchError, concatMap, retryWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptorService implements HttpInterceptor {

  constructor(private toaster:ToastrService,private translate:TranslateService){}

  //checking if there is error for every http request
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request)
        .pipe(
            retryWhen(error => this.retryRequest(error,1)),
            catchError((error: HttpErrorResponse) => {
                const errorMessage = this.setError(error);
                return throwError(errorMessage);
            })
        );
}



  // Retry the request in case of errror
  retryRequest(error: Observable<unknown>, retryCount: number): Observable<unknown>
  {
      return error.pipe(
          concatMap((checkErr: HttpErrorResponse, count: number) => {

              if(count <= retryCount)
              {
                  switch(checkErr.status)
                  {
                  case ErrorCode.serverDown :
                      return of(checkErr);

                  // case ErrorCode.unauthenticated :
                  //     return of(checkErr);

                  }
              }
              return throwError(checkErr);
          })
      );
  }


  //setting error
  setError(error: HttpErrorResponse): string {
      let errorMessage = this.translate.instant('Error Data.'+ConstantService.unknownError);
      if(error.error instanceof ErrorEvent) {
          // Client side error
          errorMessage = error.error.message;
      } else {
          // server side error
          if(error.status=== ErrorCode.unauthorised)
          {
            const errorIdList = JSON.parse(error.error.message);
            const errorMessage = errorIdList.errorIds[0].errorMessage;
            this.toaster.error(this.translate.instant('Error Data.servererror'));
              return error.statusText
          }
          // if(error.status=== 400)
          // {
          //   const errorIdList = JSON.parse(error.error.message);
          //   const errorMessage = this.getTranslatedErrorMessages(errorIdList.errorIds[0].errorCode,errorIdList.errorIds[0].hints);
          //   if(errorIdList.errorIds[0].errorCode !== (ErrorCodeToIgnore.companyLogoError && ErrorCodeToIgnore.dashboardDataError && ErrorCodeToIgnore.noCompanySelectedError) ){
          //     this.toaster.error(errorMessage);
          //   }
            
          //     return error.statusText;
          // }
          if (error.status === 400) {
  console.log('HTTP 400 ERROR RAW:', error);

  const errorIdList = JSON.parse(error.error.message);
  const apiError = errorIdList.errorIds[0];

  console.log('PARSED ERROR LIST:', errorIdList);
  console.log('API ERROR OBJECT:', apiError);
  console.log('BACKEND MESSAGE:', apiError.errorMessage);
  console.log('ERROR CODE:', apiError.errorCode);
  console.log('HINTS:', apiError.hints);

  // ✅ Use backend message
  if (apiError.errorMessage) {
    console.log('SHOWING BACKEND MESSAGE');
    this.toaster.error(apiError.errorMessage);
    return error.statusText;
  }

  // 🔁 Translation fallback
  console.log('USING TRANSLATION FALLBACK');
  const translatedMsg = this.getTranslatedErrorMessages(
    apiError.errorCode,
    apiError.hints
  );

  this.toaster.error(translatedMsg);
  return error.statusText;
}


          if (error.error.message && error.status!==ErrorCode.serverDown) {
              {const errorIdList = JSON.parse(error.error.message);
                errorMessage = errorIdList.errorIds[0].errorMessage;}
                this.toaster.error(errorMessage);
                return error.statusText
          }

          if (!error.error.message && error.error && error.status!==ErrorCode.serverDown) {
              const errorIdList = JSON.parse(error.error.message)
              errorMessage = errorIdList.errorIds[0].errorMessage;}
          }

      this.toaster.error(errorMessage);
      return errorMessage;
  }
  getTranslatedErrorMessages(errorCode: string, hints: any[]) : string{
    let errorMsg:string=this.translate.instant('Error Data.'+errorCode);
    if(hints!=undefined && hints!=null){
      hints.forEach((hint)=>{
        let value=hint.hintValue
        if(hint.hintKey===ErrorHints.fieldName || hint.hintKey===ErrorHints.aliasName || hint.hintKey===ErrorHints.fieldFormat){
          value=this.translate.instant('GENERATE_PAPER_MANUAL.'+value);
        }
        if(hint.hintKey===ErrorHints.pool){
          value=this.translate.instant('pool_names.'+value);
        }
        errorMsg=errorMsg.replace(hint.hintKey,value);
      });
    }
    return errorMsg;
  }
}
