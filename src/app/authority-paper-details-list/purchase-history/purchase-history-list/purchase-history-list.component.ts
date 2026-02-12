import { AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { V } from '@angular/cdk/keycodes';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { min } from 'moment';
import { InsuranceCompanyDto } from 'src/app/models/entity-management-dto/insurance-company';
import { FilterOrSortingFilter } from 'src/app/models/purchase-stock-dto/filter-or-sorting';
import { FilterObject } from 'src/app/models/Filter-dto/filter-object';
import {
  ExcelDownloadVo,
  PurchaseHistoryDto,
} from 'src/app/models/purchase-stock-dto/purchase-history-dto';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { EntityManagementService } from 'src/app/service/entitymanagement-service';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { AccessMappingPageDto } from 'src/app/models/user-role-management/access-Mapping-PageDto ';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { appConst } from 'src/app/service/app.const';
import { AppService } from 'src/app/service/role access/service/app.service';
import { MenuSectionNames } from 'src/app/common/enum/enum';
import { CompanyDetails } from 'src/app/models/company-dto';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { CheckboxstateService } from 'src/app/service/check-box/checkboxstate.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-purchase-history-list',
  templateUrl: './purchase-history-list.component.html',
  styleUrls: ['./purchase-history-list.component.scss'],
})
export class PurchaseHistoryListComponent implements OnInit, AfterViewInit,OnDestroy,AfterViewInit{
  totalLength: number;
  pagesize: number;
  maximum: number;
  minLength: number;
  maxLength: number;
  endingIndex = 10;
  ZERO = 0;
  TEN = 10;
  purchaseHistoryListData: PurchaseHistoryDto[];
  excelDownloadVo = new ExcelDownloadVo();
  showTableData: PurchaseHistoryDto[];
  purchaseHistoryList: PurchaseHistoryDto;
  filterVo: FilterOrSortingFilter[] = [];
  ascOrdescData: boolean;
  FilterOrSortingForManageTemplate: any;

  selectedColumn: string[] = [];
  getcompanylist: InsuranceCompanyDto[];

  @ViewChild(MatSort) sort: MatSort;
  columnName: string;
  valueList: string;
  allChecks: boolean;
  checks = [];
  allCompaniesCheckList = [];
  selectedCompaniesCheckList= [];
  filterData: FilterOrSortingFilter[] = [];
  companyDetails: CompanyDetails[] = [];
  companyNameList = [];
  dataNotFound = false;
  remainder: number;
  tableId='2';  // Unique table Id For Check box functionality
  globalCheckboxState: boolean=false; // All Select Boolean
  downloadDisable: boolean=false;
  private searchSubject = new Subject<number>();
  searchvalue="";
  isSearch: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  globalCheckboxStateCopy: boolean=false;
  rowPerPageSubscription: Subscription;
  constructor(public dialog: MatDialog, private paginatorName: MatPaginatorIntl,
    private detector: ChangeDetectorRef, private AuthorityPaperService: AuthorityPaperService, private entityService: EntityManagementService, private toastr: ToastrService,
    private route: Router, private appService: AppService, public  checkboxStateService: CheckboxstateService, private dashboardService:DashboardChartService,
    private activatedRoute: ActivatedRoute, private translate : TranslateService ,) {

    this.AuthorityPaperService.getResetCheckBoxValue().subscribe((value)=>{
        if(value){
          this.resetCheckboxStates();
        }
    })


    this.searchSubject .pipe(debounceTime(300)).subscribe((pageIndex: number) => {
      this.changePageIndex();
    });

    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
     const seachData = queryParams['recSearchQuery'];
      this.isSearch = queryParams['isSearch'];
      if(seachData !== undefined && this.isSearch){
        this.searchvalue = seachData.replace(/%20/g, ' ');
        this.getPurchaseCount(this.filterData, this.searchvalue);
      }else{
        this.searchvalue ="";
      }
    });
     if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

      }

  }
  ngOnDestroy(): void {
    this.checkboxStateService.resetTableCheckboxState(this.tableId);
    this.rowPerPageSubscription.unsubscribe();
  }
  dataSource = new MatTableDataSource<PurchaseHistoryDto>();
  displayedColumns: string[] = [
    'Check Box',
    'Insurance Company',
    'Total Transactions',
    'Pending Transactions',
    'View Transactions',
  ];

  shorting = false;
  insurance_Company = false;
  total_Transactions = false;
  pending_Transactions = false;

  changePage(event) {
    if (event.pageIndex != this.ZERO) {
      this.pageIndex = event.pageIndex + 1;
      this.maxLength = event.pageSize;
      this.minLength = event.pageSize * event.pageIndex;
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
    this.getTableList(this.minLength, this.maxLength,this.filterData, this.searchvalue);
  }
  maximumcount(event) {
    this.pagesize = event;
    this.maximum = this.totalLength / this.pagesize;
    this.remainder = this.totalLength % this.pagesize;
    if (this.remainder != 0) {
      this.maximum = Math.floor(this.maximum + 1);
    }
  }
  pageIndex = 1;
  // pageindex(event: any) {
  //   if (event > 0) {
  //     const end = event * 10-1;
  //     this.getTableList(end-9, end, []);
  //   }
  // }
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
      this.minLength = this.endingIndex * (this.pageIndex - 1);
      this.getTableList(this.minLength, this.maxLength,this.filterData, this.searchvalue );
      // if(!this.pageIndex){
      // }else{
      //   this.getTableList(this.minLength, this.maxLength,this.filterData, this.searchvalue );
      // }
    }else{
      // this.pageIndex = 1;
      this.minLength = 0;
      this.maxLength = 10;
      this.getTableList(this.minLength, this.maxLength,this.filterData, this.searchvalue );
    }
  }

  ngAfterViewInit() {
    if (this.dataSource != undefined && this.dataSource != null) {
      this.dataSource.paginator = this.paginator;
    }
    if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }
  }

  ngOnInit() {
    this.getPageAccessDetails();
    this.AuthorityPaperService.emitFilterVoObject.subscribe((value) => {
      if (value) {
        this.filterData = value;
        this.passingFilterVo(this.filterData);
      }
    });
    // this.getMethodForChips();
    this.AuthorityPaperService.passFilterObject(this.filterObjectArray);
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


  authorityPaperDetailsAccessDto: AccessMappingPageDto;
  purchaseHistoryPageAccessDto: AccessMappingSectionDto;
  viewHistoryPageAccessDto: AccessMappingSectionDto;

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

  getPageAccessDetails() {
    this.appService.getPageAccess(appConst.PAGE_NAME.AUTHORITY_PAPER_DETAILS.PAGE_IDENTITY).subscribe(response => {
      if (response) {
        this.authorityPaperDetailsAccessDto = response['content'];
        this.authorityPaperDetailsAccessDto.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.authorityPaperDetailsAccessDto?.sectionData);
        this.purchaseHistoryPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName === MenuSectionNames.Purchase_History_List);
        this.getPurchaseCount(this.filterData, this.searchvalue);
      }
    })
  }

  passingFilterVo(filterData: FilterOrSortingFilter[]) {
    this.columnAndIDSettingMethod(filterData);
    this.getPurchaseCount(this.filterData, this.searchvalue);
  }
  columnAndIDSettingMethod(filterData: FilterOrSortingFilter[]) {
    if (filterData != null && filterData != undefined) {
      const filterFromSearch: FilterOrSortingVo[] = filterData;
      for (const vo of filterFromSearch) {
        if (vo.valueList.length > 0 && vo.columnName === 'orderId.companyId') {
          const companyId: number[] = [];
          for (const value of vo.valueList) {
            companyId.push(this.idFindingMethod(value));
          }
          vo.intgerValueList = companyId;
          vo.valueList = [];
          vo.type = 'Integer';
        }
      }
      this.filterData = filterFromSearch;
    }
  }
  idFindingMethod(value: string): number {
    let id = 0;
    if (value) {
      const data = this.companyDetails.find(
        (element) => element.emInsName === value
      );
      id = data.emInsCompanyId;
    }
    return id;
  }

  // getMethodForChips() {
  //   let maxCount: number;
  //   this.AuthorityPaperService.getCompanyCount().subscribe((data) => {
  //     maxCount = data;
  //     this.getCompanyList(maxCount);
  //   });
  // }

  // private getCompanyList(maxCount: number) {
  //   this.AuthorityPaperService.getCompanyList(this.ZERO, maxCount).subscribe(
  //     (data: any) => {
  //       this.companyDetails = data;
  //       this.getCompanyNames(this.companyDetails);
  //       this.filterObjectArray.forEach((value) => {
  //         if (value.aliasName === 'Company Name') {
  //           value.dropdown = this.companyNameList;
  //         }
  //       });
  //     }
  //   );
  // }

  getCompanyNames(companyDetails: CompanyDetails[]) {
    if (companyDetails != undefined) {
      this.companyNameList = this.companyDetails.map(
        (value) => new String(value.emInsName)
      );
    }
  }

  @Output()
  emitObject = new EventEmitter<FilterObject[]>();

  // changePage(event){
  //   if(event.pageIndex != this.ZERO){
  //     this.maxLength= event.pageSize;
  //     this.minLength = event.pageSize *event.pageIndex;
  //     this.endingIndex = event.pageSize;
  //   }else{
  //     this.maxLength= event.pageSize;
  //     this.minLength = event.pageIndex;
  //     this.endingIndex = event.pageSize;
  //   }
  //   this.getTableList(this.minLength,this.maxLength,[]);
  // }

  // pageindex()
  // {
  //   if(this.pageIndex>=0){
  //     this.maxLength= this.endingIndex;
  //     this.minLength = this.endingIndex *this.pageIndex;
  //    this.getTableList(this.minLength,this.maxLength,[]);
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  subscribeCardDetails(min: number, max: number) { }
  shortingmethod(data: any) {
    const purchaseHistory = data;

    if (purchaseHistory === 'Insurance Company') {
      this.insurance_Company = !this.insurance_Company;
      this.total_Transactions = false;
      this.pending_Transactions = false;
      if (this.insurance_Company) {
        const columnName = 'Insurance Company';
        const filterVO: FilterOrSortingVo[] = this.setValue(
          columnName,
          this.insurance_Company
        );
        this.getPurchaseCount(filterVO, this.searchvalue);
      } else {
        const columnName = 'Insurance Company';
        const filterVO: FilterOrSortingVo[] = this.setValue(
          columnName,
          this.insurance_Company
        );
        this.getPurchaseCount(filterVO, this.searchvalue);
      }
    } else if (purchaseHistory === 'Total Transactions') {
      this.total_Transactions = !this.total_Transactions;
      this.insurance_Company = false;
      this.pending_Transactions = false;
      if (this.total_Transactions) {
        const columnName = 'Total Transactions';
        const filterVO: FilterOrSortingVo[] = this.setValue(
          columnName,
          this.total_Transactions
        );
        this.getPurchaseCount(filterVO, this.searchvalue);
      } else {
        const columnName = 'Total Transactions';
        const filterVO: FilterOrSortingVo[] = this.setValue(
          columnName,
          this.total_Transactions
        );
        this.getPurchaseCount(filterVO, this.searchvalue);
      }
    } else if (purchaseHistory === 'Pending Transactions') {
      this.pending_Transactions = !this.pending_Transactions;
      this.insurance_Company = false;
      this.total_Transactions = false;
      if (this.total_Transactions) {
        const columnName = 'Pending Transactions';
        const filterVO: FilterOrSortingVo[] = this.setValue(
          columnName,
          this.pending_Transactions
        );
        this.getPurchaseCount(filterVO, this.searchvalue);
      } else {
        const columnName = 'Pending Transactions';
        const filterVO: FilterOrSortingVo[] = this.setValue(
          columnName,
          this.pending_Transactions
        );
        this.getPurchaseCount(filterVO, this.searchvalue);
      }
    }
  }

  setValue(value: string, condition: boolean): FilterOrSortingVo[] {
    if (value != null && condition != null) {
      this.sortingVo.columnName = value;
      this.sortingVo.isAscending = condition;
      this.sortingVo.filterOrSortingType = 'SORTING';
    }
    this.filterData =[];
    this.filterData.push(this.sortingVo);
    return this.filterData;
  }
  sortingVo: FilterOrSortingVo = {
    columnName: '',
    condition: '',
    filterOrSortingType: '',
    intgerValueList: [],
    valueList: [],
    isAscending: false,
    type: '',
    value: '',
    value2: '',
  };
  viewTransactions = false;
  searchdisable = false;
  openViewTransactions(data: any) {
    this.selectedCompaniesCheckList = [];
    sessionStorage.setItem('searchdisable', this.searchdisable.toString());
    if(data.comapanyName === "All Companies"){
      this.dashboardService.getAllCompaniesId().subscribe((value:any)=>{
        if(value){
          this.selectedCompaniesCheckList = value['content'];
          this.passCompanyId(this.selectedCompaniesCheckList);
          this.route.navigate(['authority-paper-details/transaction-history']);
        }
      });
    }else{
      this.route.navigate(['authority-paper-details/transaction-history']);
      this.selectedCompaniesCheckList.push(data.companyId);
      this.passCompanyId(this.selectedCompaniesCheckList);
    }
  }

  getPurchaseCount(filterVo: FilterOrSortingVo[], searchValue:string) {

    if (this.purchaseHistoryPageAccessDto?.isView === false) {
      return;
    }
    this.pageIndex =1;
    this.AuthorityPaperService.getPurchaseHistoryCount(filterVo, searchValue).subscribe(
      (value: any) => {
        this.totalLength = value;
        const totalNUmber = this.totalLength / 10;
        if (this.isFloat(totalNUmber)) {
          this.maximum =  Math.floor(totalNUmber+1);
        }else{
          this.maximum = totalNUmber;
        }
        this.getTableList(this.ZERO, this.TEN, filterVo, this.searchvalue);
      }
    );
  }

  isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }

  getTableList(skip: number, limit: number, val: FilterOrSortingVo[], searchValue:string) {
    this.showTableData = [];
    this.purchaseHistoryListData = [];
    this.AuthorityPaperService.getPurchaseHistory(skip, limit, val, searchValue).subscribe(
      (value: any) => {
        this.purchaseHistoryListData = value;
        if (
          this.purchaseHistoryListData === null ||
          this.purchaseHistoryListData.length === 0
        ) {
          this.dataNotFound = true;
        }
         else {
          this.dataNotFound = false;
          this.downloadDisable=false;
        }

        this.AuthorityPaperService.setDownloadDisableValue(this.downloadDisable);

        this.dataSource = new MatTableDataSource<PurchaseHistoryDto>(
          this.purchaseHistoryListData
        );
      }
    );
  }

  // passing companyId to list component

  passCompanyId(companyId: any[]) {
    const arr = JSON.stringify(companyId);
    sessionStorage.setItem('companyId', arr);
  }

  filterObjectArray: FilterObject[] = [
    {
      columnName: 'orderId.companyId',
      condition: 'IN',
      aliasName: 'Purchase_history_table.insuranceCompany',
      type: 'string',
      value: null,
      dropdown: [],
      radio: [],
      dataType: null,
    },
    {
      columnName: 'Total Transactions',
      condition: 'BW',
      aliasName: 'Purchase_history_table.totalTransactions',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax: false
    },
    {
      columnName: 'Pending Transactions',
      condition: 'BW',
      aliasName: 'Purchase_history_table.pendingTransactions',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax: false
    },
  ];


  // ---------------check box functionality starts--------------------------------


  onSelectAll(){

    this.globalCheckboxState = !this.globalCheckboxState;
    this.globalCheckboxStateCopy=this.globalCheckboxState;
      this.checkboxStateService.setGlobalCheckboxState(this.globalCheckboxState);
      if(this.globalCheckboxState){
        this.dashboardService.getAllCompaniesId().subscribe((value:any)=>{
          if(value){
            this.allCompaniesCheckList=value['content'];
            this.passCompanyId(this.allCompaniesCheckList);
            this.allCompaniesCheckList.forEach(ids=>{
              this.checkboxStateService.setCheckboxState(this.tableId,ids, this.globalCheckboxState);
            })
          }
        });
      }
      else{
        this.checkboxStateService.resetTableCheckboxState(this.tableId);
        this.allCompaniesCheckList=[];
        this.passCompanyId(this.allCompaniesCheckList);
      }


  }


  toggleCheckbox(id: number): void {
       const currentState = this.checkboxStateService.getCheckboxState(this.tableId,id);

    if (this.globalCheckboxState || this.globalCheckboxStateCopy) {
      this.globalCheckboxState = false;
    }

       if(!currentState===true){
        this.checkboxStateService.setCheckboxState(this.tableId,id, !currentState);
            if(this.allCompaniesCheckList.length===0){
              this.selectedCompaniesCheckList.push(id);
              this.passCompanyId(this.selectedCompaniesCheckList);
            }
            else{
              this.allCompaniesCheckList.push(id);
              this.passCompanyId(this.allCompaniesCheckList);
            }
       }
       else{
          this.checkboxStateService.setGlobalCheckboxState(false);
          this.checkboxStateService.setCheckboxState(this.tableId,0,false);
          this.checkboxStateService.setCheckboxState(this.tableId,id,!currentState);
          if(this.allCompaniesCheckList.length===0){
                const index=this.selectedCompaniesCheckList.indexOf(id);
                this.selectedCompaniesCheckList.splice(index,1);
                this.passCompanyId(this.selectedCompaniesCheckList);
          } else {
                const index= this.allCompaniesCheckList.indexOf(id);
                this.allCompaniesCheckList.splice(index,1);
                this.passCompanyId(this.allCompaniesCheckList);
          }
       }
  }

  resetCheckboxStates(): void {
    this.globalCheckboxState = false;
    this.checkboxStateService.resetTableCheckboxState(this.tableId);
  }

  onpagebackward() {
    if (this.purchaseHistoryListData != null) {
      this.dataNotFound = false;
    }
  }
}

function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}
