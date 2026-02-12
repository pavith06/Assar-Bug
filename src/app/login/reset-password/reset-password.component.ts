import { OnInit } from '@angular/core';
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResetPasswordRequest } from './../../models/reset-password-request';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Validation from 'src/app/service/Validation';
import { JsonService } from 'src/app/service/json.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  passwordRegex = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;
  englishJson: any;
  isSubstring=false;

  constructor(private fb: FormBuilder, private toaster: ToastrService,
    private router: Router, private route: ActivatedRoute, private service: AuthService,private json:JsonService) { 

      this.json.getEnglishJson().subscribe((response)=>{
        if(response){
          this.englishJson=response;
        }
      })
    }

  submitted = false;
  ResetPassword: FormGroup;
  showPassword = false;
  userIdentity: string = localStorage.getItem('identity');
  userName: string = sessionStorage.getItem('username');

  ngOnInit() {
    this.ResetPassword = this.fb.group({
      identity: new FormControl(this.userIdentity),
      newPassword: new FormControl("", [Validators.required, this.noSpaceAllowed, Validators.pattern(this.passwordRegex)]),
      confirmPassword: new FormControl("", [Validators.required]),
    },

      {
        validators: [Validation.match('newPassword', 'confirmPassword')]
      }
    )
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ResetPassword.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  checkPassword(event){
    const username = sessionStorage.getItem('username');
    if (event.includes(username)) {
      this.isSubstring = true;
    }else{
      this.isSubstring = false;
    }
  }

  resetPassword() {

    this.submitted = true;
    if (this.ResetPassword.invalid) {
      return;
    }
    const resetPasswordRequest = new ResetPasswordRequest();
    resetPasswordRequest.identity = this.userIdentity;
    resetPasswordRequest.newPassword = this.ResetPassword.value.newPassword;
    resetPasswordRequest.confirmPassword = this.ResetPassword.value.confirmPassword;
    if (this.ResetPassword.valid) {
      this.service.resetFirstTimePassword(resetPasswordRequest).subscribe(
        (response) => {
          if (response) {
            this.toaster.success('Reset password successfully', 'Done');
            setTimeout(() => {
              this.router.navigate(['']);
            }, 500);
          }
        });

    }
  }

  noSpaceAllowed(control: FormControl) {
    if (control.value != null && control.value.indexOf(' ') != -1) {
      return { noSpaceAllowed: true }
    }
    return null;
  }





  goToLogin() {
    this.router.navigateByUrl('')
  }

}
