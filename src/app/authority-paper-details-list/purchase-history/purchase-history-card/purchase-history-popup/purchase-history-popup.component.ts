import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MaxInt } from 'src/app/common/enum/enum';
import { AuthorityPaperDetailsDto } from 'src/app/models/authority-paper-details-dto/authority-paper-details-dto';
import { AllocateStockVo } from 'src/app/models/field-group-dto';
import { PurchaseHistoryDto } from 'src/app/models/purchase-stock-dto/purchase-history-dto';
import { ReportLossService } from 'src/app/service/report-loss.service';

@Component({
  selector: 'app-purchase-history-popup',
  templateUrl: './purchase-history-popup.component.html',
  styleUrls: ['./purchase-history-popup.component.scss']
})
export class PurchaseHistoryPopupComponent implements OnInit {

  allocationStockVo= new AllocateStockVo();
  constructor(public dialogRef: MatDialogRef<PurchaseHistoryPopupComponent>,
     @Inject(MAT_DIALOG_DATA) public data: DialogData,private dataservice: ReportLossService
     ,private tosterservice:ToastrService, private translate: TranslateService) {
      dialogRef.disableClose = true;
      this.PurchasehistoryDetails.companyId=this.data.PurchasehistoryData.companyId;
    this.PurchasehistoryDetails.comapanyName=this.data.PurchasehistoryData.comapanyName;
    this.PurchasehistoryDetails.notification=this.data.PurchasehistoryData.notification;
    this.dataservice.getStockCount(this.PurchasehistoryDetails.companyId).subscribe((value)=> {
      this.authorityPaperDetailsDto.stockCount=value.totalCount;
      this.authorityPaperDetailsDto.availableStock=value.availableCount;
    })

  }

  reactiveForm = new FormGroup({
    numberOfPapers: new FormControl('', [Validators.required]),
    allocatePaperMethod: new FormControl('', [Validators.required]),
  })

  authorityPaperDetailsDto = new AuthorityPaperDetailsDto;
  PurchasehistoryDetails = new PurchaseHistoryDto;
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  closeDialog() {
    this.dialogRef.close("Sandwich!");
  }
  BonusOrPaid: any[] = [{
    name: 'Bonus', check: false
  }, { name: 'Paid', check: false }]
  NumberOfPaper: number[] = [500, 1000, 2000];
  Papers;
  Amount: string;

  Numberofpaper(event: any) {
    this.Papers = event.target.innerText;     //use is code in backend
    this.reactiveForm.get("numberOfPapers").setValue(event.target.innerText);
  }
  Bonusorpaid(event: any) {
    this.Amount = event               //use is code in backend
    if (event === 'Bonus') {
      this.BonusOrPaid[0].check = true;
      this.BonusOrPaid[1].check = false;

    }
    else if (event === 'Paid') {
      this.BonusOrPaid[0].check = false;
      this.BonusOrPaid[1].check = true;
    }
    this.reactiveForm.get("allocatePaperMethod").setValue(event);
  }

  allocate(){
    if(this.reactiveForm.valid){
    let numberOfPaperCount = this.reactiveForm.controls['numberOfPapers'].value;
    this.allocationStockVo.numberOfPaper = parseInt(numberOfPaperCount);

    if(this.allocationStockVo.numberOfPaper> MaxInt.INT){
      this.Papers=null;
      this.tosterservice.error(this.translate.instant('Toaster_error.exceed_allocation_limit'));
      return
    }

    if(this.allocationStockVo.numberOfPaper === 0 || this.allocationStockVo.numberOfPaper < 100){
      this.Papers=null;
      this.tosterservice.error(this.translate.instant('Toaster_error.minimum_allocation_limit'))
      return
    }

    this.allocationStockVo.allocatepaperType = this.reactiveForm.controls['allocatePaperMethod'].value;
    this.allocationStockVo.companyId = this.data.PurchasehistoryData.companyId;

    this.dataservice.allocateStockSave(this.allocationStockVo).subscribe((response:any)=>{
      this.tosterservice.success(this.translate.instant('Toaster_success.allocate_success'))
      this.closeDialog();
    });
  }else{
    this.tosterservice.error(this.translate.instant('Toaster_error.mandatory_fields'));
   }
  }

  matcher(event) {
    const allowedRegex = /[0-9]/g;
    if (!event.key.match(allowedRegex)) {
      event.preventDefault();
    }
  }

}
export class DialogData {
  PurchasehistoryData = new PurchaseHistoryDto;
}
