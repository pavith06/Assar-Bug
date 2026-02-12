import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-changed-popup',
  templateUrl: './password-changed-popup.component.html',
  styleUrls: ['./password-changed-popup.component.scss']
})
export class PasswordChangedPopupComponent {
  constructor(public dialogRef: MatDialogRef<PasswordChangedPopupComponent>, private router:Router){
    dialogRef.disableClose = true;
  }
  closeDialog(value:boolean) {
    this.dialogRef.close(value);

  }
}
