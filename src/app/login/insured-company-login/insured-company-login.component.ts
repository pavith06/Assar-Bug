import { AppService } from './../../service/role access/service/app.service';
import { ToastrService } from 'ngx-toastr';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpireTime } from 'src/app/common/enum/enum';
import { AuthService } from 'src/app/service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { appConst } from 'src/app/service/app.const';
import { PlatformDetailsDto } from 'src/app/models/platform-details-dto';

@Component({
  selector: 'app-insured-company-login',
  templateUrl: './insured-company-login.component.html',
  styleUrls: ['./insured-company-login.component.scss']
})

export class InsuredCompanyLoginComponent implements OnInit{

  responsedata: any;

  show:boolean=false;
  platformDetails: PlatformDetailsDto[];
  field: PlatformDetailsDto;


  constructor(private service:AuthService,private router:Router,private tosterservice:ToastrService,public translate: TranslateService,private appService:AppService){
    sessionStorage.removeItem('userTypeId');
    sessionStorage.removeItem('associationId');
    sessionStorage.removeItem('userIdentity');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('platformDetails');
    sessionStorage.removeItem('menuname');
    sessionStorage.removeItem('userTypeId');

    localStorage.removeItem('identity');
    localStorage.removeItem('platformDetails');

    translate.addLangs(['English','French']);
    translate.setDefaultLang('English');
  }
  ngOnInit(): void {
    this.service.getPlatformDetails().subscribe((data)=>{
      this.platformDetails=data;
    })
  }

    imageList=[
    {
      aliasName:"RECOVERY_EZ",
      image:"assets/portal1.svg",
      title:"Recovery EZ"
    },
    {
      aliasName:"DIGITAL_PAPER",
      image:"assets/icons/authority_details.svg",
      title:"Digital Paper"
    }
  ]

  getUrl(title:string){
    let image=''
    const data = this.imageList.find((element)=> element.aliasName===title);
    image=data?.image;
    return image;
  }
  title = 'INSURANCE LOGIN'

  Login = new FormGroup({
    username: new FormControl("", [Validators.required,this.noSpaceAllowed]),
    password: new FormControl("", [Validators.required,this.noSpaceAllowed])
  });

  noSpaceAllowed(control:FormControl){
    if (control.value!= null && control.value.indexOf(' ')!= -1) {
      return {noSpaceAllowed:true}
    }
    return null;
}

loginEna(){
  this.show= false;
}

  ProceedLogin() {
    this.show=true;
    if(this.Login.valid){
      this.service.ProceedLogin(this.Login.value.username,this.Login.value.password,false).subscribe((result)=>{
        if (result) {
          this.responsedata = result;
          this.service.loginResponse = result;
          sessionStorage.setItem('token',this.responsedata.accessToken);
          sessionStorage.setItem('userIdentity',this.responsedata.identity);
          localStorage.setItem('identity',this.responsedata.identity);
          sessionStorage.setItem('username',this.responsedata.username);
          sessionStorage.setItem('companyName',this.responsedata.companyName);
          sessionStorage.setItem('companyId',this.responsedata.companyId);
          this.service.autoLogout(ExpireTime.expirationTime);
          if(this.responsedata.firstTimeLogin==true){
              this.router.navigate(['login/reset-password']);
          }else if(this.responsedata.userTypeId.userTypeId === 2){
            this.getMenuRoleData();
          }else{
            this.router.navigate(['']);
            this.tosterservice.error('Invalid User')
          }
        }
      })
    }


  }

  getMenuRoleData(){
    this.appService.getMenubyRole().subscribe((response)=>{
      if (response) {
        let menuName = '';
        if (response['content'] && response['content'].length !== 0) {
          menuName = response['content'][0].menuName
        }
        this.router.navigate([this.getUrlToNavigate(menuName)]);
        //after login it will redirect to given url
        this.tosterservice.success(
          'Login successfull',
          '',
          {
        timeOut:1600},
        );
          // this.tosterservice.success( 'Login successfully');
          setTimeout(() => {
        }, 500);
      }
    })
  }

  getUrlToNavigate(menuName:string){
    switch (menuName) {
      case appConst.MENU_CONSTANTS.MENUNAME.DASHBOARD.NAME:
        return appConst.MENU_CONSTANTS.MENUNAME.DASHBOARD.URL;

        case appConst.MENU_CONSTANTS.MENUNAME.PURCHASESTOCK.NAME:
        return appConst.MENU_CONSTANTS.MENUNAME.PURCHASESTOCK.URL;

        case appConst.MENU_CONSTANTS.MENUNAME.PAPERDETAILS.NAME:
        return appConst.MENU_CONSTANTS.MENUNAME.PAPERDETAILS.URL;

        case appConst.MENU_CONSTANTS.MENUNAME.REPORTS.NAME:
        return appConst.MENU_CONSTANTS.MENUNAME.REPORTS.URL;

        case appConst.MENU_CONSTANTS.MENUNAME.USERMANAGEMENT.NAME:
        return appConst.MENU_CONSTANTS.MENUNAME.USERMANAGEMENT.URL;

        default:
        return 'page-not-found'

    }
  }


  openForgotPassword(){
    this.router.navigateByUrl('login/forgot-password');
  }

  giveAuthority(){
    this.router.navigateByUrl('login/authority');
  }


   showPassword=false;
   togglePasswordVisibility()
    {
      this.showPassword = !this.showPassword;
    }

    passPlatformDetails(details:PlatformDetailsDto){
      this.field=details;
      const arr = JSON.stringify(details);
      localStorage.setItem("platformDetails", arr);
    }
}
