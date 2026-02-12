import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { updateFileList } from '../bulk-upload/bulk-upload.component';
import { PaperService } from 'src/app/service/paper-details/paper-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BulkRevokeService } from 'src/app/service/paper-details/bulk-revoke';
import { Subscription, tap,interval, Subject, debounceTime } from 'rxjs';
import { BulkUpload } from 'src/app/common/enum/enum';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-total-records-list',
  templateUrl: './total-records-list.component.html',
  styleUrls: ['./total-records-list.component.scss']
})
export class TotalRecordsListComponent implements OnInit, OnDestroy ,AfterViewInit {
  file: File = null;
  totalLength: number;
  pagesize = 7;
  minLength = 0;
  maxLength = 7;
  endingIndex =7;
  ZERO = 0;
  TEN = 10;
  SEVEN = 7;
  fileNameList: updateFileList[] = [];
  browseFile = false;
  filename = null;
  data: any[];
  error: boolean;
  success: boolean;
  totalCount = 0;
  errorCount = 0;
  successCount = 0;
  bulkRevoke: boolean;
  bulkUpload = true;
  filterVo: FilterOrSortingVo[] = [];
  Digital_Paper_No = false;
  Policy_No = false;
  errorSuccessData: any;
  maximum: number;
  remainder: number;
  Error_Msg=false;
  currentRoute: string;
  bulkUploadId: number;
  dataNotFound: boolean;
  isGotoPageDisable=false;
  errorFieldArray:any[]=[];
  isAscending=false;
  private searchSubject = new Subject<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  tableDatas:string[]=['Digital Paper Number','Policy Number','Error Message','Usage','Effective From','Email Id','Registration No','Make','Chassis Number',
                       'Expire Date','Licensed to carry','Insured Name','Model','Phone Number'];
  loaderSubscription: Subscription;


  constructor(private paperService: PaperService, private service: AuthorityPaperService, private paginatorName: MatPaginatorIntl,
    private detector: ChangeDetectorRef, private route: Router, private bulkRevokeService: BulkRevokeService,
    private activateRoute: ActivatedRoute,private toaster: ToastrService,private tosterservice:ToastrService, private ngxLoader: NgxUiLoaderService, public translate : TranslateService) {
      this.bulkUpload = this.getCurrentUrl();
      this.activateRoute.params.subscribe((params) => {
        this.bulkUploadId = params['id'];
        this.uploadType = atob(params['uploadType']);
        this.actionType = atob(params['actionType']);
      })
      this.connectWebSocket();

      if(this.paginatorName) {
        this.paginatorName.itemsPerPageLabel = this.translate.instant('Paginator.ItemsPerPageLabel');
      }

      this.searchSubject .pipe(debounceTime(300)).subscribe((pageIndex: number) => {
        this.changePageIndex();
      });
  }

  ngAfterViewInit(): void {

    if(this.paginatorName) {
      this.paginatorName.itemsPerPageLabel = this.translate.instant('Paginator.ItemsPerPageLabel');
    }
  }
  changePage(event) {
    if (this.uploadType === 'UPLOAD') {
      if (event.pageIndex != this.ZERO) {
        this.maxLength = event.pageSize;
        this.minLength = event.pageSize * event.pageIndex;
        this.endingIndex = event.pageSize;
        this.pageIndex = event.pageIndex + 1;
        if (this.pagesize != event.pageSize) {
          this.maximumcount(event.pageSize);
          
        }
      } else {
        this.maxLength = event.pageSize;
        this.minLength = event.pageIndex; this.endingIndex = event.pageSize;
        this.pageIndex = 1;
        if (this.pagesize != event.pageSize) {
          this.maximumcount(event.pageSize); 
        }
      }

      if(this.success){
        this.getSuccessTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
      }
      if(this.error){
        this.getErrorTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
      }

    }

    else {
      if (event.pageIndex != this.ZERO) {
        this.maxLength = event.pageSize;
        this.minLength = event.pageSize * event.pageIndex;
        this.endingIndex = event.pageSize;
        if (this.pagesize != event.pageSize) {
          this.maximumcount(event.pageSize);
          this.pageIndex = 1;
        }
      } else {
        this.maxLength = event.pageSize;
        this.minLength = event.pageIndex; this.endingIndex = event.pageSize;
        if (this.pagesize != event.pageSize) {
          this.maximumcount(event.pageSize); this.pageIndex = 1;
        }
      }
      if(this.success){
        this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength,this.maxLength,[]);
      }
      if(this.error){
        this.getBulkRevokeErrorData(this.bulkUploadId,this.minLength,this.maxLength,[]);
      }
    }
  }
  maximumcount(event) {
    this.pagesize = event;
    this.maximum = this.totalLength / this.pagesize
    this.remainder = this.totalLength % this.pagesize;
    if (this.remainder != 0) {
      this.maximum =  Math.floor(this.maximum + 1);
    }
  }
  pageIndex = 1;
  pageindex() {
    this.searchSubject.next(this.pageIndex);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 190) {
      event.preventDefault();
    }
  } 
  changePageIndex(){
    if (this.uploadType === 'UPLOAD') {
      if (this.pageIndex > 0) {
        if(this.pageIndex > this.maximum) {
          const numbDigit = this.maximum.toString().length;
          let numString =this.pageIndex.toString();
          numString = numString.substring(0, numbDigit);
          if(Number(numString) >= this.maximum ){
            numString = this.maximum.toString();
          }
          this.pageIndex = this.maximum === 0 ? 1 : Number(numString);
        }
        this.maxLength= this.endingIndex;
        this.minLength = this.endingIndex *(this.pageIndex-1);
        if(this.success){
           this.getSuccessTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
        }else{
         this.getErrorTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
        }
      }else{
        this.pageIndex = 1;
        this.minLength = 0;
        this.maxLength= 10;
        if(this.success){
           this.getSuccessTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
        }else{
         this.getErrorTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
        }
      }
    }

    else{
      if (this.pageIndex > 0) {
        if(this.pageIndex > this.maximum) {
          const numbDigit = this.maximum.toString().length;
          let numString =this.pageIndex.toString();
          numString = numString.substring(0, numbDigit);
          if(Number(numString) >= this.maximum ){
            numString = this.maximum.toString();
          }
          this.pageIndex = this.maximum === 0 ? 1 : Number(numString);
        }
        this.maxLength= this.endingIndex;
        this.minLength = this.endingIndex *(this.pageIndex-1);
        if(this.success){
          this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength,this.maxLength,[]);
        }
        if(this.error){
          this.getBulkRevokeErrorData(this.bulkUploadId,this.minLength,this.maxLength,[]);
        }
      }
    }
  }

  onChange(event: any) {

    this.file = event.target.files[0];
    const fileOk = new updateFileList;
    fileOk.fileType = event.target.files[0].type;
    if(!fileOk.fileType.includes('application/vnd'))
    {
      this.tosterservice.error(this.translate.instant('File_errors.excel_file'))
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
  dataSource: any;
  displayedColumns: string[] = [];
  dataColumns: string[] = [];
  four = "col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 col-xxl-3 ";
  eight = "col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 col-xxl-9";
  fullscreen = true;
  scrollBar=true;
  fullscreenc() {
    this.fullscreen = !this.fullscreen;
    this.four = "";
    this.eight = "col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12";
    this.scrollBar=false;
  }
  not_fullscreenc() {    
    document.getElementById("TotalRecordsTable").scrollTop = 0;
    document.getElementById("TotalRecordsTable").scrollLeft = 0;
    this.fullscreen = !this.fullscreen;
    this.four = "col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3"
      ; this.eight = "col-12 col-sm-12 col-md-9 col-lg-9 col-xl-9 col-xxl-9";
      this.scrollBar=true;
  }

  uploadType:string;
  actionType:string;
  private subscription: Subscription;
  ngOnInit(): void {
    this.ngxLoader.start();
    this.getBulkUploadHistory(this.bulkUploadId)

    this.recordCountCall();


    this.subscription = interval(5000).subscribe(() => {
      this.getBulkUploadHistory(this.bulkUploadId)
      this.recordCountCall();
      this.errorRecords();
    });

    this.loaderSubscription=interval(1000).subscribe(()=>{
      if (this.progress==='Completed' || this.progress==='FAILED') {
        this.ngxLoader.stop();
        this.subscription.unsubscribe();
      }
    })
    this.error = true;
    this.translate.onLangChange.subscribe(() => {
      if (this.paginator) {
        this.paginator._intl.itemsPerPageLabel = this.translate.instant('Paginator.ItemsPerPageLabel');
        this.paginator._intl.firstPageLabel=this.translate.instant('Paginator.FirstPage');
        this.paginator._intl.lastPageLabel=this.translate.instant('Paginator.LastPage');
        this.paginator._intl.nextPageLabel=this.translate.instant('Paginator.NextPage');
        this.paginator._intl.previousPageLabel=this.translate.instant('Paginator.PreviousPage');
        this.paginator._changePageSize(this.paginator.pageSize);
        this.detector.detectChanges();
      }
    });
    if(this.paginatorName) {
      this.paginatorName.itemsPerPageLabel = this.translate.instant('Paginator.ItemsPerPageLabel');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.loaderSubscription.unsubscribe();
  }

  getSuccessCountBulkRevoke(filterVo : FilterOrSortingVo[]) {
    this.bulkRevokeService.getSuccessCount(this.bulkUploadId,filterVo).subscribe((result: any) => {
      this.successCount = result;
    });
  }

  getSuccessCountBulkUpload(){
    this.paperService.getSuccessTableCount(this.bulkUploadId).subscribe((value: number) => {
      this.successCount = value;
    });
  }


  recordCountCall(){
    if (this.uploadType === 'UPLOAD') {
      this.getTotalCountBulkUpload();
      this.error=true;
    }
    else {
      this.getTotalCountBulkRevoke();
    }
  }


  getTotalCountBulkUpload(){
    this.paperService.getTotalRecordsCount(this.bulkUploadId).subscribe((value: number) => {
      this.totalCount = value;
      this.totalLength = value;

      this.getSuccessCountBulkUpload();
    });
  }

  getTotalCountBulkRevoke(){
    this.bulkRevokeService.getBulkRevokeCount(this.bulkUploadId,[]).subscribe((count: number) => {
      this.totalCount = count;
      this.totalLength = count;

      this.getSuccessCountBulkRevoke([]);
    });
  }

  errorRecords() {
    if (this.uploadType === 'UPLOAD') {
      this.getBulkUploadErrorData();
    }

    else {
      this.getBulkRevokeErrorCount(this.filterVo);
    }

  }

  getErrorCount(){
    if (this.uploadType === 'UPLOAD') {
      this.paperService.getErrorTableCount(this.bulkUploadId).subscribe((value: number) => {
        this.errorCount = value;
        this.totalLength = value;
        this.errorFieldArray = [];
      });
    }

    else {
        this.bulkRevokeService.getErrorCount(this.bulkUploadId,[]).subscribe((val: any) => {
          this.errorCount = val;
          this.totalLength = val;

        });
    }
  }

  getBulkUploadErrorData() {
    this.paperService.getErrorTableCount(this.bulkUploadId).subscribe((value: number) => {
      this.errorCount = value;
      const totalNUmber = this.totalLength / 7;

      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }

      this.totalLength = value;
      this.errorFieldArray = [];
      this.getErrorTableData(this.ZERO,this.SEVEN,this.bulkUploadId,this.filterVo);
    });
  }

   getErrorTableData(skip:number,limit:number,bulkUploadId:number,filter:FilterOrSortingVo[]) {

    this.paperService.getErrorTable(skip,limit,bulkUploadId,filter).subscribe((value: any[]) => {
      if (value) {

        if(value.length===0){
          this.dataNotFound=true;
        }
        else{
          this.dataNotFound=false;
        }


        if(value.length<this.maxLength){
          this.isGotoPageDisable=true;
        }
        else{
          this.isGotoPageDisable=false;
        }
        value.forEach((element) => {
          this.errorFieldArray.push(element[BulkUpload.ERRORFIELDS]);
        });
        this.data = value;
        this.dataSource = new MatTableDataSource(this.data);
        if (this.data[0] != null) {
          this.dataColumns = Object.getOwnPropertyNames(this.data[0]);
          const deletableColumns=[BulkUpload.SCRATCHID,BulkUpload.IDENTITY,BulkUpload.ERRORFIELDS,BulkUpload.ERRORMESSAGES];
          deletableColumns.forEach((value)=>{
            const index=this.dataColumns.indexOf(value);
            this.dataColumns.splice(index,1);
          });

          this.displayedColumns = ['Action'].concat(this.dataColumns);
        }
        this.error = true;
        this.success = false;
      }
    });
  }

  private getBulkRevokeErrorCount(filterVo: FilterOrSortingVo[]) {
    this.bulkRevokeService.getErrorCount(this.bulkUploadId,filterVo).subscribe((val: any) => {
      this.errorCount = val;
      this.totalLength = val;

      const totalNUmber = this.totalLength / 7;

      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }

      this.getBulkRevokeErrorData(this.bulkUploadId,this.minLength, this.maxLength,filterVo);
    });
  }

  private getBulkRevokeErrorData(bulkImportId:number,skip: number, limit: number, filterVo: FilterOrSortingVo[]) {
    this.bulkRevokeService.getBulkRevokeErrorData(bulkImportId,skip,limit,filterVo).subscribe((data: any) => {
      this.data = data;
      if (this.data === null || this.data.length === 0) {
        this.dataNotFound = true;
      }else{
        this.dataNotFound = false;
      }
      this.dataSource = new MatTableDataSource(this.data);

      if (this.data[0] != null) {
        this.dataColumns = Object.getOwnPropertyNames(this.data[0]);
        const removableData=['Identity','Bulk Import History Id','Error Message'];
          removableData.forEach(value=>{
            if(this.dataColumns.includes(value)){
              const index=this.dataColumns.indexOf(value);
              this.dataColumns.splice(index,1);
            }
          });
      this.displayedColumns = ['Action'].concat(this.dataColumns);
      this.error = true;
      this.success = false;
    }
  });
  }

  successRecords() {
    this.paginator.pageIndex = 0;
    this.pageIndex=1;
    if (this.uploadType === 'UPLOAD') {
      this.getSuccessTableData(this.ZERO,this.SEVEN,this.bulkUploadId,this.filterVo);
    }
    else {

      this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength, this.maxLength, this.filterVo);
    }
  }

   getSuccessTableData(skip:number,limit:number,bulkUploadId:number,filterVo:FilterOrSortingVo[]) {

    this.paperService.getSuccessTable(skip,limit,bulkUploadId,filterVo).subscribe((value: any[]) => {
      this.totalLength = this.successCount;
      const totalNUmber = this.totalLength / 7;

      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }

      if (value) {
        if(value.length===0){
          this.dataNotFound=true;
        }
        else{
          this.dataNotFound=false;
        }
        if(value.length<this.maxLength){
          this.isGotoPageDisable=true;
        }
        else{
          this.isGotoPageDisable=false;
        }
        this.data = value;
        this.dataSource = new MatTableDataSource(this.data);
        if (this.data[0] != null) {
          this.dataColumns = Object.getOwnPropertyNames(this.data[0]);
          const deletableColumns=[BulkUpload.SCRATCHID];
          deletableColumns.forEach((value)=>{
            const index=this.dataColumns.indexOf(value);
            this.dataColumns.splice(index,1);
          });

          this.displayedColumns = this.dataColumns;
        }
        this.success = true;
        this.error = false;
      }

    });
  }

  isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }

   bulkRevokeSuccessData(bulkImportId:number,skip: number, limit: number, filterVo: FilterOrSortingVo[]) {
    this.bulkRevokeService.getBulkRevokeSuccessData(bulkImportId,skip,limit,filterVo).subscribe((values: any) => {
      this.totalLength = this.successCount;
      this.data = values;
      
      const totalNUmber = this.totalLength / 7;

      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }

      if (this.data === null || this.data.length === 0) {
        this.dataNotFound = true;
      }else{
        this.dataNotFound = false;
      }
      this.dataSource = new MatTableDataSource(this.data);
      if (this.data[0] != null) {
        this.dataColumns = Object.getOwnPropertyNames(this.data[0]);
        this.displayedColumns = this.dataColumns;
      }

      this.success = true;
      this.error = false;
    });
  }

  onEditing(event: any) {
      const uploadType = this.activateRoute.snapshot.paramMap.get('uploadType');
      const actionType = this.activateRoute.snapshot.paramMap.get('actionType');
      this.paperService.passDataObject(event);
      this.paperService.setProduct(event);
      this.route.navigate(['generate-paper/manual/'+uploadType+'/'+actionType]);

  }

  onDeleting(element:any){
    if(this.uploadType === 'UPLOAD'){
     this.paperService.deleteErrorDetails(element.scratchId,element.identity).subscribe(
       data =>{
          this.errorRecords();
        }
      );
    }

     else{
       const identity=element.Identity;
     this.bulkRevokeService.deleteBulkRevoke(identity).subscribe((value: any) => {
       if (value) {
         this.ngOnInit();
       }
     })
     }
   }


  onDownloading() {
    if (this.uploadType === 'UPLOAD') {
      this.service.excelDownloadForDigitalPaper( this.bulkUploadId).subscribe(data => {
        if(data){
          this.donwloadFile(data);
        }
      });
    } else {
      const pageIdentity = "c741ae6b5c3a49b888d2592a51c6bu8u";
      this.bulkRevokeService.downloadErrorFile(pageIdentity,this.bulkUploadId).subscribe(datas => {
        if (datas) {
          this.donwloadFile(datas);
        } else {
          this.toaster.error(this.translate.instant('Toaster_error.Invalid_Excel'));
        }
      })
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
    a.download = 'Error-data' + '.xlsx';
    document.body.appendChild(a);
    a.click();
  }


  tableSorting(data: any) {
    if (this.uploadType === 'UPLOAD') {
        let bulkUploadDetails = data;
        for(let index=0; index<this.tableDatas.length; index++){
            if(bulkUploadDetails===this.tableDatas[index]){
                if(this.tableDatas[index]==='Policy Number'){
                  bulkUploadDetails=bulkUploadDetails+"pd";
                }
                  this.isAscending=!this.isAscending;
                  if(this.isAscending){
                    const columnName = this.getEntityColumnName(bulkUploadDetails);
                    this.setSortingVO(columnName,this.isAscending);
                    if(this.success){
                      this.getSuccessTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
                    }
                    if(this.error){
                      this.getErrorTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
                    }
                  }
                  else{
                    const columnName = this.getEntityColumnName(bulkUploadDetails);
                    this.setSortingVO(columnName,this.isAscending);
                    if(this.success){
                      this.getSuccessTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
                    }
                    if(this.error){
                      this.getErrorTableData(this.minLength,this.maxLength,this.bulkUploadId,this.filterVo);
                    }
                  }
                  return
            }
        }


    } else {
      const bulRevokeDetails = data;
      if (bulRevokeDetails === "Digital Paper Number") {
        this.Digital_Paper_No = !this.Digital_Paper_No;
        if (this.Digital_Paper_No) {
          const columnName = this.getEntityColumnName(bulRevokeDetails);
          this.setSortingVO(columnName, this.Digital_Paper_No);
          if (this.success) {
            this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength, this.maxLength,this.filterVo);
          }
          if (this.error) {
            this.getBulkRevokeErrorCount(this.filterVo);
          }
        } else {
          const columnName = this.getEntityColumnName(bulRevokeDetails);
          this.setSortingVO(columnName, this.Digital_Paper_No);
          if (this.success) {
            this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength, this.maxLength,this.filterVo);
          }
          if (this.error) {
            this.getBulkRevokeErrorCount(this.filterVo);
          }
        }
      } else if (bulRevokeDetails == "Policy Number") {
        this.Policy_No = !this.Policy_No;
        if (this.Policy_No) {
          const columnName = this.getEntityColumnName(bulRevokeDetails);
          this.setSortingVO(columnName, this.Policy_No);
          if (this.success) {
            this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength, this.maxLength,this.filterVo);
          }
          if (this.error) {
            this.getBulkRevokeErrorCount(this.filterVo);
          }
        } else {
          const columnName = this.getEntityColumnName(bulRevokeDetails);
          this.setSortingVO(columnName, this.Policy_No);
          if (this.success) {
            this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength, this.maxLength,this.filterVo);
          }
          if (this.error) {
            this.getBulkRevokeErrorCount(this.filterVo);
          }
        }
      } else if (bulRevokeDetails == "Error Message") {
        this.Error_Msg = !this.Error_Msg;
        if (this.Error_Msg) {
          const columnName = this.getEntityColumnName(bulRevokeDetails);
          this.setSortingVO(columnName, this.Error_Msg);
          if (this.success) {
            this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength, this.maxLength,this.filterVo);
          }
          if (this.error) {
            this.getBulkRevokeErrorCount(this.filterVo);
          }
        } else {
          const columnName = this.getEntityColumnName(bulRevokeDetails);
          this.setSortingVO(columnName, this.Error_Msg);
          if (this.success) {
            this.bulkRevokeSuccessData(this.bulkUploadId,this.minLength, this.maxLength,this.filterVo);
          }
          if (this.error) {
            this.getBulkRevokeErrorCount(this.filterVo);
          }
        }
      }
    }

  }

  // method for getting corresponding entitiy name
  getEntityColumnName(item: string): string {
    let value = ''; if (item) {
      const data = this.sortingEntityArray.find((column) => column.tableColumnName === item);
      if (data) {
        value = data.entityColumnName;
      }
    }
    return value;
  }


  // sorting condition method
  setSortingVO(value: string, condition: boolean) {
    if (value != null && condition != null) {
      this.sortingFilterVo.columnName = value;
      this.sortingFilterVo.isAscending = condition;
      this.filterVo=[];
      this.filterVo.push(this.sortingFilterVo);
    }

  }
  sortingEntityArray = [{
    tableColumnName: "Digital Paper Number",
    entityColumnName: "digitalPaperId",
    type: "String"
  },
  {
    tableColumnName: "Policy Number",
    entityColumnName: "policyNumber",
    type: "String"
  },
  {
    tableColumnName: "Error Message",
    entityColumnName: "errorMessage",
    type: "String"
  },
  {
    tableColumnName: "Usage",
    entityColumnName:"vdUsage",
    type:"String"
  },
  {
    tableColumnName: "Effective From",
    entityColumnName:"pdEffectiveFrom",
    type:"String"
  },
  {
    tableColumnName: "Email Id",
    entityColumnName:"pdEmailId",
    type:"String"
  },
  {
    tableColumnName: "Registration Number",
    entityColumnName:"vdRegistrationNumber",
    type:"String"
  },
  {
    tableColumnName: "Policy Numberpd",
    entityColumnName:"pdPolicyNumber",
    type:"String"
  },
  {
    tableColumnName: "Make",
    entityColumnName:"vdMake",
    type:"String"
  },
  {
    tableColumnName: "Chassis Number",
    entityColumnName:"vdChassis",
    type:"String"
  },
  {
    tableColumnName: "Expire Date",
    entityColumnName:"pdExpireDate",
    type:"String"
  },
  {
    tableColumnName: "Licensed to carry",
    entityColumnName:"vdLicensedToCarry",
    type:"String"
  },
  {
    tableColumnName: "Insured Name",
    entityColumnName:"pdInsuredName",
    type:"String"
  },
  {
    tableColumnName: "Model",
    entityColumnName:"vdModel",
    type:"String"
  },
  {
    tableColumnName: "Phone Number",
    entityColumnName:"pdPhoneNumber",
    type:"String"
  }

]

  // sorting filter vo
  sortingFilterVo: FilterOrSortingVo = {
    columnName: "",
    condition: "",
    filterOrSortingType: "SORTING",
    intgerValueList: [],
    valueList: [],
    isAscending: false,
    type: "",
    value: "",
    value2: "",
  }

  getCurrentUrl() {
    this.currentRoute = window.location.href;
    this.route.events.pipe(tap((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url
        if (this.currentRoute.includes('bulk-upload')) {
          this.bulkUpload = true;
        }
       else if (this.currentRoute.includes('bulk-revoke')) {
          this.bulkUpload = false;
        }

      }
    })).subscribe();
    return this.bulkUpload;
  }

  getColor(value:any, index: number){

       const isRed = this.errorFieldArray[index].includes(value);
      return isRed;
     }


     refreshPage(){
      this.ngOnInit();
     }

     progress = 'New';

     getBulkUploadHistory(id:number){
      this.paperService.getBulkUploadHistory(id).subscribe(response=>{
        if (response) {
          this.progress = response['content']['status'];
        }
      })
     }

     socket: any;
     stompClient: any;
     connectWebSocket() {

      this.socket = new SockJS(environment.WEB_SOCKET_URL);
      this.stompClient = Stomp.over(this.socket);
      const _this = this;

        const url = '/topic/bulk-history/' + this.bulkUploadId;


      _this.stompClient.connect({}, function (frame: any) {
        _this.stompClient.subscribe(
          url,
          function (response: any) {
            _this.onMessageReceived(response);
          }
        );
      });
    }


    onMessageReceived(response: any) {
      console.log(response,'-----------------------web socket');

      // const notification = JSON.parse(response.body);
      // if (notification != null || notification != undefined) {
      //   this.purchaseHistoryDetailsList.push(notification);
      //   this.notificationCount = this.notificationCount + 1;
      // }
    }






  }
