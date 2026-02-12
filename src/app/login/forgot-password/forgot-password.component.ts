import { AuthService } from 'src/app/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  submitted = false;

  // emailRegex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+[@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)]*$/;

  constructor(private fb: FormBuilder,private toaster:ToastrService,
    private router:Router,private route: ActivatedRoute,private service:AuthService){}

    ForgotPassword:FormGroup;

    ngOnInit(){

      this.ForgotPassword = this.fb.group({
        emailId: new FormControl("", [Validators.required])
      }
      )
    }



  forgotPassword(){
    this.submitted = true;
    if (this.ForgotPassword.invalid) {
      return;
    }
      this.service.sendMailToResetPassword(this.ForgotPassword.value.emailId).subscribe(
        response => {
          this.toaster.success( 'Send to email','Reset link');
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
