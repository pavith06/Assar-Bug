/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordRequest } from 'src/app/models/reset-password-request';
import { ToastrService } from 'ngx-toastr';
import Validation from 'src/app/service/Validation';
@Component({
  selector: 'app-common-reset-password',
  templateUrl: './common-reset-password.component.html',
  styleUrls: ['./common-reset-password.component.scss']
})
export class CommonResetPasswordComponent implements OnInit{

  passwordRegex = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;

  showPassword = false;
  showPasswords=false;
  userIdentity:string ;
  userName:string;
  decodeUserIdentity:string;
  decodeUserName:string;

  submitted = false;



  CommonResetPassword: FormGroup;

  constructor(private fb: FormBuilder,private toaster:ToastrService,
    private router:Router,private route: ActivatedRoute,private service:AuthService){}

    ngOnInit(){
    this.userName = this.route.snapshot.paramMap.get('userName');
    this.userIdentity = this.route.snapshot.paramMap.get('userIdentity');
    this.decodeUserName = atob(this.userName);
    this.userName = this.decodeUserName;

    this.CommonResetPassword = this.fb.group({
      identity: new FormControl(this.userIdentity),
      newPassword: new FormControl("", [Validators.required,this.noSpaceAllowed,Validators.pattern(this.passwordRegex)]),
      confirmPassword: new FormControl("", [Validators.required]),
    },

      {
        validators: [Validation.match('newPassword', 'confirmPassword')]
      }
    )
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibilitys()
  {
    this.showPasswords = !this.showPasswords;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.CommonResetPassword.controls;
  }


  noSpaceAllowed(control:FormControl){
    if (control.value!= null && control.value.indexOf(' ')!= -1) {
      return {noSpaceAllowed:true}
    }
    return null;
}

  CommonForgetPassword(){
    this.submitted = true;
    if (this.CommonResetPassword.invalid) {
      return;
    }
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.identity = this.userIdentity;
    resetPasswordRequest.newPassword = this.CommonResetPassword.value.newPassword;
    resetPasswordRequest.confirmPassword = this.CommonResetPassword.value.confirmPassword;
    this.service.commonResetPassword(resetPasswordRequest).subscribe(
      response => {
        this.toaster.success('Reset password successfull', 'Done');
          setTimeout(() => {
            this.router.navigate(['']);
        }, 500);
      }
    );
  }





  goToLogin(){
    this.router.navigateByUrl('')
  }

}
