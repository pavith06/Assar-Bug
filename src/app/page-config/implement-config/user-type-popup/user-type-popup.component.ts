import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ImplementConfigServiceService } from 'src/app/implement-config-service.service';

@Component({
  selector: 'app-user-type-popup',
  templateUrl: './user-type-popup.component.html',
  styleUrls: ['./user-type-popup.component.scss']
})
export class UserTypePopupComponent {

  userTypeName="";
  insuredUser: string[];

  constructor(public dialogRef: MatDialogRef<UserTypePopupComponent>,
    private service:ImplementConfigServiceService,
    private toastr: ToastrService,
    private translate: TranslateService,
     @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      
      this.insuredUser = data.insuredUserType;
    dialogRef.disableClose = true;
  }

  setInsertValue(event){
    const name = event.target.value;
    if(name !== null && name !== undefined && name !== ""){
      const dub = this.insuredUser.find(data => data.toLowerCase() === name.toLowerCase());
      if(dub !== null && dub !== undefined && dub !== ''){
        this.toastr.error(this.translate.instant('Toaster_error.exist_user_type'));
      }else{
        this.userTypeName = name;
      }
    }
   
  }
  addNewUserType(){
    if(this.userTypeName !== null && this.userTypeName !==""){
      this.service.addUserType(this.userTypeName).subscribe((data:any)=>{
        if (data.content) {  
          this.toastr.success(this.translate.instant('Toaster_error.exist_user_type'));
        }
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close(true);
  }
}


export class DialogData {
  insuredUserType: string[];
}
