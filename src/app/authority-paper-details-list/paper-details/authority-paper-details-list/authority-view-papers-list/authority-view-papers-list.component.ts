import { Component, Input, OnInit, SimpleChanges, OnChanges, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import { componentName } from 'src/app/common/enum/enum';

import { FilterObject } from 'src/app/models/Filter-dto/filter-object';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { CompanyDetails } from 'src/app/models/company-dto';
import { CompanyDto } from 'src/app/models/entity-management-dto/insurance-company';
import { PaperDetailsListDto } from 'src/app/models/paper-details-dto/paper-details-list-dto';
import { FilterOrSortingFilter } from 'src/app/models/purchase-stock-dto/filter-or-sorting';
import { ExcelDownloadVo } from 'src/app/models/purchase-stock-dto/purchase-history-dto';
import { CompanyTransaction } from 'src/app/models/purchase-stock-dto/transaction-dto';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { ViewPaperDetailsPopupComponent } from 'src/app/paper-details-list/view-paper-details-popup/view-paper-details-popup.component';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
export interface PeriodicElement  {
  Digital_Paper_No: string;
  Company_Name: string;
  Policy_No: string;
  Insured_Name: string;
  Registration_No: string;
  Effective_From: string;
  Effective_to: string;
  status: string;

}


const ELEMENT_DATA: PeriodicElement[] = [
  {Digital_Paper_No:'1',Company_Name:'hsdjhsa',Policy_No:'hsdjhsa',Insured_Name:'hsdjhsa',Registration_No:'hsdjhsa',Effective_From:'hsdjhsa',Effective_to:'hsdjhsa',status:'Active'},

];
@Component({
  selector: 'app-authority-view-papers-list',
  templateUrl: './authority-view-papers-list.component.html',
  styleUrls: ['./authority-view-papers-list.component.scss']
})
export class AuthorityViewPapersListComponent  implements OnInit, OnChanges,AfterViewInit, OnDestroy{
  dataSource = new MatTableDataSource<PaperDetailsListDto>();
  paperDetailsDto: PaperDetailsListDto;
  paperDetails: PaperDetailsListDto[];
  companyList:string[]=[];
  isGotToPageDissabel=false;
  companyId:number[]=[];
  companyDetails=new CompanyTransaction();
  companyDetail:CompanyDto[]=[];
  filterObject: FilterObject[];
  paperDetailsDtoList = new PaperDetailsListDto();
 @Input() filterFromParent:FilterOrSortingVo[];
 @Input() searchValueForViewPaper:string;
  totalLength: number;
  pagesize = 10;
  minLength=0;
  maxLength=10;
  endingIndex = 10;
  ZERO = 0;
  TEN = 10;
  maximum : number;
  remainder : number;
  dataNotFound = false;
  filterVoObject: FilterOrSortingVo[]=[];
  filterData: FilterOrSortingFilter[] = [];
  excelDownloadVo = new ExcelDownloadVo;
  selectedColumn:any;
  @Input() viewPapersPageAccessDtoFromParent:AccessMappingSectionDto;
  viewType=null;
  currentUrl: string;
  private searchSubject = new Subject<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  columnNameSubscription: Subscription;
  rowPerPageSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private authorityPaperService : AuthorityPaperService,
    private toastr: ToastrService,private paginatorName: MatPaginatorIntl,
    private traslate : TranslateService,private detector: ChangeDetectorRef

   ){
    if(this.paginatorName) {
      this.rowPerPageSubscription=this.traslate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }

   this.companyId = JSON.parse(sessionStorage.getItem('companyId'));
   this.currentUrl =  window.location.href;

   if(this.currentUrl.includes('/recent')){
    this.viewType='recent';
  }
  //  this.companyDetails.companyId = JSON.parse(localStorage.getItem('companyId'));
    // if(this.companyDetails.companyId === null || this.companyDetails.companyId === undefined) {
    //   this.dataNotFound = true;
    // }s
    this.authorityPaperService.ClickAdd$.subscribe(value=>{
      if(value){
        this.ngOnDestroy();
      }
    });

    const downloadCompanentName =  sessionStorage.getItem("componentName");
    if(downloadCompanentName== componentName.PAPER_DETAILS_TRANSACTION_LIST){

    this.excelDownloadVo.columnList = [];
    this.selectedColumn =[];
    this.columnNameSubscription=this.authorityPaperService.getSelectedColumn()
    .subscribe((value) => {
      this.selectedColumn = value;
      this.excelDownload(this.minLength, this.filterVoObject, this.selectedColumn);
    });
  }

  this.searchSubject.pipe(debounceTime(300)).subscribe((pageIndex: number) => {
    this.changePageIndex();
  });

  }



  ngOnInit(): void {
    this.authorityPaperService.emitFilterVoObject.subscribe(value => {
      if (value) {
        this.filterData = value;
         this.currentUrl =  window.location.href;
        if (this.currentUrl.includes('/paper-details')) {
          this.passingFilterVo(this.filterData);
        }
      }
    });

    this.getMethodForChips();
    this.authorityPaperService.passFilterObject(this.filterObjectArray);
    this.companyDetails.companyId=this.companyId;
    this.getAuthPaperDetailsCount();
    this.traslate.onLangChange.subscribe(() => {
      if (this.paginator) {
        this.paginator._intl.itemsPerPageLabel = this.traslate.instant('Paginator.ItemsPerPageLabel');
        this.paginator._intl.firstPageLabel=this.traslate.instant('Paginator.FirstPage');
        this.paginator._intl.lastPageLabel=this.traslate.instant('Paginator.LastPage');
        this.paginator._intl.nextPageLabel=this.traslate.instant('Paginator.NextPage');
        this.paginator._intl.previousPageLabel=this.traslate.instant('Paginator.PreviousPage');
        this.paginator._changePageSize(this.paginator.pageSize);
        this.detector.detectChanges();
      }
    });
    if(this.paginatorName) {
      this.rowPerPageSubscription=this.traslate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });
    }
  }
  ngAfterViewInit(): void {

    if(this.paginatorName) {
      this.rowPerPageSubscription=this.traslate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }
  }

  excelDownload(skip: number, val: FilterOrSortingVo[], columnList: string[]) {

    const downloadCompanentName =  sessionStorage.getItem("componentName");
    if(downloadCompanentName== componentName.PAPER_DETAILS_TRANSACTION_LIST){

    this.excelDownloadVo.columnList = columnList;
    this.excelDownloadVo.filterVo = val;
    this.excelDownloadVo.companyId=this.companyId;
    if (this.excelDownloadVo.columnList.length !== 0) {
      this.authorityPaperService.excelDownloadForPaperDetailsTransactionList(this.excelDownloadVo, this.searchValueForViewPaper).subscribe(data => {
        if (data) {
          this.donwloadFile(data, "Paper-details.xlsx");

        } else {
          this.toastr.error(this.traslate.instant('Toaster_error.Invalid_Excel'));
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
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("companyId");
    sessionStorage.removeItem('ViewPaper');
    this.columnNameSubscription.unsubscribe();
    this.rowPerPageSubscription.unsubscribe();
  }

  /*
  *
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterFromParent']?.currentValue!== undefined) {
        this.emitFilterValue(this.filterFromParent);
    }
    if (changes['searchValueForViewPaper']?.currentValue!== undefined) {
      this.companyDetails.max = this.maxLength;
      this.companyDetails.min = this.minLength;
     this.getAuthPaperDetailsCount();
  }
  }

  private getAuthPaperDetailsCount() {
    // this.companyDetails.companyId=this.companyIdListFromParent;
    if(this.viewPapersPageAccessDtoFromParent.isView===false){
      return;
    }
    if (this.companyDetails!==null) {
      this.dataNotFound = false;
      this.companyDetails.view=this.viewType;
      this.pageIndex=1;
      this.authorityPaperService.getAuthPaperDetailsCount(this.companyDetails, this.searchValueForViewPaper).subscribe((comId: any) => {
        this.totalLength = comId;
        const totalNUmber = this.totalLength / 10;
      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }
        this.companyDetails.min = this.ZERO;
        this.companyDetails.max = this.TEN;
        this.getAuthPaperDetailsList(this.companyDetails,this.searchValueForViewPaper);
      });
    }else{
      this.dataNotFound = true;
    }
  }

  isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }

     getMethodForChips() {
      this.authorityPaperService.getCompanyDto().subscribe((data: any) => {
        this.companyDetail = data;
        this.getCompanyNames(this.companyDetail);
        this.filterObjectArray.forEach(value => {
          if (value.columnName === 'companyId') {
            value.dropdown = this.companyList;
          }
        });
        this.filterObject = this.filterObjectArray;
      });
    }

getCompanyNames(companyDetails:CompanyDto[]){
  if(companyDetails!=undefined){
    this.companyList=this.companyDetail.map(value=>value.name);
  }
}
  getAuthPaperDetailsList(companyDetails: CompanyTransaction, searchValueForViewPaper:string) {
    if(this.companyDetails.view===undefined || this.companyDetails.view===null){
      this.companyDetails.view=this.viewType;
    }
    this.authorityPaperService.getAuthPaperDetailsList(companyDetails, searchValueForViewPaper).subscribe((result:any)=>{
      this.paperDetails = [];
      this.paperDetails = result;
      if (this.paperDetails === null || this.paperDetails.length === 0) {
        this.isGotToPageDissabel = true;
        this.dataNotFound = true;
      }else if(this.paperDetails.length <=9){
        this.isGotToPageDissabel = true;
        this.dataNotFound = false;
      }
      else{
        this.isGotToPageDissabel = false;
        this.dataNotFound = false;
      }
      this.dataSource = new MatTableDataSource<PaperDetailsListDto>(this.paperDetails);
    })
  }


  passingFilterVo(filterData: FilterOrSortingFilter[]) {
    this.emitFilterValue(filterData);
    this.columnAndIDSettingMethod(this.filterVoObject);
  }
  columnAndIDSettingMethod(filterData: FilterOrSortingFilter[]) {
    if (filterData != null && filterData != undefined) {
      const filterFromSearch: FilterOrSortingVo[] = filterData;
      for (const vo of filterFromSearch) {
        if (vo.valueList.length > 0 && vo.columnName === 'companyId') {
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
      this.companyDetails.filter=this.filterData;
    }
    this.companyDetails.min=this.ZERO;
    this.companyDetails.max=this.TEN;
    this.getAuthPaperDetailsCount();
  }
  idFindingMethod(value: string): number {
    let id = 0;
    if (value) {
      const data = this.companyDetail.find((element) => element.name === value);
      id = data.companyId;
    }
    return id;
  }
  displayedColumns: string[] = ['Digital Paper No', 'Company Name','Policy No' ,'Insured Name', 'Registration No', 'Effective From','Effective to', 'Status','View'];

  digital_paper_no=false;
  company_name=false;
  policy_no=false;
  insured_name=false;
  registration_no=false;
  effective_from=false;
  effective_to=false;
  status=false;


  shortingmethod(data: any) {
    const viewPapers = data;
    if(viewPapers==='Digital Paper No')
    {
      this.digital_paper_no=!this.digital_paper_no;
      this.company_name=false;
      this.policy_no=false;
      this.insured_name=false;
      this.registration_no=false;
      this.effective_from=false;
      this.effective_to=false;
      this.status=false;
      if(this.digital_paper_no) {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.digital_paper_no);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      } else {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.digital_paper_no);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }
    }
    else if(viewPapers==='Company Name')
    {
      this.company_name=!this.company_name;
      this.digital_paper_no=false;
      this.policy_no=false;
      this.insured_name=false;
      this.registration_no=false;
      this.effective_from=false;
      this.effective_to=false;
      this.status=false;
      if(this.company_name) {
        const columnName = "companyId";
        const filterVO: FilterOrSortingVo[] = this.setValue(columnName, this.company_name);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      } else {
        const columnName = "companyId";
        const filterVO: FilterOrSortingVo[] = this.setValue(columnName, this.company_name);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }
    }
    else if(viewPapers==='Policy No')
    {
      this.policy_no=!this.policy_no;
      this.digital_paper_no=false;
      this.company_name=false;
      this.insured_name=false;
      this.registration_no=false;
      this.effective_from=false;
      this.effective_to=false;
      this.status=false;
      if(this.policy_no) {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.policy_no);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }else {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.policy_no);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }

    }
    else if(viewPapers==='Insured Name')
    {
      this.insured_name=!this.insured_name;
      this.digital_paper_no=false;
      this.company_name=false;
      this.policy_no=false;
      this.registration_no=false;
      this.effective_from=false;
      this.effective_to=false;
      this.status=false;
      if(this.insured_name) {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.insured_name);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      } else {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.insured_name);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }
    }
    else if(viewPapers==='Registration No')
    {
      this.registration_no=!this.registration_no;
      this.digital_paper_no=false;
      this.company_name=false;
      this.policy_no=false;
      this.insured_name=false;
      this.effective_from=false;
      this.effective_to=false;
      this.status=false;
      if(this.registration_no) {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.registration_no);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }else {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.registration_no);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }
    }
    else if(viewPapers==='Effective From')
    {
      this.effective_from=!this.effective_from;
      this.digital_paper_no=false;
      this.company_name=false;
      this.policy_no=false;
      this.insured_name=false;
      this.registration_no=false;
      this.effective_to=false;
      this.status=false;
      if(this.effective_from) {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.effective_from);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }else {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.effective_from);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }
    }
    else if(viewPapers==='Effective to')
    {
      this.effective_to=!this.effective_to;
      this.digital_paper_no=false;
      this.company_name=false;
      this.policy_no=false;
      this.insured_name=false;
      this.registration_no=false;
      this.effective_from=false;
      this.status=false;
      if(this.effective_to) {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.effective_to);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }else {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.effective_to);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }
    }
    else if(viewPapers==='Status')
    { this.status=!this.status;
      this.digital_paper_no=false;
      this.company_name=false;
      this.policy_no=false;
      this.insured_name=false;
      this.registration_no=false;
      this.effective_from=false;
      this.effective_to=false;
      // eslint-disable-next-line no-cond-assign
      if(this.status=!this.status) {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.status);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
      }else {
        const columnName = this.getEntityColumnName(viewPapers);
        this.setSortingVO(columnName, this.status);
        this.companyDetails.min=this.minLength;
        this.companyDetails.max=this.maxLength;
        this.getAuthPaperDetailsCount();
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
        tableColumnName: "Digital Paper No",
        entityColumnName: "pdDigitalPaperId",
        type: "String"
      },
      {
        tableColumnName: "Policy No",
        entityColumnName: "pdPolicyNumber",
        type: "String"
      },
      {
        tableColumnName: "Insured Name",
        entityColumnName: "pdInsuredName",
        type: "String"
      },
      {
        tableColumnName: "Registration No",
        entityColumnName: "vdRegistrationNumber",
        type: "String"
      },
      {
        tableColumnName: "Effective From",
        entityColumnName: "pdEffectiveFrom",
        type: "Date"
      },
      {
        tableColumnName: "Effective to",
        entityColumnName: "pdExpireDate",
        type: "Date"
      },
      {
        tableColumnName: "Status",
        entityColumnName: "status",
        type: "String"
      },

    ];

      // sorting condition method
  setSortingVO(value: string, condition: boolean) {
    const sortArray: FilterOrSortingVo[] = [];
    if (value != null && condition != null) {
      this.sortingFilterVo.columnName = value;
      this.sortingFilterVo.isAscending = condition;
      this.sortingFilterVo.filterOrSortingType = "SORTING";
      this.filterVoObject.push(this.sortingFilterVo);
    }
    this.companyDetails.filter= this.filterVoObject;
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
        // this.filterVO = this.filterVO.filter((obj)=> obj.filterOrSortingType !== 'SORTING' );
        this.filterVoObject.push(this.sortingFilterVo);
      }
      return  this.companyDetails.filter= this.filterVoObject;
    }

    filterObjectArray: FilterObject[]=[
      {
        columnName:'pdDigitalPaperId',
        condition:'Like',
        aliasName: 'paper_details_view_table.digital_paper_no',
        type: 'field',
        value: [],
        dropdown: [],
        radio: [],
        dataType:null
      },
      {
        columnName: 'companyId',
        condition: 'IN',
        aliasName: 'paper_details_view_table.company_name',
        type: 'chips',
        value: [],
        dropdown: [],
        radio: [],
        dataType: null
      },
      {
        columnName:'pdPolicyNumber',
        condition:'Like',
        aliasName: 'paper_details_view_table.policy_no',
        type: 'field',
        value: [],
        dropdown: [],
        radio: [],
        dataType:null
      },
      {
        columnName:'pdInsuredName',
        condition:'Like',
        aliasName: 'paper_details_view_table.insured_name',
        type: 'field',
        value: [],
        dropdown: [],
        radio: [],
        dataType:null
      },
      {
        columnName:'vdRegistrationNumber',
        condition:'Like',
        aliasName: 'paper_details_view_table.registration_no',
        type: 'field',
        value: [],
        dropdown: [],
        radio: [],
        dataType:null
      },
      // {
      //   columnName:'pdEffectiveFrom',
      //   condition:'BW',
      //   aliasName: 'paper_details_view_table.effective_from',
      //   type: 'dates',
      //   value: [],
      //   dropdown: [],
      //   radio: [],
      //   dataType:null
      // },
      {
        columnName:'pdExpireDate',
        condition:'BW',
        aliasName: 'Paper_Details_table_list.effective_date',
        type: 'dates',
        value: [],
        dropdown: [],
        radio: [],
        dataType:null
      },

      {
        columnName:'status',
        condition:'IN',
        aliasName: 'paper_details_view_table.status',
        type: 'chips',
        value: [],
        dropdown: ['Active','Expired','Revoked','Rejected'],
        radio: [],
        dataType:null
      },
    ];

          //for Filter
  emitFilterValue(event: FilterOrSortingVo[]) {
    const filterFromSearch: FilterOrSortingVo[] = event;
    let effectiveFromValue=null;
    let effectiveTo=null;
    let condition=null
    for (const vo of filterFromSearch) {
      const type = this.getColumnType(vo.columnName);
      vo.type = type;
        if(vo.columnName==='pdExpireDate'){

          if(vo.value && vo.value2===null){
            vo.condition='Ge'
          }
          else if(vo.value===null && vo.value2){
              vo.condition='Le';
              vo.value=vo.value2;
              vo.value2=null
          }

              effectiveFromValue=vo.value;
              effectiveTo=vo.value2;
              condition=vo.condition
        }
      }
    let effectiveFromFilter= new FilterOrSortingVo();
    effectiveFromFilter.columnName='pdEffectiveFrom';
    effectiveFromFilter.condition=condition;
    effectiveFromFilter.filterOrSortingType='FILTER'
    effectiveFromFilter.value=effectiveFromValue;
    effectiveFromFilter.value2=effectiveTo;
    effectiveFromFilter.type='Date'
    filterFromSearch.push(effectiveFromFilter);
    this.filterVoObject = filterFromSearch;

  }

  getColumnType(item:string):string{
    let type='';
    if(item){
      const data = this.sortingEntityArray.find((column) => column.entityColumnName === item);
      if(data) {
        type = data.type;
      }
    }
    return type;
  }


  openViewPopup(data:any): void {
    this.authorityPaperService.getPaperDetailsData(data.identity).subscribe((result:any)=>{
      this.paperDetails=result;

      const dialogRef = this.dialog.open(ViewPaperDetailsPopupComponent, {
        width: '1150px',
        // height: '530px',
        data: {
          revokeData: this.paperDetails
         }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.getAuthPaperDetailsList(this.companyDetails,this.searchValueForViewPaper);
      });
    })


  }

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
    this.companyDetails.min=this.minLength;
    this.companyDetails.max=this.maxLength;
    this.getAuthPaperDetailsList(this.companyDetails,this.searchValueForViewPaper);
  }

  maximumcount(event) {
    this.pagesize = event;
    this.maximum = this.totalLength / this.pagesize
    this.remainder = this.totalLength % this.pagesize;
    if (this.remainder != 0) {
      this.maximum =  Math.floor(this.maximum + 1);
    }
  }

  pageIndex=1;
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
      this.companyDetails.max = this.maxLength;
      this.companyDetails.min = this.minLength;
      this.getAuthPaperDetailsList(this.companyDetails,this.searchValueForViewPaper);
      // if(!this.pageIndex){
      //   this.getAuthPaperDetailsList(this.companyDetails,this.searchValueForViewPaper);
      // }else{
      // }
    }else{
      // this.pageIndex = 1;
      this.minLength  = 0;
      this.maxLength = 10;
      this.getAuthPaperDetailsList(this.companyDetails,this.searchValueForViewPaper);
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
    if (this.paperDetailsDto != null) {
      this.dataNotFound = false;
    }
  }
}
