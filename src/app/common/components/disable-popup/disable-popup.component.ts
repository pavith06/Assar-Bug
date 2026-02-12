import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-disable-popup',
  templateUrl: './disable-popup.component.html',
  styleUrls: ['./disable-popup.component.scss']
})
export class DisablePopupInUserComponent {
  todayDate = new (Date);
  expiryDate:any;
  constructor(public dialogRef: MatDialogRef<DisablePopupInUserComponent>,private toaster:ToastrService){

  }

  cancel(){
    this.dialogRef.close(false);
  }

  summited(){
    if(this.expiryDate !== undefined && this.expiryDate !== null){
    this.dialogRef.close(this.expiryDate);
  }else{
    this.toaster.error('Select Exceed Date');
  }
}



}
