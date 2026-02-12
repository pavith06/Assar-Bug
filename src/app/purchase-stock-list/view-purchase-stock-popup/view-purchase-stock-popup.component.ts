import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PaymentDetailsDto } from 'src/app/models/paymentdetails-dto';
import { PurchaseStockListDto } from 'src/app/models/purchase-stock-dto/purchase-stock-list-dto';
import { AdminService } from 'src/app/service/admin.service';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { PurchaseStockService } from 'src/app/service/purchase-stock.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-purchase-stock-popup',
  templateUrl: './view-purchase-stock-popup.component.html',
  styleUrls: ['./view-purchase-stock-popup.component.scss'],
})
export class ViewPurchaseStockPopupComponent implements OnInit{
  approve: boolean;
  reject: boolean;
  companyName: any;
  uploadFileNameList: FileDetails[] = [];
  fileList: any[] = [];
  purchaseStockDetails = new PurchaseStockListDto();
  uploadFileName: string | ArrayBuffer;
  fileObject: File;
  fileMappingId: any;
  isGetPurchaseStock:boolean;
  isAdmin: boolean=false;

  constructor(
    public dialogRef: MatDialogRef<ViewPurchaseStockPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fileService: FileUploadService,
    public authorityService: AuthorityPaperService,
    public toasterService: ToastrService,
    public purchaseService: PurchaseStockService,
    public sanitizer: DomSanitizer,
    public adminService:AdminService,
    private translate: TranslateService
  ) {
    this.isGetPurchaseStock =  this.data.isGetPurchaseStock;
    // dialogRef.disableClose = true;
    this.approve = this.data.approve;
    this.reject = this.data.reject;
   this.isAdmin= this.adminService.isAssociationUser();


    if(this.data.purchaseStockData != null && this.data.purchaseStockData.length != 0){
    this.purchaseStockDetails.purchaseId = this.data.purchaseStockData.purchaseId;
    this.purchaseStockDetails.paymentMethod = this.data.purchaseStockData.paymentMethod;
    this.purchaseStockDetails.paymentStatus = this.data.purchaseStockData.paymentStatus;
    this.purchaseStockDetails.purchaseAmount = this.data.purchaseStockData.purchaseAmount;
    this.purchaseStockDetails.purchaseDate = this.data.purchaseStockData.purchaseDate;
    this.purchaseStockDetails.stockCount =  this.data.purchaseStockData.stockCount;
    this.purchaseStockDetails.transactionId = this.data.purchaseStockData.transactionId;
    this.purchaseStockDetails.orderId = this.data.purchaseStockData.orderId;
    this.purchaseStockDetails.currencyType = this.data.purchaseStockData.currencyType;
    this.getUploadImage(this.purchaseStockDetails.orderId);
    if (this.data.purchaseStockData.companyName) {
      this.purchaseStockDetails.companyName =  this.data.purchaseStockData.companyName;
    } else {
      this.purchaseStockDetails.companyName =
        sessionStorage.getItem('companyName');
    }
  }

  }
  isSuccess: boolean;
  ngOnInit(): void {
    if(this.isGetPurchaseStock){
     this.getPurchaseOrderData(this.data.purchaseStockId);
    }

    // this.getImage(this.purchaseStockDetails.orderId.toString());
  }
  getPurchaseOrderData(purchaseStockId: number) {
    this.purchaseService.getPurchaseStockData(purchaseStockId).subscribe((data:any)=>{
      const purchaseStockData = data.content;
      this.purchaseStockDetails.purchaseId  =purchaseStockData.purchaseId;
      this.purchaseStockDetails.paymentMethod =purchaseStockData.paymentMethod;
      this.purchaseStockDetails.paymentStatus = purchaseStockData.paymentStatus;
      this.purchaseStockDetails.purchaseAmount =purchaseStockData.purchaseAmount;
      this.purchaseStockDetails.purchaseDate = purchaseStockData.purchaseDate;
      this.purchaseStockDetails.stockCount = purchaseStockData.stockCount;
      this.purchaseStockDetails.transactionId = purchaseStockData.transactionId;
      this.purchaseStockDetails.orderId = purchaseStockData.orderId;
      const companyId = sessionStorage.getItem("companyName");
      this.purchaseStockDetails.companyName = companyId
      this.getUploadImage( this.purchaseStockDetails.orderId);
    })
  }

  getUploadImage(orderId){
    this.purchaseService.getPurchaseStockFile(this.purchaseStockDetails.orderId).subscribe((value) => {
      this.fileMappingId = value;
      if (this.fileMappingId) {
        this.getUploadFile(this.fileMappingId);
      }
      if (this.purchaseStockDetails.paymentStatus === 'SUCCESS') {
        this.isSuccess = false;
      } else if(this.purchaseStockDetails.paymentStatus === 'FAILED') {
        this.isSuccess = false;
      } else if(this.purchaseStockDetails.paymentStatus === 'REJECTED') {
        this.isSuccess = false;
      }else {
        this.isSuccess = true;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
  show = false;
  noData = true;
  fileType = '.png';
  showCheque() {
    this.noData = false;
    this.show = true;
  }
  preview(index: number, data: any) {
    this.getImage(data);
  }

  getUploadFile(stockOrderId: number) {
    this.fileService.getFileList(stockOrderId).subscribe((response: any) => {
      this.fileList = response.content;
      this.uploadFileNameList = [];
      const kb = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      for (let i = 0; i < this.fileList.length; i++) {
        const item = this.fileList[i].url;
        const lastItem = item.split('/').pop();
        const fileType = item.split('.');
        const fileTypeIcon = fileType[fileType.length - 1];
        const round = Math.floor(
          Math.log(this.fileList[i].fileSize) / Math.log(kb)
        );
        const size = `${parseFloat(
          (this.fileList[i].fileSize / Math.pow(kb, round)).toFixed(0)
        )} ${sizes[round]}`;
        const data = new FileDetails();
        data.fileName = lastItem;
        data.fileType = fileTypeIcon.toLowerCase();
        data.fileSize = size;
        this.uploadFileNameList.push(data);
      }
    });
  }

  getImage(imageUrl: string): void {
    this.fileType = imageUrl;
    this.fileService
      .downloadImageByImageName(imageUrl)
      .subscribe((response: Blob) => {
        const reader = new FileReader();
        this.show = true;
        this.noData = false;
        reader.onload = (e) => {
          const base64Data = e.target.result;
          this.uploadFileName = base64Data.toString().slice(37);
        };
        reader.readAsDataURL(new Blob([response]));
        this.fileObject = new File([response], 'blobimage.jpeg');
      });
  }

  close() {
    this.noData = true;
    this.show = false;
  }

  getDownloadFile(file: any): void {
    const url = environment.API_BASE_URL + '/api/downloadFile/' + file;
    this.fileService.downloadFile(url).subscribe((response) => {
      const blob = new Blob([response]);
      const fileURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = url.substring(url.lastIndexOf('/') + 1);
      document.body.appendChild(a);
      a.click();
    });
  }

  actionResponse(event: PurchaseStockListDto, status: string) {
    const data = new PaymentDetailsDto();

    data.companyName = event.companyName;
    data.noOfPapers = event.stockCount;
    data.paymentStatus = event.paymentStatus;
    data.paymentType = event.paymentMethod;
    data.purchaseAmount = event.purchaseAmount;
    data.purchaseId = event.purchaseId;
    data.transactionId = event.transactionId;
    data.actionButton = status;
    this.authorityService.setApproveOrReject(data).subscribe((data: any) => {
      this.toasterService.success('',this.translate.instant('Toaster_success.'+data['content']));
      this.closeDialog();
      this.authorityService.setAddNew(true);
    });
  }
}
export class DialogData {
  approve: boolean;
  reject: boolean;
  purchaseStockData: any;
  isGetPurchaseStock : boolean;
  purchaseStockId: number;
}
export class FileDetails {
  fileName: string;
  fileType: string;
  fileSize: string;
}
