import { Component ,Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaperDetailsListDto } from 'src/app/models/paper-details-dto/paper-details-list-dto';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { ViewPaperDetailsPopupComponent } from '../view-paper-details-popup/view-paper-details-popup.component';

@Component({
  selector: 'app-revoke-digital-paper-popup',
  templateUrl: './revoke-digital-paper-popup.component.html',
  styleUrls: ['./revoke-digital-paper-popup.component.scss']
})
export class RevokeDigitalPaperPopupComponent implements OnInit {
  policyNo:string;
  identity:string;
  response:string;
  paperDetailsDto: PaperDetailsListDto[];
 selectedReason: string = '';
reasons = [
  { id: 1, value: 'Invalid Vehicle Details', label: 'Invalid Vehicle Details' },
  { id: 2, value: 'Wrong Period of Cover', label: 'Wrong Period of Cover' },
  { id: 3, value: 'Suspension', label: 'Suspension' },
  { id: 4, value: 'Cancellation', label: 'Cancellation' }
];
 
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<RevokeDigitalPaperPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData,public authorityPaperService : AuthorityPaperService )
  {
    dialogRef.disableClose = true;
    this.policyNo=data.policyNumber;
    this.identity=data.identity;
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  closeDialog() {
    this.dialogRef.close('Pizza!');
    this.authorityPaperService.setAddNew(true);
  }
  revoke=true;
  paper_revoked=false;

  // paperRevoked() {
  //   this.authorityPaperService.updateRevokeStatusData(this.identity).subscribe((val: any) => {
  //     this.response = val;
  //     if (this.response) {
  //       this.paper_revoked = true;
  //       this.revoke = false;
  //     }
  //   })

  // }

  validationMessage: string = '';

// paperRevoked() {
//   // Check if user selected a revoke reason
//   if (!this.selectedReason) {
//     this.validationMessage = "Please select a revoke reason.";
//     return;
//   }

//   this.validationMessage = ""; // clear message if valid

//   // Do normal revoke flow (no API reason update)
//   this.authorityPaperService.updateRevokeStatusData(this.identity).subscribe((val: any) => {
//     this.response = val;
//     if (this.response) {
//       this.paper_revoked = true;
//       this.revoke = false;
//     }
//   });
// }
paperRevoked() {
  if (!this.selectedReason) {
    this.validationMessage = "Please select a revoke reason.";
    return;
  }

  this.validationMessage = "";

  this.authorityPaperService.updateRevokeStatusData(this.identity, Number(this.selectedReason))
    .subscribe((val: any) => {
      this.response = val;
      if (this.response) {
        this.paper_revoked = true;
        this.revoke = false;
      }
    });
}


  viewPaper() {
    this.authorityPaperService.getPaperDetailsData(this.identity).subscribe((value: any) => {
      this.paperDetailsDto = value;

      const dialogRef = this.dialog.open(ViewPaperDetailsPopupComponent, {
        width: '1150px',
        // height: '530px',
        data: {
          revokeData: this.paperDetailsDto
        }

      });

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    })

  }

}

export class DialogData {

  policyNumber:any
  identity:string;


}

