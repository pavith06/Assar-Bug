

import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PurchaseStockPopupComponent } from 'src/app/purchase-stock-list/purchase-stock-popup/purchase-stock-popup.component';
import { ViewPurchaseStockPopupComponent } from 'src/app/purchase-stock-list/view-purchase-stock-popup/view-purchase-stock-popup.component';
import { TransactionsListDto } from 'src/app/models/purchase-stock-dto/transactions-list-dto';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { PurchaseStockService } from 'src/app/service/purchase-stock.service';
import { CompanyTransaction } from 'src/app/models/purchase-stock-dto/transaction-dto';
import { FilterObject } from 'src/app/models/Filter-dto/filter-object';


import { ActivatedRoute, Router } from '@angular/router';
import { MenuSectionNames, componentName } from 'src/app/common/enum/enum';
import { ToastrServiceService } from 'src/app/service/toastr-service.service';
import { ToastrService } from 'ngx-toastr';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { CompanyDto } from 'src/app/models/entity-management-dto/insurance-company';
import { AccessMappingPageDto } from 'src/app/models/user-role-management/access-Mapping-PageDto ';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { appConst } from 'src/app/service/app.const';
import { AppService } from 'src/app/service/role access/service/app.service';
import { CompanyDetails } from 'src/app/models/company-dto';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit,OnDestroy,AfterViewInit{
  totalLength: number;
  pagesize = 10;
  pageIndex = 1;
  minLength: number;
  maxLength: number;
  maximum : number;
  remainder : number;
  endingIndex = 10;
  viewHistoryList: TransactionsListDto[];
  transactionVo = new CompanyTransaction();
  // companyDetails:CompanyDetails[]=[];
  companyDto:CompanyDto[]=[];
  columnContent:string[]=['Purchase ID', 'Company Name', 'No.of Papers', 'Transaction ID', 'Payment Date', 'Payment Type', 'Amount', 'Payment Status'];
  ZERO = 0;
  TEN=10;
  dataSource = new MatTableDataSource<TransactionsListDto>();
  notificationId: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  companyList:String[]=[];

  filterFromSearch:FilterOrSortingVo[]=[];
  filterVoObject:FilterOrSortingVo[]=[];
  filterObject: FilterObject[];
  showDownload=false;
  dataNotFound=false;
  searchdisable = false;
  transactionCompanyId:number[] = [];
  private searchSubject = new Subject<number>();
  searchValue="";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  rowPerPageSubscription: Subscription;
  constructor(public dialog: MatDialog,private route: ActivatedRoute,private paginatorName: MatPaginatorIntl,
    private detector: ChangeDetectorRef, public authorityPaperService: AuthorityPaperService, public purchaseStockService: PurchaseStockService,private router: Router,private toaster:ToastrService, private appService:AppService
    , private translate: TranslateService) {

    this.searchSubject .pipe(debounceTime(300)).subscribe((pageIndex: number) => {
      this.changePageIndex();
    });
   sessionStorage.setItem('componentName',componentName.TRANSACTION_LIST);
   if(this.paginatorName) {
    this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
      this.paginatorName.itemsPerPageLabel = translation;
    });

  }

    this.transactionVo.companyId = JSON.parse(sessionStorage.getItem('companyId'));
    if(this.transactionVo.companyId === null || this.transactionVo.companyId === undefined) {
      this.dataNotFound = true;
    }
    this.transactionCompanyId = this.transactionVo.companyId;
// this.route.queryParams.subscribe((queryParams: any) => {
    //   if (queryParams) {
    //     this.notificationId = queryParams["notificationId"];
    //     if(this.notificationId != undefined){
    //       this.transactionVo.companyId = [];
    //       this.transactionVo.companyId.push(this.notificationId);
    //     }
    //   }
    // });

    // this.route.queryParams.subscribe((queryParams: any) => {
    //   this.notificationId = queryParams["companyId"];
    //   if(this.notificationId != undefined){
    //     this.transactionVo.companyId = [];
    //     this.transactionVo.companyId.push(this.notificationId);
    //     this.transactionVo.isNotification=true;
    //   }
    // });

    this.authorityPaperService.getAddNew().subscribe(value => {
      if (value === true) {
        this.getTransactionCount(this.transactionVo);
      }
    })
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem("companyId");
    sessionStorage.removeItem('componentName');
    this.rowPerPageSubscription.unsubscribe();
  }


  columnAndIDSettingMethod(filterVoObject: FilterOrSortingVo[]) {
    if(filterVoObject!=null && filterVoObject!=undefined){
      const filterFromSearch:FilterOrSortingVo[]=filterVoObject;
      for(const vo of filterFromSearch){
        if(vo.valueList.length>0 && vo.columnName==='orderId.companyId'){
          const companyId:number[]=[];
          for(const value of vo.valueList){
              companyId.push(this.idFindingMethod(value));
          }
          vo.intgerValueList=companyId;
          vo.valueList=[];
        }
          const type= this.getColumnType(vo.columnName);
          vo.type=type;
    }
    this.transactionVo.filter=filterFromSearch;
    }
  }
  idFindingMethod(value: string):number {
    let id=0;
    if(value){
      const data=this.companyDto.find((element)=>element.name===value);
      id=data.companyId;
    }
    return id;
  }


  ngOnInit(): void {
    this.getPageAccessDetails();
    this.getMethodForChips();
    this.authorityPaperService.passFilterObject(this.filterObjectArray);
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
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }

  }


  authorityPaperDetailsAccessDto:AccessMappingPageDto;
  viewHistoryPageAccessDto: AccessMappingSectionDto;
  acceptAccessDto: AccessMappingSectionDto;
  rejectAccessDto: AccessMappingSectionDto;

  getPageAccessDetails(){
    this.appService.getPageAccess(appConst.PAGE_NAME.AUTHORITY_PAPER_DETAILS.PAGE_IDENTITY).subscribe(response=>{
      if (response) {
        this.authorityPaperDetailsAccessDto = response['content'];
        this.viewHistoryPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.View_History);
        this.acceptAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.Approve);
        this.rejectAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.Reject);
        if(this.filterVoObject){
          this.passingFilterVo(this.filterVoObject);
        }
        else{
          this.getTransactionCount(this.transactionVo);
        }
      }
    })
  }



  passingFilterVo(filterVoObject: FilterOrSortingVo[]) {
    this.columnAndIDSettingMethod(filterVoObject);
    this.transactionVo.filter = filterVoObject;
    this.getTransactionCount(this.transactionVo);
  }

  passValueParentToChild(event){
    this.showDownload = false;
    this.transactionVo.selectedColumn=[];
    this.transactionVo.selectedColumn=event;
    this.transactionVo.max= this.totalLength;
    this.authorityPaperService.excelDownloadForTransaction(this.transactionVo, this.searchValue).subscribe(data => {

      if(data){
        this.donwloadFile(data, "Transaction-details.xlsx");

      }else{
        this.toaster.error(this.translate.instant('Toaster_error.Invalid_Excel'));
      }
    });
  }

  private donwloadFile(value: any, downloadType: string) {

    const blob = new Blob([value], { type: 'application/vnd.ms-excel' });
    const file = new File([blob], 'report.xlsx', {
      type: 'application/vnd.ms-excel',
    });
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = fileURL;
    a.target = '_blank';
    a.download = 'Transaction-details' + '.xlsx';
    document.body.appendChild(a);
    a.click();
  }


  getTransactionCount(transactionVo:CompanyTransaction) {

    if(this.viewHistoryPageAccessDto?.isView===false){
      return;
    }

    this.authorityPaperService.getAllPurchaseOrderCount(transactionVo, this.searchValue).subscribe(data=>{
      // this.dataSource.paginator = this.paginator;
      this.totalLength =  0;
      this.totalLength= data;
      const totalNUmber = this.totalLength / 10;
      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }
      transactionVo.max=this.TEN;
      transactionVo.min=this.ZERO;
      if(transactionVo.filter==null || transactionVo.filter==undefined){
        transactionVo.filter=[];
      }
      this.getTableList(transactionVo, this.searchValue);
    })
  }

  isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }

  getTableList(transactionVo: CompanyTransaction,searchvalue:string) {
    this.authorityPaperService.getCompanyPurchaseTransaction(transactionVo,searchvalue).subscribe((data: any) => {
      this.viewHistoryList = [];
      this.viewHistoryList = data.content;
      if(this.viewHistoryList===null || this.viewHistoryList.length===0){
        this.dataNotFound=true;
      }
      else {
        this.dataNotFound=false;
      }
      this.dataSource = new MatTableDataSource<TransactionsListDto>(this.viewHistoryList);
    })
  }

  ngAfterViewInit() {
    if (this.dataSource !== undefined && this.dataSource !== null) {
      this.dataSource.paginator = this.paginator;
    }
    if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }

  }


  displayedColumns: string[] = ['Purchase ID', 'Company Name', 'No.of Papers', 'Transaction ID', 'Payment Date', 'Payment Type', 'Amount', 'Payment Status', 'View', 'Approve/Reject'];


  openDialog(): void {
    const dialogRef = this.dialog.open(PurchaseStockPopupComponent, {
      width: '1561px',
      height: '569px'
      //  height: '60%'
    });

    dialogRef.afterClosed().subscribe();
  }

  openViewPopup(element: any) {
    const dialogRef = this.dialog.open(ViewPurchaseStockPopupComponent, {
      width: '1561px',
      height: '569px',
      data: { approve: this.acceptAccessDto?.isView,
              reject: this.rejectAccessDto?.isView,
              purchaseStockData: element
            },
      //  height: '75%'

    });

    dialogRef.afterClosed().subscribe();

  }



  // filter object

  filterObjectArray: FilterObject[] = [
    {
      columnName: 'orderId.purchaseId',
      condition: 'Like',
      aliasName: 'Transactions_table.purchaseId',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    {
      columnName: 'orderId.companyId',
      condition: 'IN',
      aliasName: 'Transactions_table.companyName',
      type: 'chips',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    {
      columnName: 'orderId.stockCount',
      condition: 'BW',
      aliasName: 'Purchase_stock_view_popup.No_of_Papers',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null,
      isMax :false
    },
    {
      columnName: 'transactionId',
      condition: 'Like',
      aliasName: 'Transactions_table.transactionId',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    {
      columnName: 'orderId.purchaseDate',
      condition: 'BW',
      aliasName: 'Transactions_table.paymentDate',
      type: 'dates',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    {
      columnName: 'paymentMode',
      condition: 'IN',
      aliasName: 'Transactions_table.paymentType',
      type: 'chips',
      value: [],
      dropdown: ['Creditcard', 'Cash', 'NetBanking', 'UPI', 'Cheque','AirtelMoney','DebitCard'],
      radio: [],
      dataType:null
    },
    {
      columnName: 'paidAmount',
      condition: 'BW',
      aliasName: 'Transactions_table.amount',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null,
      isMax :false
    },

    {
      columnName: 'paymentStatus',
      condition: 'IN',
      aliasName: 'Transactions_table.paymentStatus',
      type: 'chips',
      value: [],
      dropdown: ['Success', 'Failed', 'Submitted','Rejected'],
      radio: [],
      dataType:null
    }

  ];


  // Array for chossing Backend column name corresponding to frontend column name
  sortingEntityArray = [
    {
      tableColumnName: "Purchase ID",
      entityColumnName: "orderId.purchaseId",
      type: "String"
    },
    {
      tableColumnName: "Company Name",
      entityColumnName: "orderId.companyId",
      type: "Integer"
    },
    {
      tableColumnName: "Transaction ID",
      entityColumnName: "transactionId",
      type: "String"
    },
    {
      tableColumnName: "Payment Date",
      entityColumnName: "orderId.purchaseDate",
      type: "Date"
    },
    {
      tableColumnName: "No.of Papers",
      entityColumnName: "orderId.stockCount",
      type: "Integer"
    },
    {
      tableColumnName: "Amount",
      entityColumnName: "paidAmount",
      type: "Integer"
    },
    {
      tableColumnName: "Payment Type",
      entityColumnName: "paymentMode",
      type: "Integer"
    },
    {
      tableColumnName: "Payment Status",
      entityColumnName: "paymentStatus",
      type: "Integer"
    }
  ]

  // method for getting corresponding entitiy name
  getEntityColumnName(item: string): string {
    let value = '';
    if (item) {
      const data = this.sortingEntityArray.find((column) => column.tableColumnName === item);
      if (data) {
        value = data.entityColumnName;
      }
    }
    return value;
  }

  // sorting filter vo
  sortingFilterVo: FilterOrSortingVo =
    {
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

  // sorting condition method
  setSortingVO(value: string, condition: boolean): FilterOrSortingVo[] {
    const sortArray: FilterOrSortingVo[] = [];
    if (value != null && condition != null) {
      this.sortingFilterVo.columnName = value;
      this.sortingFilterVo.isAscending = condition;
    }
    sortArray.push(this.sortingFilterVo);
    return sortArray;
  }

  getColumnType(item: string): string {
    let type = '';
    if (item) {
      const data = this.sortingEntityArray.find((column) => column.entityColumnName === item);
      if (data) {
        type = data.type;
      }
    }
    return type;
  }

  Purchase_ID = false;
  Company_Name = false;
  No_of_Papers = false;
  Transaction_ID = false;
  Payment_Date = false;
  Payment_Type = false;
  Amount = false;
  Payment_Status = false;


  shortingmethod(data) {
    const purchasestock = data;
    if (purchasestock === 'Purchase ID') {
      this.Purchase_ID = !this.Purchase_ID;
      this.Company_Name = false;
      this.No_of_Papers = false;
      this.Transaction_ID = false;
      this.Payment_Date = false;
      this.Payment_Type = false;
      this.Amount = false;
      this.Payment_Status = false;

      if (this.Purchase_ID) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Purchase_ID);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Purchase_ID);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
    else if (purchasestock === 'Company Name') {
      this.Company_Name = !this.Company_Name;
      this.Purchase_ID = false;
      this.No_of_Papers = false;
      this.Transaction_ID = false;
      this.Payment_Date = false;
      this.Payment_Type = false;
      this.Amount = false;
      this.Payment_Status = false;
      if (this.Company_Name) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Company_Name);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Company_Name);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
    else if (purchasestock === 'No.of Papers') {
      this.No_of_Papers = !this.No_of_Papers;
      this.Purchase_ID = false;
      this.Company_Name = false;
      this.Transaction_ID = false;
      this.Payment_Date = false;
      this.Payment_Type = false;
      this.Amount = false;
      this.Payment_Status = false;
      if (this.No_of_Papers) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.No_of_Papers);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.No_of_Papers);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
    else if (purchasestock === 'Transaction ID') {
      this.Transaction_ID = !this.Transaction_ID;
      this.Purchase_ID = false;
      this.Company_Name = false;
      this.No_of_Papers = false;
      this.Payment_Date = false;
      this.Payment_Type = false;
      this.Amount = false;
      this.Payment_Status = false;
      if (this.Transaction_ID) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Transaction_ID);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Transaction_ID);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
    else if (purchasestock === 'Payment Date') {
      this.Payment_Date = !this.Payment_Date;
      this.Purchase_ID = false;
      this.Company_Name = false;
      this.No_of_Papers = false;
      this.Transaction_ID = false;
      this.Payment_Type = false;
      this.Amount = false;
      this.Payment_Status = false;
      if (this.Payment_Date) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Payment_Date);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Payment_Date);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
    else if (purchasestock === 'Payment Type') {
      this.Payment_Type = !this.Payment_Type;
      this.Purchase_ID = false;
      this.Company_Name = false;
      this.No_of_Papers = false;
      this.Transaction_ID = false;
      this.Payment_Date = false;
      this.Amount = false;
      this.Payment_Status = false;
      if (this.Payment_Type) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Payment_Type);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Payment_Type);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
    else if (purchasestock === 'Amount') {
      this.Amount = !this.Amount;
      this.Purchase_ID = false;
      this.Company_Name = false;
      this.No_of_Papers = false;
      this.Transaction_ID = false;
      this.Payment_Date = false;
      this.Payment_Type = false;
      this.Payment_Status = false;
      if (this.Amount) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Amount);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Amount);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
    else if (purchasestock === 'Payment Status') {
      this.Payment_Status = !this.Payment_Status;
      this.Purchase_ID = false;
      this.Company_Name = false;
      this.No_of_Papers = false;
      this.Transaction_ID = false;
      this.Payment_Date = false;
      this.Payment_Type = false;
      this.Amount = false;
      if (this.Payment_Status) {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Payment_Status);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        const filterVO: FilterOrSortingVo[] = this.setSortingVO(columnName, this.Payment_Status);
        this.transactionVo.filter = filterVO;
        this.getTransactionCount(this.transactionVo);
      }
    }
  }
  searchItem(event){
    this.searchValue  = event;
    this.getTransactionCount(this.transactionVo);
  }
  changePage(event) {

    if (event.pageIndex != this.ZERO) {
      this.pageIndex = event.pageIndex +1;
      this.maxLength = event.pageSize;
      this.minLength = event.pageSize * event.pageIndex;
      this.endingIndex = event.pageSize;
      this.transactionVo.max=this.maxLength;
      this.transactionVo.min=this.minLength;
      if (this.pagesize != event.pageSize) {
        this.maximumcount(event.pageSize);

      }
    } else {
      this.pageIndex = 1;
      this.maxLength = event.pageSize;
      this.minLength = event.pageIndex;
      this.endingIndex = event.pageSize;
      this.transactionVo.max=this.maxLength;
      this.transactionVo.min=this.minLength;
      if (this.pagesize != event.pageSize) {
        this.maximumcount(event.pageSize);

      }

    }
    this.getTableList(this.transactionVo, this.searchValue);
  }

  maximumcount(event) {
    this.pagesize = event;
    this.maximum = this.totalLength / this.pagesize
    this.remainder = this.totalLength % this.pagesize;
    if (this.remainder != 0) {
      this.maximum =  Math.floor(this.maximum + 1);
    }
  }

  closedownload(data) {
    this.showDownload = false
    sessionStorage.setItem('componentName',componentName.TRANSACTION_LIST);
  }
  pageindex() {
    this.searchSubject.next(this.pageIndex);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 190) {
      event.preventDefault();
    }
  }
  
  changePageIndex(){
    if(this.pageIndex > 0) {
      if(this.pageIndex > this.maximum) {
        const numbDigit = this.maximum.toString().length;
        let numString =this.pageIndex.toString();
        numString = numString.substring(0, numbDigit);
        if(Number(numString) >= this.maximum ){
          numString = this.maximum.toString();
        }
        this.pageIndex = this.maximum === 0 ? 1 : Number(numString);
      }
      this.maxLength = this.endingIndex;
      this.minLength =  this.endingIndex * (this.pageIndex - 1);
      this.transactionVo.max=this.maxLength;
      this.transactionVo.min=this.minLength;
      this.getTableList(this.transactionVo, this.searchValue);
      // if(!this.pageIndex){
      // }else{
      //   this.getTableList(this.transactionVo, this.searchValue);
      // }
    }else{
      // this.pageIndex = 1;
      this.transactionVo.min= 0;
      this.transactionVo.max=10;
      this.getTableList(this.transactionVo, this.searchValue);
    }
  }

  open() {
    const columnName =  ['Purchase ID', 'Company Name', 'No.of Papers', 'Transaction ID', 'Payment Date', 'Payment Type', 'Amount', 'Payment Status'];
    this.passValueParentToChild(columnName)
}


getCompanyNames(companyDto:CompanyDto[]){
  if(companyDto!=undefined){
    this.companyList=companyDto.map(value=>new String(value.name));
  }
}


getMethodForChips(){
    this.authorityPaperService.getCompanyDto().subscribe(data=>{
      if (data) {
        this.companyDto = data;
        this.getCompanyNames(this.companyDto);
        this.filterObjectArray.forEach(value => {
          if (value.columnName === 'orderId.companyId') {
            value.dropdown = this.companyList;
          }
        });
        this.filterObject = this.filterObjectArray;
      }
    })
}


  emitFilterValue(event: any) {
    this.searchValue="";
    this.filterVoObject = event;
    this.filterVoObject.forEach((vo)=>{
      if (vo.columnName === 'orderId.purchaseDate' || vo.columnName === 'orderId.stockCount' || vo.columnName === 'paidAmount') {
        if (vo.value == null && vo.value2 != null) {
          vo.condition = 'Le'
          vo.value=vo.value2;
          vo.value2=null;
        }
        else if (vo.value != null && vo.value2 == null) {
          vo.condition = 'Ge'
        }
      }
    })

    this.passingFilterVo(this.filterVoObject);
  }

  backTocard() {
    this.router.navigateByUrl("authority-paper-details/purchase-history/card");
  }
  onpagebackward() {
    if (this.viewHistoryList != null) {
      this.dataNotFound = false;
    }
  }
}
