import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DisablePopupComponent } from 'ncloud-common-ui';
import { DisablePopupInUserComponent } from '../disable-popup/disable-popup.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<PopupComponent>,private dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Data) {

     }
     ngOnInit(): void {
         console.log();
     }

  cancel(value:boolean){
    this.data.clickOk = value;
  this.dialogRef.close(false);
  }
  submit(value:boolean){
    // this.data.clickOk = value;
    this.deleteRoleInCard();
  }

  deleteRoleInCard(){
    const dialogRef = this.dialog.open(DisablePopupInUserComponent, {
      width: '388px',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(result);
          }else{
            this.dialogRef.close(false);
          }
       });
    }
}
export interface Data{
  okButton:string;
  cancelButton:string;
  message:string
  clickOk:boolean;

}
