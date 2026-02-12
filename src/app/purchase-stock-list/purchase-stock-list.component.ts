import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseStockPopupComponent } from './purchase-stock-popup/purchase-stock-popup.component';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseStockListDto } from '../models/purchase-stock-dto/purchase-stock-list-dto';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PurchaseStockService } from '../service/purchase-stock.service';
import { ViewPurchaseStockPopupComponent } from './view-purchase-stock-popup/view-purchase-stock-popup.component';
import { FilterObject } from '../models/Filter-dto/filter-object';
import { DownloadVo, FilterOrSortingVo } from '../models/Filter-dto/filter-object-backend';
import { AuthorityPaperService } from '../service/authority-paper.service';
import { PaymentStatusPopupComponent } from './payment-status-popup/payment-status-popup.component';
import { FileTypeEnum } from '../models/report-loss-dto/FileTypeEnum';
import { ToastrService } from 'ngx-toastr';
import { appConst } from '../service/app.const';
import { AppService } from '../service/role access/service/app.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuSectionNames } from '../common/enum/enum';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-purchase-stock-list',
  templateUrl: './purchase-stock-list.component.html',
  styleUrls: ['./purchase-stock-list.component.scss']
})
export class PurchaseStockListComponent implements OnInit, AfterViewInit, OnDestroy{


  totalLength: number;
  pagesize: number;

  minLength=0;
  maxLength=10;
  maximum: number;
  remainder: number;
  endingIndex= 10;
  isGotToPageDissabel=false;
  purchaseStockDetails: PurchaseStockListDto[];
  showtabledata: PurchaseStockListDto[];
  purchaseData: PurchaseStockListDto;
  ZERO = 0;
  TEN = 10;
  currentCompanentName: string;
  isDownloadDisable=false
  dataNotFound=false;
  dataSource = new MatTableDataSource<PurchaseStockListDto>();
  columnContent: string[];
  filterVoObject: FilterOrSortingVo[] = [];
  downloadVo = new DownloadVo();
  searchdisable = false;
  private searchSubject = new Subject<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchValue="";
  rowPerPageSubscription: Subscription;
  constructor(public dialog: MatDialog, private paginatorName: MatPaginatorIntl, private toaster:ToastrService, public purchaseService: PurchaseStockService,public authorityPaper : AuthorityPaperService, private appService:AppService
    ,private translate: TranslateService, private detector: ChangeDetectorRef
) {
    if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }
    this.authorityPaper.getAddNew().subscribe(value => {
      if (value === true) {
        this.minLength = 0;
        this.maxLength = 10;
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    })

    this.searchSubject .pipe(debounceTime(300)).subscribe((pageIndex: number) => {
      this.changePageIndex();
    });
  }
  ngOnDestroy(): void {
    this.rowPerPageSubscription.unsubscribe();
  }

  filterObjectArray: FilterObject[] = [
    {
      columnName: 'orderId.purchaseId',
      condition: 'Like',
      aliasName: 'Purchase_stock_table.purchasId',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null
    },
    {
      columnName: 'transactionId',
      condition: 'Like',
      aliasName: 'Purchase_stock_table.transcationId',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null
    },
    {
      columnName: 'orderId.purchaseDate',
      condition: 'BW',
      aliasName: 'Purchase_stock_table.dateOfPurchase',
      type: 'dates',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null
    },
    {
      columnName: 'orderId.stockCount',
      condition: 'BW',
      aliasName: 'Purchase_stock_table.noOfPapers',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax :false
    },
    {
      columnName: 'paidAmount',
      condition: 'BW',
      aliasName: 'Purchase_stock_table.purchaseAmount',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax :false
    },
    {
      columnName: 'paymentMode',
      condition: 'IN',
      aliasName: 'Purchase_stock_table.paymentMethod',
      type: 'chips',
      value: [],
      dropdown: ['Creditcard', 'Cash', 'NetBanking', 'UPI', 'Cheque','AirtelMoney','DebitCard'],
      radio: [],
      dataType: null
    },
    {
      columnName: 'paymentStatus',
      condition: 'IN',
      aliasName: 'Purchase_stock_table.paymentStatus',
      type: 'chips',
      value: [],
      dropdown: ['Success', 'Failed', 'Submitted','Rejected'],
      radio: [],
      dataType: null
    }

  ];
  ngOnInit(): void {
    this.getPageAccessDetails();
    // this.getTableData(this.ZERO,this.TEN,this.filterVoObject);
    this.getDropdownData();
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

  purchaseStockAccessMappingDetails:AccessMappingSectionDto;
  purchaseListAccessData:AccessMappingSectionDto;
  newPurchaseAccessData:AccessMappingSectionDto;
  getPageAccessDetails(){
    this.appService.getPageAccess(appConst.PAGE_NAME.PURCHASE_STOCK.PAGE_IDENTITY).subscribe(response=>{
      if (response) {
        this.purchaseStockAccessMappingDetails = response['content'];
        this.purchaseStockAccessMappingDetails.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.purchaseStockAccessMappingDetails?.sectionData);
        this.purchaseListAccessData = this.purchaseStockAccessMappingDetails.sectionData.find(x => x.sectionName===MenuSectionNames.Purchase_List);
        this.newPurchaseAccessData = this.purchaseStockAccessMappingDetails.sectionData.find(x => x.sectionName===MenuSectionNames.New_Purchase);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    })
  }

  getEnabledPrivilegeFromMultipleRoles(sectionDataArray:AccessMappingSectionDto[]):AccessMappingSectionDto[]{
    const result: AccessMappingSectionDto[] = Object.values(
      sectionDataArray.reduce((accumulator, obj) => {
        let accessMappingAccumulator:AccessMappingSectionDto= null;
        if (!accumulator[obj.sectionName]) {
          accumulator[obj.sectionName] = obj;
        }
        accessMappingAccumulator=accumulator[obj.sectionName];
        if(obj.isView){          
          accessMappingAccumulator.isView=obj.isView;
        }
        if(obj.isClone){
          accessMappingAccumulator.isClone=obj.isClone;
        }
        if(obj.isDisable){
          accessMappingAccumulator.isClone=obj.isDisable;
        }
        if(obj.isDownload){
          accessMappingAccumulator.isDownload=obj.isDownload;
        }
        if(obj.isEdit){
          accessMappingAccumulator.isEdit=obj.isEdit;
        }
        if(obj.isNotification){
          accessMappingAccumulator.isNotification=obj.isNotification;
        }
        accumulator[obj.sectionName]=accessMappingAccumulator;
        return accumulator;
      }, {} as Record<string, AccessMappingSectionDto>)
    );
    
    return result
  }

  isDissabelFoStatus(element:any){
    if('REJECTED'===element.paymentStatus){
      return true;
    }else if(!this.purchaseListAccessData?.isEdit){
      return true;
    }else{
      return false;
    }
  }

  searchItem(event){
      this.searchValue =event;
      this.getPurchaseCount( this.filterVoObject,this.searchValue);
  }

  getTableData(min: number, max: number,searchValue:string, filterVo: FilterOrSortingVo[]) {

    this.purchaseService.getPurchaseDetails(min, max,searchValue, filterVo).subscribe((data: any) => {
      this.purchaseStockDetails = [];
      this.purchaseStockDetails = data;
      if (this.purchaseStockDetails === null || this.purchaseStockDetails.length === 0 ) {
        this.dataNotFound = true;
        this.isDownloadDisable=true
      } else{
        this.isGotToPageDissabel = false;
        this.isDownloadDisable=false;
        this.dataNotFound = false;
      }
      this.showtabledata = [];
      this.dataSource = new MatTableDataSource<PurchaseStockListDto>(this.purchaseStockDetails);
    });
  }

  displayedColumns: string[] = ['Purchase ID', 'Transaction ID', 'Date of Purchase', 'No.of Papers','Purchase Amount','Payment Method','Payment Status','View','Repeat'];
  openDrowpown(){
    this.currentCompanentName="purchase_stock";
    // this.purchaseService.getDrowpDownData().subscribe((data:any)=>{
    //   this.displayedColumns.push(data.content);
    // });

  }

  ngAfterViewInit(): void {
    if (this.dataSource !== undefined && this.dataSource !== null) {
      this.dataSource.paginator = this.paginator;
    }
    if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }
  }
  onpagebackward() {

    if (this.purchaseStockDetails != null) {
      this.dataNotFound = false;
    }


  }

  openDialog(): void {
    const no_of_paper = null;
    const paymentMethod = null;
    const dialogRef = this.dialog.open(PurchaseStockPopupComponent, {
      width: '1561px',
      // height: '569px',
      data: {
        noOfPaper: no_of_paper,
        Payment_Method: paymentMethod,
      },
      //  height: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.openPaymentStatusDialog(result);
      }

    });
  }

  openPaymentStatusDialog(id): void {
    const isGetPurchaseStock = true;
    const dialogRef =this.dialog.open(ViewPurchaseStockPopupComponent, {
      width: '1561px',
      height: '569px',
      data: {
        isGetPurchaseStock,
        purchaseStockData: [],
        purchaseStockId : id
      },

    });

    dialogRef.afterClosed().subscribe(result => {
      this.paginator.firstPage();
      this.getPurchaseCount(this.filterVoObject,this.searchValue);
    });
  }


  openDialogs(data: any): void {

    const no_of_paper = data.stockCount;
    const paymentMethod = data.paymentMethod

    const dialogRef = this.dialog.open(PurchaseStockPopupComponent, {
      width: '1561px',
      height: '569px',
      data: {
        noOfPaper: no_of_paper,
        Payment_Method: paymentMethod,
        purchaseAmount : data.purchaseAmount
      },
      //  height: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
     if(result){
      this.openPaymentStatusDialog(result);
      this.ngOnInit();
     }
    });
  }


  openViewPopup(value: any) {
    const dialogRef = this.dialog.open(ViewPurchaseStockPopupComponent, {
      width: '1561px',
      height: '569px',
      data: {
        approve: false,
        reject: false,
        purchaseStockData: value
      },
      //  height: '75%'

    });

    dialogRef.afterClosed().subscribe();

  }

  // Array for chossing Backend column name corresponding to frontend column name
  sortingEntityArray = [
    {
      tableColumnName: "Purchase ID",
      entityColumnName: "orderId.purchaseId",
      type: "String"
    },
    {
      tableColumnName: "Transaction ID",
      entityColumnName: "transactionId",
      type: "String"
    },
    {
      tableColumnName: "Date of Purchase",
      entityColumnName: "orderId.purchaseDate",
      type: "Date"
    },
    {
      tableColumnName: "No.of Papers",
      entityColumnName: "orderId.stockCount",
      type: "Integer"
    },
    {
      tableColumnName: "Purchase Amount",
      entityColumnName: "paidAmount",
      type: "String"
    },
    {
      tableColumnName: "Payment Method",
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
  setSortingVO(value: string, condition: boolean) {
    if (value != null && condition != null) {
      this.sortingFilterVo.columnName = value;
      this.sortingFilterVo.isAscending = condition;
    }

    const data = this.filterVoObject.find((element) => element.filterOrSortingType === 'SORTING');
    if (data) {
      const index: number = this.filterVoObject.indexOf(data);
      this.filterVoObject.splice(index, 1);
    }

    this.filterVoObject.push(this.sortingFilterVo);
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

  shorting = false;
  Purchase_ID = false;
  Transaction_ID= false;
  Date_of_Purchase = false;
  NO_of_Papers = false;
  Purchase_Amount = false;
  Payment_Method= false;
  Payment_Status= false;
  rotate
  shortingmethod(data: any) {
    const purchasestock = data;
    if (purchasestock === "Purchase ID") {
      this.Purchase_ID = !this.Purchase_ID;
      this.Transaction_ID= false;
      this.Date_of_Purchase = false;
      this.NO_of_Papers = false;
      this.Purchase_Amount = false;
      this.Payment_Method= false;
      this.Payment_Status= false;
      if (this.Purchase_ID) {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Purchase_ID);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Purchase_ID);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (purchasestock === "Transaction ID") {
      this.Transaction_ID = !this.Transaction_ID;
      this.Purchase_ID = false;
      this.Date_of_Purchase = false;
      this.NO_of_Papers = false;
      this.Purchase_Amount = false;
      this.Payment_Method= false;
      this.Payment_Status= false;
      if (this.Transaction_ID) {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Transaction_ID);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Transaction_ID);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (purchasestock === "Date of Purchase") {
      this.Date_of_Purchase = !this.Date_of_Purchase;
      this.Purchase_ID = false;
      this.Transaction_ID= false;
      this.NO_of_Papers = false;
      this.Purchase_Amount = false;
      this.Payment_Method= false;
      this.Payment_Status= false;
      if (this.Date_of_Purchase) {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Date_of_Purchase);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Date_of_Purchase);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (purchasestock === "No.of Papers") {
      this.NO_of_Papers = !this.NO_of_Papers;
      this.Purchase_ID = false;
      this.Transaction_ID= false;
      this.Date_of_Purchase = false;
      this.Purchase_Amount = false;
      this.Payment_Method= false;
      this.Payment_Status= false;
      if (this.NO_of_Papers) {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.NO_of_Papers);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.NO_of_Papers);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (purchasestock === "Purchase Amount") {
      this.Purchase_Amount = !this.Purchase_Amount;
      this.Purchase_ID = false;
      this.Transaction_ID= false;
      this.Date_of_Purchase = false;
      this.NO_of_Papers = false;
      this.Payment_Method= false;
      this.Payment_Status= false;
      if (this.Purchase_Amount) {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Purchase_Amount);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Purchase_Amount);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (purchasestock === "Payment Method") {
      this.Payment_Method = !this.Payment_Method;
      this.Purchase_ID = false;
      this.Transaction_ID= false;
      this.Date_of_Purchase = false;
      this.NO_of_Papers = false;
      this.Purchase_Amount = false;
      this.Payment_Status= false;
      if (this.Payment_Method) {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Payment_Method);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Payment_Method);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (purchasestock === "Payment Status") {
      this.Payment_Status = !this.Payment_Status;
      this.Purchase_ID = false;
      this.Transaction_ID= false;
      this.Date_of_Purchase = false;
      this.NO_of_Papers = false;
      this.Purchase_Amount = false;
      this.Payment_Method= false;
      if (this.Transaction_ID) {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Payment_Status);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(purchasestock);
        this.setSortingVO(columnName, this.Payment_Status);
        this.getPurchaseCount(this.filterVoObject,this.searchValue);
      }
    }



  }

  changePage(event) {
    if (event.pageIndex != this.ZERO) {
      this.pageIndex = event.pageIndex +1;
      this.maxLength = event.pageSize;
      this.minLength = (event.pageSize * event.pageIndex);
      this.endingIndex = event.pageSize;
      if (this.pagesize != event.pageSize) {
        this.maximumcount(event.pageSize);
      }
    } else {
      this.pageIndex = 1;
      this.maxLength = event.pageSize;
      this.minLength = event.pageIndex;
      this.endingIndex = event.pageSize;
      if (this.pagesize != event.pageSize) {
        this.maximumcount(event.pageSize);

      }
    }
    this.getTableData(this.minLength, this.maxLength,this.searchValue, this.filterVoObject);
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
      this.minLength = this.endingIndex * (this.pageIndex - 1);
      this.getTableData(this.minLength, this.maxLength,this.searchValue, this.filterVoObject);
      // if(!this.pageIndex){
      //   this.getTableData(this.minLength, this.maxLength,this.searchValue, this.filterVoObject);
      // }else{
      // }
    }else{
      // this.pageIndex = 1;
      this.minLength = 0;
      this.maxLength = 10;
      this.getTableData(this.minLength, this.maxLength,this.searchValue, this.filterVoObject);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 190) {
      event.preventDefault();
    }
  }


  downloadclose= false;


  closedowload(data) {
    this.downloadclose = false
  }
  download() {
   const totalColumn = ['Purchase ID', 'Transaction ID', 'Date of Purchase', 'No.of Papers','Purchase Amount','Payment Method','Payment Status'];
    this.downloadVo.filterVo = this.filterVoObject;
    this.downloadVo.columnList = totalColumn;
    this.downloadVo.max =  this.totalLength;
    this.downloadVo.min = this.ZERO;
    this.purchaseService.purchaseStockDownload(this.downloadVo,this.searchValue).subscribe((data: any) =>{
      if(data){
        this.donwloadFile(data);
      }else {
        this.toaster.error(this.translate.instant('Toaster_error.Invalid_Excel'));
      }
    })

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
    a.download = 'Purchase Stock' + '.xlsx';
    document.body.appendChild(a);
    a.click();
  }

  emitFilterValue(event: FilterOrSortingVo[]) {
    this.searchValue="";
    const filterFromSearch: FilterOrSortingVo[] = event;
    for (let vo of filterFromSearch) {
      const type = this.getColumnType(vo.columnName);
      vo.type = type;
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
    }
    this.filterVoObject = filterFromSearch;
    this.getPurchaseCount(this.filterVoObject,this.searchValue);
  }

  getPurchaseCount(filterVo: FilterOrSortingVo[],searchBalue:string) {
    if(this.purchaseListAccessData.isView===false){
      return;
    }
    this.pageIndex=1;
    this.purchaseService.getPurchaseOrderCount(filterVo,searchBalue).subscribe((data) => {
      this.totalLength = data;
      const totalNUmber = this.totalLength / 10;
      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }
      this.maxLength=10;
      this.minLength=0;
      this.getTableData(this.minLength, this.maxLength,this.searchValue, this.filterVoObject);
      this.maximumcount(this.TEN);
    });
  }

  isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }


  getDropdownData() {
    this.purchaseService.getDrowpDownData().subscribe((data: any) => {
      this.columnContent = data.content;
    });
  }

}
