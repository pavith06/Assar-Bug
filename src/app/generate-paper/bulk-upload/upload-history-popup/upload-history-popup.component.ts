import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogData } from 'src/app/paper-details-list/view-paper-details-popup/view-paper-details-popup.component';
import { BulkUploadService } from 'src/app/service/bulk-upload.service';

@Component({
  selector: 'app-upload-history-popup',
  templateUrl: './upload-history-popup.component.html',
  styleUrls: ['./upload-history-popup.component.scss']
})
export class UploadHistoryPopupComponent implements OnInit {
bulkUploadDataList:any;
constructor(public dialogRef: MatDialogRef<UploadHistoryPopupComponent>,
  private service:BulkUploadService,
  private router: Router,
  @Inject(MAT_DIALOG_DATA) public data: HistoryDialogData)
{
  dialogRef.disableClose = true;
}
  ngOnInit(): void {
    if (this.data.historyType === 'bulk-upload') {
      this.getuploadHistroyData(true);
    }else{
      this.getuploadHistroyData(false);
    }
  }
  getuploadHistroyData(isBulkUpload:boolean) {
   this.service.getBulkImportHistroryData(isBulkUpload).subscribe((data)=>{
    if(data){
      this.bulkUploadDataList = data.content;
    }
   })
  }

  openUploadFile(data:any){
    const uploadId = data.uploadId;
    const uploadType = data.actionType===1?btoa('UPLOAD'):btoa('REVOKE');
    const actionType = data.uploadType===1?btoa('NORMAL'):btoa('FLEET');
    if (actionType==='UPLOAD') {
      this.router.navigate(['generate-paper/total_records/bulk-upload/'+ uploadId+'/'+ uploadType + '/' + actionType ]);
    }else{
      this.router.navigate(['generate-paper/total_records/bulk-revoke/'+ uploadId+'/'+ uploadType + '/' + actionType ]);
    }
    this.dialogRef.close('close!');
  }
closeDialog() {
  this.dialogRef.close('close!');
}

}
export class HistoryDialogData{
  historyType:string;
}
