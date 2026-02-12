import { EventEmitter } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { Component, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadHistoryPopupComponent } from './upload-history-popup/upload-history-popup.component';
import { NavigationEnd, Router } from '@angular/router';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { ToastrService } from 'ngx-toastr';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { BulkRevokeService } from 'src/app/service/paper-details/bulk-revoke';
import { PaperDetailService } from 'src/app/service/paper-details.service';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { appConst } from 'src/app/service/app.const';
import { AppService } from 'src/app/service/role access/service/app.service';
import { MenuSectionNames } from 'src/app/common/enum/enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
})
export class BulkUploadComponent implements OnInit {

  bulkUpload =true;
  currentRoute:string;
  action = 'Generate_Paper';
  actionType: string;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authorityPaperService: AuthorityPaperService,
    private toaster: ToastrService,
    private paperDetailService:PaperDetailService,
    private bulkRevokeService:BulkRevokeService,
    private appService:AppService,private tosterservice:ToastrService,
    private translate: TranslateService
  ) {
   this.getUrl();
  }
  uploadType = 'NORMAL';
  ngOnInit() {
    this.getPageAccessDetails();
    this.getCurrentUrl();
    this.actionType = sessionStorage.getItem("revoke");
    if(this.actionType == "Bulk Revoke"){
      this.action = 'Revoke_Paper';
    }else{
      this.action = 'Generate_Paper';
    }
    this.BulkUpload[0].check = true;
    this.BulkUpload[1].check = false;
  }

  paperDetailsAccessMappingDetails:AccessMappingSectionDto;
  generatePaperBulkAccessDetails:AccessMappingSectionDto;
  bulkRevokeAccessDetails:AccessMappingSectionDto;
  getPageAccessDetails(){
    this.appService.getPageAccess(appConst.PAGE_NAME.PAPER_DETAILS.PAGE_IDENTITY).subscribe(response=>{
      if (response) {
        this.paperDetailsAccessMappingDetails = response['content'];
        this.generatePaperBulkAccessDetails = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName===MenuSectionNames.Generate_Paper_Bulk);
        this.bulkRevokeAccessDetails = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName===MenuSectionNames.Revoke_Bulk);
      }
    })
  }

  getUrl() {
    const actionType = sessionStorage.getItem("revoke");
        if (actionType == "Bulk Revoke") {
          this.bulkUpload = false;
        }
       else {
          this.bulkUpload = true;
        }
  }
  openDialog(): void {
    if (this.currentRoute.includes('bulk-revoke')) {
      const dialogRef = this.dialog.open(UploadHistoryPopupComponent, {
        width: '1561px',
        height: '569px',
        data:{
          historyType:'bulk-revoke'
        }

      });
      dialogRef.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
    }else{
      const dialogRef = this.dialog.open(UploadHistoryPopupComponent, {
        width: '1561px',
        height: '569px',
        data:{
          historyType:'bulk-upload'
        }

      });
      dialogRef.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
    }



  }
  BulkUpload: any[] = [
    {
      name:'Bulk_Upload.Normal',
      check: false,
    },
    { name:'Bulk_Upload.Fleet', 
      check: false },
  ];

  BulkUploadNormalFeet(event: any) {
    // this.Amount = event               //use is code in backend
    if (event === 'Bulk_Upload.Normal') {
      this.uploadType = 'NORMAL';
      this.BulkUpload[0].check = true;
      this.BulkUpload[1].check = false;
      // this.reallocate=true;
    } else if (event === 'Bulk_Upload.Fleet') {
      this.uploadType = 'FLEET';
      this.BulkUpload[0].check = false;
      this.BulkUpload[1].check = true;
      // this.reallocate=false;
    }
  }
  file: File = null;
  fileNameList: updateFileList[] = [];
  browseFile=false;
  filename=null;
   generateRevoke:boolean;
  generatePaper: boolean;

  onChange(event: any) {
    this.file = event.target.files[0];
    const fileOk = new updateFileList();
    fileOk.fileType = event.target.files[0].type;
    if(!fileOk.fileType.includes('application/vnd'))
    {
      this.tosterservice.error(this.translate.instant('File_errors.file_format'));
    }
    else{
      fileOk.size = event.target.files[0].size * 0.000977;
      fileOk.name = event.target.files[0].name;
      this.filename = fileOk.name;
      this.fileNameList.push(fileOk);
    }
  }
  DeleteFile()
  {
    this.filename=null;
    this.fileNameList=[];
  }
  redirectpage() {
    this.sendBulkUploadFileData(this.file,this.uploadType);
    this.router.navigateByUrl('/generate-paper/total_records');
  }

  redirectRevokepage() {
    this.sendBulkUploadFileData(this.file,this.uploadType);
  }




  sendBulkUploadFileData(file:File,uploadType:string){
    let uploadAction = 'UPLOAD';
    // if (this.currentRoute.includes('/bulk-revoke')) {
    //   uploadAction = 'REVOKE'
    // }

    if (this.actionType==='Bulk Revoke') {
      uploadAction='REVOKE'
    }
    
    this.paperDetailService.sendBulkUploadFileData(file,uploadType,uploadAction).subscribe((response)=>{
      // if (response) {
      //   this.toaster.success('File uploaded successfully')
      // }

      const uploadId = response['bulkImportHistoryDto']['uploadId']
      const uploadAction = response['uploadAction']
      const uploadType = response['uploadType']


      if (this.actionType==='Bulk Revoke') {
        this.router.navigate(['generate-paper/total_records/bulk-revoke/'+uploadId +'/'+ btoa(uploadAction)+'/'+btoa(uploadType)]);
      }
      else{
        this.router.navigate(['generate-paper/total_records/bulk-upload/'+uploadId +'/'+ btoa(uploadAction)+'/'+btoa(uploadType)]);
      }
    });
  }

  displayedColumns: string[] = [
    'Digital Paper No',
    'Policy No',
    'Insured Name',
    'Registration No',
    'Effective From',
    'Effective to',
    'Status',
    'View',
    'Revoke', 
  ];


  sampleFileColumns: string[] = ['Digital Paper','Policy Number',]
  sampleExcelDownload() {
    if (this.bulkUpload?this.generatePaperBulkAccessDetails?.isDownload:this.bulkRevokeAccessDetails?.isDownload) {
      if(this.bulkUpload) {
        const pageIdentity = "c741ae6b5c3a49b888d2592a51c6bu8u";
        this.authorityPaperService.bulkUploadSampleExcelDownload(pageIdentity).subscribe((result)=>{
          if (result) {
            this.donwloadFile(result);
          } else {
            this.toaster.error(this.translate.instant('Toaster_error.Invalid_Excel'));
          }
        })
      } else {
        this.authorityPaperService
        .downloadSampleExcel(this.sampleFileColumns)
        .subscribe((datas) => {
          if (datas) {
            this.donwloadFile(datas);
          } else {
            this.toaster.error(this.translate.instant('Toaster_error.Invalid_Excel'));
          }
        });
      }
    }
  }

  private donwloadFile(value: any) { 
    const blob = new Blob([value], { type: 'application/vnd.ms-excel' });
    const file = new File([blob], 'report.xlsx', {
      type: 'application/vnd.ms-excel',
    });
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = 'Sample File' + '.xlsx';
    document.body.appendChild(a);
    a.click();
  }

  getCurrentUrl() {
    this.currentRoute = window.location.href;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
      }
    });
}
}
export class updateFileList {
  name: string;
  file: any;
  size: any;
  fileType: string;
}
