import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-status-popup',
  templateUrl: './payment-status-popup.component.html',
  styleUrls: ['./payment-status-popup.component.scss']
})
export class PaymentStatusPopupComponent {
  constructor(public dialogRef: MatDialogRef<PaymentStatusPopupComponent>)
  {
    dialogRef.disableClose = true;
  }
  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
}
