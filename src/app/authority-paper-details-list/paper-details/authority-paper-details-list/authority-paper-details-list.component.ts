import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import { componentName } from 'src/app/common/enum/enum';
import { FilterObject } from 'src/app/models/Filter-dto/filter-object';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { AuthorityPaperDetailsDto } from 'src/app/models/authority-paper-details-dto/authority-paper-details-dto';
import { CompanyDetails } from 'src/app/models/company-dto';
import { FilterOrSortingFilter } from 'src/app/models/purchase-stock-dto/filter-or-sorting';
import { ExcelDownloadVo } from 'src/app/models/purchase-stock-dto/purchase-history-dto';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { CheckboxstateService } from 'src/app/service/check-box/checkboxstate.service';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
export interface PeriodicElement {
  Insured_Company: string;
  Stock_Count: string;
  Available_Stock: string;
  Papers_Issued: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { Insured_Company: 'hsdjhsa', Stock_Count: 'hsdjhsa', Available_Stock: 'hsdjhsa', Papers_Issued: 'hsdjhsa' },
  { Insured_Company: 'hsdjhsa', Stock_Count: 'hsdjhsa', Available_Stock: 'hsdjhsa', Papers_Issued: 'hsdjhsa' },
];

@Component({
  selector: 'app-authority-paper-details-list',
  templateUrl: './authority-paper-details-list.component.html',
  styleUrls: ['./authority-paper-details-list.component.scss']
})
export class AuthorityPaperDetailsListComponent implements OnInit,OnDestroy, AfterViewInit{

  excelDownloadVo = new ExcelDownloadVo;
  selectedColumn: any;
  isGotToPageDissabel = false;
  minimum = 1;
  @Input() paperDetailsPageAccessDtoFromParent: AccessMappingSectionDto;
  @Input() searchValue: string;
  downLoadDisable: boolean=false;
  @Output() isDownloadEmit= new EventEmitter<boolean>();
  @Output() isShowViewPaperBtn= new EventEmitter<boolean>();
  private searchSubject = new Subject<number>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterVoObjectSubscription: Subscription;

  columnNameSubscription: Subscription;
  globalCheckboxStateCopy: boolean=false;
  rowPerPageSubscription: Subscription;

  constructor(private authorityPaperService: AuthorityPaperService,
    private toastr: ToastrService, private paginatorName: MatPaginatorIntl, public  checkboxStateService: CheckboxstateService, private dashboardService:DashboardChartService,
    private translate : TranslateService ,private detector: ChangeDetectorRef) {
      if(this.paginatorName) {
        this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
          this.paginatorName.itemsPerPageLabel = translation;
        });

      }
    sessionStorage.setItem('companyId','');
    const downloadCompanentName = sessionStorage.getItem("componentName");

    this.authorityPaperService.getResetCheckBoxValue().subscribe((value)=>{
      this.resetCheckboxStates();
    })

    if (downloadCompanentName == componentName.PAPER_DETAILS) {
      this.excelDownloadVo.columnList = [];
      this.columnNameSubscription=this.authorityPaperService.getSelectedColumn()
      .subscribe((value) => {
        this.selectedColumn = value;
        this.excelDownload(this.minLength, this.filterVo, this.selectedColumn);
      });
    }


    this.filterVoObjectSubscription=this.authorityPaperService.getFilterValue().subscribe(value => {
      if (value) {
        this.filterData = value;
        const currentUrl =  window.location.href;
        if (currentUrl.includes('paper-details')) {
          this.passingFilterVo(this.filterData);
        }
      }
    });

    this.searchSubject .pipe(debounceTime(300)).subscribe((pageIndex: number) => {
      this.changePageIndex();
    });
  }


    ngAfterViewInit(): void {

      if(this.paginatorName) {
        this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
          this.paginatorName.itemsPerPageLabel = translation;
        });
      }
    }

  ngOnDestroy(): void {
    this.checkboxStateService.resetTableCheckboxState(this.tableId);
    this.filterVoObjectSubscription.unsubscribe();
    this.columnNameSubscription.unsubscribe();
    this.rowPerPageSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchValue'].currentValue!== undefined) {
      // this.getAuthorityPaperDetailsList(this.ZERO, this.TEN, this.filterVoObject, this.searchValue);
      this.getAuthorityPaperDetailsCount(this.filterVo);
    }

  }

  excelDownload(skip: number, val: FilterOrSortingVo[], columnList: string[]) {

    const downloadCompanentName = sessionStorage.getItem("componentName");
    const companyIdList= sessionStorage.getItem('companyId');
    let companyIds:number[]=null
    if(companyIdList!=null && companyIdList!=''){
      companyIds=JSON.parse(companyIdList);
    }
    if (downloadCompanentName == componentName.PAPER_DETAILS) {
      this.excelDownloadVo.columnList = columnList;
      this.excelDownloadVo.filterVo =this.filterData;
      this.excelDownloadVo.companyId=companyIds;
      if (this.excelDownloadVo.columnList.length !== 0) {
        this.authorityPaperService.excelDownloadForPaperDetails(this.excelDownloadVo, this.searchValue).subscribe(data => {
          if (data) {
            this.donwloadFile(data, "Paper-details.xlsx");

          } else {
            this.toastr.error(this.translate.instant('Toaster_error.Invalid_Excel'));
          }
        });
      }
    }
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
    a.download = 'Paper-details' + '.xlsx';
    document.body.appendChild(a);
    a.click();

    this.authorityPaperService.setSelectedColumn([]);
  }

  dataSource = new MatTableDataSource<AuthorityPaperDetailsDto>();

  totalLength: number;
  pagesize = 10;
  minLength: number;
  maxLength: number;
  endingIndex = 10;
  ZERO = 0;
  TEN = 10;
  dataNotFound: boolean;
  searchdisable = false;
  authorityPaperDetailsDto: AuthorityPaperDetailsDto[];
  filterVo: FilterOrSortingVo[];
   filterVoObject: FilterOrSortingVo[] = [];
  companyDetails: CompanyDetails[] = [];
  companyNameList = [];
  filterData: FilterOrSortingFilter[] = [];
  allChecks: boolean;
  checks = [];
  allCompanyChecks = [];
  selectedCompanyChecks = [];
  maximum: number;
  remainder: number;
  displayedColumns: string[] = ['Check Box', 'Insured Company', 'Stock Count', 'Available Stock', 'Papers Issued', 'View Papers'];
  tableId='1';  // Unique table Id For Check box functionality
  globalCheckboxState: boolean=false; // All Select Boolean

  ngOnInit() {
    this.getAuthorityPaperDetailsCount(this.filterVo);
    // this.authorityPaperService.emitFilterVoObject.subscribe(value => {
      
    // this.getMethodForChips();
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


  passCompanyId(companyId: any[]) {
    const arr = JSON.stringify(companyId);
    sessionStorage.setItem("companyId", arr);
  }
  passingFilterVo(filterData: FilterOrSortingFilter[]) {
    this.columnAndIDSettingMethod(filterData);
    this.getAuthorityPaperDetailsCount(this.filterData);
  }
  columnAndIDSettingMethod(filterData: FilterOrSortingFilter[]) {
    if (filterData != null && filterData != undefined) {
      const filterFromSearch: FilterOrSortingVo[] = filterData;
      for (const vo of filterFromSearch) {
        const companyId: number[] = [];
        if (vo.value !== null && vo.columnName === 'companyId') {
            // companyId.push(this.idFindingMethod(value));
            vo.type = 'String';
        }else{
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
      const data = this.companyDetails.find((element) => element.emInsName === value);
      id = data.emInsCompanyId;
    }
    return id;
  }

  openViewPapers(companyDate:any) {
    // converting a number to number array for storing array of numbers in session storage
    let companyIdArray:number[]=[];
    this.isShowViewPaperBtn.emit(false);
  if(companyDate.insuredComapny === "All Companies"){
    this.dashboardService.getPaperComapnyIds().subscribe((value:any)=>{
      if(value){
        companyIdArray= value['content'];
        this.ViewPaper.emit(companyIdArray);
        sessionStorage.setItem('componentName',componentName.PAPER_DETAILS_TRANSACTION_LIST);
      }
    });
  }else{
    companyIdArray.push(companyDate.companyId);
    this.ViewPaper.emit(companyIdArray);
  }

  }


  insurance_Company = false;
  stock_Count = false;
  available_Stock = false;
  papers_Issued = false;

  @Output()
  ViewPaper = new EventEmitter<number[]>();

  getAuthorityPaperDetailsCount(filterVo: FilterOrSortingVo[]) {

    if(this.paperDetailsPageAccessDtoFromParent.isView===false){
      return;
    }
    this.pageIndex =1;
    this.authorityPaperService.getAuthorityPaperDetailsCount(filterVo, this.searchValue).subscribe((count: any) => {
      this.totalLength = count;
      const totalNUmber = this.totalLength / 10;
      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber +1);
      }else{
        this.maximum = totalNUmber;
      }
      this.getAuthorityPaperDetailsList(this.ZERO, this.TEN, filterVo, this.searchValue);
    })
  }

  isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }

  getAuthorityPaperDetailsList(skip: number, limit: number, filterVo: FilterOrSortingVo[],searchValue:string) {
    this.authorityPaperService.getAuthorityPaperDetailsList(skip, limit,null ,filterVo,searchValue).subscribe((list: any) => {
      this.authorityPaperDetailsDto  = [];
      this.authorityPaperDetailsDto = list;
      if (this.authorityPaperDetailsDto === null || this.authorityPaperDetailsDto.length === 0) {
        this.isGotToPageDissabel = true;
        this.dataNotFound = true;
      }
      // else if(this.authorityPaperDetailsDto.length ===1){
      //   this.downLoadDisable=true;
      // }
      else {
        this.dataNotFound = false;
        this.isGotToPageDissabel=false;
        this.downLoadDisable=false;
      }
      this.emitIsDownloadValue(); // emitting downloadDisable to parent component
      this.dataSource = new MatTableDataSource<AuthorityPaperDetailsDto>(this.authorityPaperDetailsDto);
    })
  }

  emitIsDownloadValue() {
    this.isDownloadEmit.emit(this.downLoadDisable);
  }

  shortingmethod(data: any) {
    const paperDetails = data;

    if (paperDetails === 'Insurance Company') {
      this.insurance_Company = !this.insurance_Company;
      this.stock_Count = false;
      this.available_Stock = false;
      this.papers_Issued = false;
      if (this.insurance_Company) {
        const columnName = "Insurance Company";
        const filterVO: FilterOrSortingVo[] = this.setValue(columnName, this.insurance_Company);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      } else {
        const columnName = "Insurance Company";
        const filterVO: FilterOrSortingVo[] = this.setValue(columnName, this.insurance_Company);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      }
    }
    else if (paperDetails === 'Stock Count') {
      this.stock_Count = !this.stock_Count;
      this.insurance_Company = false;
      this.available_Stock = false;
      this.papers_Issued = false;
      if (this.stock_Count) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.stock_Count);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      } else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.stock_Count);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      }
    }
    else if (paperDetails === 'Available Stock') {
      this.available_Stock = !this.available_Stock;
      this.insurance_Company = false;
      this.stock_Count = false;
      this.papers_Issued = false;
      if (this.available_Stock) {
        const columnName = "Available Stock";
        const filterVO: FilterOrSortingVo[] = this.setValue(columnName, this.available_Stock);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      } else {
        const columnName = "Available Stock";
        const filterVO: FilterOrSortingVo[] = this.setValue(columnName, this.available_Stock);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      }
    }
    else if (paperDetails === 'Papers Issued') {
      this.papers_Issued = !this.papers_Issued;
      this.insurance_Company = false;
      this.stock_Count = false;
      this.available_Stock = false;
      if (this.papers_Issued) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.papers_Issued);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      } else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.papers_Issued);
        this.getAuthorityPaperDetailsCount(this.filterVoObject);
      }
    }
  }

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
  sortingEntityArray = [
    {
      tableColumnName: "Stock Count",
      entityColumnName: "stockCount",
      type: "Integer"
    },
    {
      tableColumnName: "Papers Issued",
      entityColumnName: "usedCount",
      type: "Integer"
    },
  ]

  // sorting condition method
  setSortingVO(value: string, condition: boolean) {
    const sortArray: FilterOrSortingVo[] = [];
    if (value != null && condition != null) {
      this.sortingFilterVo.columnName = value;
      this.sortingFilterVo.isAscending = condition;
      this.sortingFilterVo.filterOrSortingType = "SORTING";
      this.filterVoObject = this.filterVoObject.filter((obj) => obj.filterOrSortingType !== 'SORTING');
    }
    this.filterVoObject.push(this.sortingFilterVo);
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

  setValue(value: string, condition: boolean): FilterOrSortingVo[] {
    const sortArray: FilterOrSortingVo[] = [];
    if (value != null && condition != null) {
      this.sortingFilterVo.columnName = value;
      this.sortingFilterVo.isAscending = condition;
      this.sortingFilterVo.filterOrSortingType = "SORTING";
      this.filterVoObject = this.filterData.filter((obj) => obj.filterOrSortingType !== 'SORTING');
      this.filterVoObject.push(this.sortingFilterVo);
    }
    return this.filterVoObject;
  }


  filterObjectArray: FilterObject[] = [
    {
      columnName: 'companyId',
      condition: 'IN',
      aliasName: 'paper_details_table.insured_company',
      type: 'string',
      value:null,
      dropdown: [],
      radio: [],
      dataType: null
    },
    {
      columnName: 'stockCount',
      condition: 'BW',
      aliasName: 'paper_details_table.stock_count',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax :false
    },
    {
      columnName: 'Available Stock',
      condition: 'BW',
      aliasName: 'paper_details_table.available_stock',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax :false
    },
    {
      columnName: 'usedCount',
      condition: 'BW',
      aliasName: 'paper_details_table.papers_issued',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax :false
    },
  ];

  //for Filter
  emitFilterValue(event: FilterOrSortingVo[]) {
    const filterFromSearch: FilterOrSortingVo[] = event;
    for (let vo of filterFromSearch) {
      const type = this.getColumnType(vo.columnName);
      vo.type = type;
      if (vo.columnName === 'stockCount' || vo.columnName === 'usedCount') {
        if (vo.value == null && vo.value2 != null) {
          vo.condition = 'Le';
          vo.value=vo.value2;
          vo.value2=null;
        }
        else if (vo.value != null && vo.value2 == null) {
          vo.condition = 'Ge'
        }
      }
    }
    this.filterVoObject = filterFromSearch;
    this.getAuthorityPaperDetailsCount(this.filterVoObject);
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

  getMethodForChips() {
    let maxCount: number;
    this.authorityPaperService.getCompanyCount().subscribe((data) => {
      maxCount = data;
      this.getCompanyList(maxCount);
    });

  }

  private getCompanyList(maxCount: number) {
    this.authorityPaperService.getCompanyList(this.ZERO, maxCount).subscribe((data: any) => {
      this.companyDetails = data;
      this.getCompanyNames(this.companyDetails);
      this.filterObjectArray.forEach(value => {
        if (value.aliasName === 'Insured Company') {
          value.dropdown = this.companyNameList;
        }
      });
    });
  }

  getCompanyNames(companyDetails: CompanyDetails[]) {
    if (companyDetails != undefined) {
      this.companyNameList = this.companyDetails.map(value => new String(value.emInsName));
    }
  }

  changePage(event) {
    if (event.pageIndex != this.ZERO) {
      this.pageIndex = Math.abs(event.pageIndex + 1);
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
    this.getAuthorityPaperDetailsList(this.minLength, this.maxLength,this.filterData, this.searchValue);
  }
  maximumcount(event) {
    this.pagesize = event;
    this.maximum = Math.abs(this.totalLength / this.pagesize)
    this.remainder = Math.abs(this.totalLength % this.pagesize);
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
    if(this.pageIndex > 0) {
      if(this.pageIndex > this.maximum) {
        const numbDigit = this.maximum.toString().length;
        let numString =this.pageIndex.toString();
        numString = numString.substring(0, numbDigit);
        if(Number(numString) > this.maximum ){
          numString = this.maximum.toString();
        }
        this.pageIndex = this.maximum === 0 ? 1 : Number(numString);
      }
      this.maxLength = this.endingIndex;
      this.minLength = Math.abs(this.endingIndex * (this.pageIndex - 1));
      this.getAuthorityPaperDetailsList(this.minLength, this.maxLength, this.filterVoObject, this.searchValue);
      // if(!this.pageIndex){
      // }else{
      //   this.getAuthorityPaperDetailsList(this.minLength, this.maxLength, this.filterVoObject, this.searchValue);
      // }
    }else{
      // this.pageIndex = 1;
      this.minLength = 0;
      this.maxLength = 10;
      this.getAuthorityPaperDetailsList(this.minLength, this.maxLength, this.filterVoObject, this.searchValue);

    }
  }


  // onKeyDown(event: KeyboardEvent) {
  //   if (event.keyCode === 190) {
  //     event.preventDefault();
  //   }else  if (event.keyCode === 48) {
  //     this.pageIndex =1;
  //   }
  // }

  onpagebackward() {
    if (this.authorityPaperDetailsDto != null) {
      this.dataNotFound = false;
    }
  }

  //<_____________________Check box functionality starts_____________________________

  onSelectAll(){

    this.globalCheckboxState = !this.globalCheckboxState;
    this.globalCheckboxStateCopy=this.globalCheckboxState;
    this.checkboxStateService.setGlobalCheckboxState(this.globalCheckboxState);
    if(this.globalCheckboxState){
      this.dashboardService.getPaperComapnyIds().subscribe((value:any)=>{
        if(value){
          this.allCompanyChecks=value['content'];
          this.passCompanyId(this.allCompanyChecks);
          this.allCompanyChecks.forEach(ids=>{
            this.checkboxStateService.setCheckboxState(this.tableId,ids, this.globalCheckboxState);
          })
        }
      });
    }
    else{
      this.checkboxStateService.resetTableCheckboxState(this.tableId);
      this.allCompanyChecks=[];
      this.passCompanyId(this.allCompanyChecks);
    }
  }








  toggleCheckbox(id: number): void {
      // Data other than All Companies
       const currentState = this.checkboxStateService.getCheckboxState(this.tableId,id);

       if(this.globalCheckboxState || this.globalCheckboxStateCopy){
            this.globalCheckboxState=false;
       }

       if(!currentState===true){
        this.checkboxStateService.setCheckboxState(this.tableId,id, !currentState);
            if(this.allCompanyChecks.length===0){
              this.selectedCompanyChecks.push(id);
              this.passCompanyId(this.selectedCompanyChecks);
            }
            else{
              this.allCompanyChecks.push(id);
              this.passCompanyId(this.allCompanyChecks);
            }
       }
       else{
          this.checkboxStateService.setGlobalCheckboxState(false);
          this.checkboxStateService.setCheckboxState(this.tableId,0,false);
          this.checkboxStateService.setCheckboxState(this.tableId,id,!currentState);
          if(this.allCompanyChecks.length===0){
                const index=this.selectedCompanyChecks.indexOf(id);
                this.selectedCompanyChecks.splice(index,1);
                this.passCompanyId(this.selectedCompanyChecks);
          } else {
                const index= this.allCompanyChecks.indexOf(id);
                this.allCompanyChecks.splice(index,1);
                this.passCompanyId(this.allCompanyChecks);
          }
       }
   
  }

  resetCheckboxStates(): void {
    this.globalCheckboxState = false;
    this.checkboxStateService.resetTableCheckboxState(this.tableId);
  }

  //<_____________________Check box functionality ends_____________________________
}
