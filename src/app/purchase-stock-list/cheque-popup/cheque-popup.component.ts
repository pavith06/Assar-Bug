
import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { PurchaseStockPopupComponent } from '../purchase-stock-popup/purchase-stock-popup.component';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cheque-popup',
  templateUrl: './cheque-popup.component.html',
  styleUrls: ['./cheque-popup.component.scss']
})
export class ChequePopupComponent implements OnInit{
  img:string;
  fileType:string;
  name:string;
  constructor(  public dialogRef: MatDialogRef<ChequePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private _formBuilder: FormBuilder,
    public sanitizer: DomSanitizer)
  {
this.img=this.data.image;
this.fileType=this.data.fileType;
this.name=this.data.name;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
}
export interface DialogData {

  image: string;
  fileType:string;
  name:string
}
