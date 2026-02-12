/* eslint-disable @typescript-eslint/no-empty-function */
import { ResetPasswordRequest } from './../models/reset-password-request';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformDetailsDto } from '../models/platform-details-dto';
import { LoginDto } from '../models/login-dto';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginResponse: any;
  englishJson: any;

  constructor(private http: HttpClient, private router: Router, private toster:ToastrService) { 

  }

  apiurl = environment.AUTH_URL + '/auth-service/auth/signin'; // authentication url from backend
  // apiurl = 'http://10.10.12.43:8500/api/auth/signin'
  // const BASE_API_URL =  + this.apiurl

  resetFirstTimeUrl = environment.AUTH_URL + '/auth-service/auth/resetpassword';

  sendMailIdToResetPasswordUrl =
    environment.AUTH_URL + '/auth-service/auth/forgetPassword';

  // sendMailIdToResetPasswordUrl =
  //   environment.API_BASE_URL + '/api/auth/forgetPassword';

  commonResetPasswordUrl =
    environment.API_BASE_URL + '/auth-service/auth/updatepassword';

  platformUrl = environment.API_BASE_URL + '/api';

  // connecting backend and verifing user credentials
  ProceedLogin(username: string, password: string, isAuthority: boolean) {

    //error Toaster from english.json
    this.http.get('assets/i18n/English.json').subscribe((response)=>{
      this.englishJson=response;
    });


    const platformDetails= JSON.parse(localStorage.getItem("platformDetails"));
    // const platformDetails = {
    //   platformId: 2,
    //   platformName: 'DIGITAL_PAPER',
    //   platformIdentity: 'e31c7ccb51d047e7930b5cf5908ae9de',
    // };
    let userType;
    if (isAuthority === true) {
      userType = {
        userTypeId: 1,
        userTypeName: 'ASSOCIATION'
      }
    } else {
      userType = {
        userTypeId: 2,
        userTypeName: 'INSURANCE_COMPANY'
      }
    }

    const loginDto: LoginDto = {
      username: username,
      password: password,
      platformDetailsDto: platformDetails,
      userTypeDto: userType
    };
    if (platformDetails!=null) {
      return this.http.post(this.apiurl, loginDto);
    }else{
      this.toster.error(this.englishJson.Authentication_Errors.platform_invalid);
    }
  }

  //checking user is still loggedin or not
  IsLoggedIn() {
    let myCurrentToken = sessionStorage.getItem('token') != null;
    return myCurrentToken;
  }

  //checking jwt oken is still in session storage
  GetToken() {
    return sessionStorage.getItem('token');
  }

  //getting role details from payload of jwt token
  HaveAccess() {
    var logintoken = sessionStorage.getItem('token') || '';
    var _extractedtoken = logintoken.split('.')[1];
    var _atobdata = atob(_extractedtoken);
    var _finaldata = JSON.parse(_atobdata);
    if (_finaldata.role == 'admin') {
      return true;
    } else {
      alert('you not having access');
      return false;
    }
  }

  logout() {
    this.router.navigate(['']);
    sessionStorage.removeItem('token');
  }

  autoLogout(expirationTime: number) {
    setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  resetFirstTimePassword(request: ResetPasswordRequest) {
    return this.http.put(this.resetFirstTimeUrl, request);
  }

  commonResetPassword(request: ResetPasswordRequest) {
    return this.http.put(this.commonResetPasswordUrl, request);
  }

  sendMailToResetPassword(emailId: string) {
    return this.http.post(
      this.sendMailIdToResetPasswordUrl + '?emailId=' + emailId,
      {}
    );
  }

  // Buffer.from("hello",'id').toString('binary')

  // SGVsbG8gV29ybGQ=
  // Hello World

  getPlatformDetails() {
    return this.http.get<PlatformDetailsDto[]>(
      this.platformUrl + '/getPlatformDetails'
    );
  }

  isTokenExpired() {
    const logintoken = sessionStorage.getItem('token') || '';
    if (logintoken) {
    const _extractedtoken = logintoken.split('.')[1];
    const _atobdata = atob(_extractedtoken);
    const _finaldata = JSON.parse(_atobdata);

      const timestamp  = _finaldata.exp;
      const currentDate = new Date();
      const timestampDate = new Date(timestamp * 1000);

      if (currentDate > timestampDate) {
        return false;
      } else if (currentDate < timestampDate) {
        return true;
      }
    }else{
        return false;
      }
  }

}

export class UserTypeDto {
  userTypeId: number;
  userTypeName: string;
}
