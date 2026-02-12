import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PasswordChangedPopupComponent } from './password-changed-popup/password-changed-popup.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Validation from 'src/app/service/Validation';
import { ProfileService } from 'src/app/service/profile.service';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordDto } from 'src/app/models/profile-dto/change-password-dto';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.scss']
})

export class ChangePasswordPopupComponent implements OnInit {

  changePassword:FormGroup;
  passwordRegex = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;

  constructor(public dialogRef: MatDialogRef<ChangePasswordPopupComponent>,public dialog: MatDialog, private fb: FormBuilder,private userProfileService:ProfileService,private toaster:ToastrService
    , private translate : TranslateService){
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    this.changePassword = this.fb.group({
      oldPassword:new FormControl("",[Validators.required]),
      newPassword:new FormControl("",[Validators.required,this.noSpaceAllowed,Validators.pattern(this.passwordRegex)]),
      confirmPassword: new FormControl("", [Validators.required]),
    },

      {
        validators: [Validation.match('newPassword', 'confirmPassword')]
      }
    );
  }

  noSpaceAllowed(control:FormControl){
    if (control.value!= null && control.value.indexOf(' ')!= -1) {
      return {noSpaceAllowed:true}
    }
    return null;
  }

  closeDialog(value:boolean) {
    this.dialogRef.close(value);
  }
  showPasswordOld = false;
  togglePasswordVisibilityOld() {
     this.showPasswordOld = !this.showPasswordOld;
  }
  showPasswordNew = false;
  togglePasswordVisibilityNew() {
     this.showPasswordNew = !this.showPasswordNew;
  }
  showPasswordConfirm = false;
  togglePasswordVisibilityConfirm() {
     this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  openDialog(): void {
    this.closeDialog(false);
    const no_of_paper = null;
    const paymentMethod = null;
    const dialogRef = this.dialog.open(PasswordChangedPopupComponent, {
      width: '550px',
      height: '300px', data: {
        // noOfPaper: no_of_paper,
        // Payment_Method: paymentMethod

      },

    });

    dialogRef.afterClosed().subscribe();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.changePassword.controls;
  }

  changePwd(){
    if(this.changePassword.valid){
      const passwordDto=new ChangePasswordDto();
      passwordDto.oldPassword = this.changePassword.value.oldPassword;
      passwordDto.newPassword = this.changePassword.value.newPassword;
      passwordDto.confirmPassword=this.changePassword.value.confirmPassword;

        this.userProfileService.changePassword(passwordDto).subscribe(data=>{
          this.toaster.success(this.translate.instant('Toaster_success.profile_update'));
            this.openDialog();
        });

    }
  }
}
