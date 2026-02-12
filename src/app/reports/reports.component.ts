import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MenuSectionNames } from '../common/enum/enum';
import { FilterOrSortingVo } from '../models/Filter-dto/filter-object-backend';
import { FileTypeEnum } from '../models/report-loss-dto/FileTypeEnum';
import { PreviewReportVo, reportCardVo } from '../models/report-loss-dto/report-loss-data';
import { AccessMappingPageDto } from '../models/user-role-management/access-Mapping-PageDto ';
import { AccessMappingSectionDto } from '../models/user-role-management/section-dto';
import { AdminService } from '../service/admin.service';
import { appConst } from '../service/app.const';
import { GenerateReportService } from '../service/generate-report.service';
import { ReportLossService } from '../service/report-loss.service';
import { AppService } from '../service/role access/service/app.service';
import { Subject, Subscription, debounceTime } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})

export class ReportsComponent implements OnInit ,AfterViewInit, OnDestroy{

  addOnBlur = true;
  panelOpenState = false;
  tableopenstate = false;
  Purchase_ID = false;
  slash = '/';
  isEditableDateField = true;
  reportdVo = new reportCardVo();

  displayedColumns: any[];
  dataSource: any;
  readonly = true;
  idPurchase = false;
  period: string;
  fromdate: string;
  SelectedTpNameList: string;
  todate: string;
  tpCompany: string[];
  selectedColumns: any[];
  claimType = [];
  TypeValue: string;
  fileTypeValue: number;
  totalcount: any;
  companylist: any;
  totalcolumn: string;
  maxDate: any;
  fileType: any[] = [
    { name: 'Excel', check: false },
    { name: 'csv', check: false },
    { name: 'Pdf', check: false }
  ];
  dateperiod: any[] = [
    { value: 'Select' },
    { value: '3 Month' },
    { value: '6 Month' },
    { value: '1 Year' }
  ];
  type: any[] = [
    { name: 'Purchase Stock', check: false },
    { name: 'Digital Paper', check: false }
  ];

  purchaseStatus = [
    { name: 'Failed', check: false },
    { name: 'Submitted', check: false },
    { name: 'Success', check: false },
     { name: 'Rejected', check: false },
    
  ];

  digitalPaperStatus = [
    { name: 'Active', check: false },
    { name: 'Expired', check: false },
    { name: 'Revoke', check: false },
    //  { name: 'Rejected', check: false },
   
  ];

  updateValue = new reportCardVo();
  separatorKeysCodes: number[];
  ColumnNameList: string[] = [];
  CompanyNameList: string[] = [];
  purchaseOrderColumnList;
  ColumnListCopy;
  dataNotFound = false;
  commonColumnList;
  digitalPaperColumnList;
  allCompanyNameListCopy;
  allCompanyNameList: string[] = [];
  identityValue: any;
  selectedValue: string[] = [];
  check = false;
  Excel = false;
  csv = false;
  theDate: any;
  pdf = false;
  reportdata: FormGroup;
  selectCompanyName: any;
  disabled = true
  pageInfo: any;
  public appConst = appConst;
  pageId = appConst.PAGE_NAME.REPORTS.PAGEID;
  receivableAmount: number = 0;
  payableAmpunt: number = 0;
  filterVo: FilterOrSortingVo[] = [];
  previewData = new PreviewReportVo();
  InsuredCompanyNameList: any;
  isGenerateReportEnabled = true;
  generateReportPageAccessDto: AccessMappingSectionDto;
  previewReportPageAccessDto: AccessMappingSectionDto;
  reportPageAccessDto: AccessMappingPageDto;
  reportTypeNumber: number;
  isAscending = false;
  totalLength: number;
  minDate: Date;
  fromMinDate = new Date();
  isEditable = false;
  totalPreviewList: any;
  ZERO = 0;
  TEN = 10
  pageIndex: number = 1;
  maxLength: number;
  minLength: number;
  endingIndex: number = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isReportGenerated: boolean=false;
  customPageIndex: number = 0;
  pageCount: number;
  currentPageIndex: number;
  pageChangedEvent = new Subject<number>();
  rowPerPageSubscription: Subscription;
  constructor(
    private getreportservice: GenerateReportService,
    private router: Router,
    private tosterservice: ToastrService,
    private activatedRoute: ActivatedRoute,
    private reportloss: ReportLossService,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private toastr: ToastrService,
    private adminService: AdminService,
    private translate: TranslateService,
    private paginatorName: MatPaginatorIntl,
    private detector: ChangeDetectorRef) {
   
    if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });

    }

    this.reportdata = this.formBuilder.group({
      fromdate: [""],
      todate: [""],
      insuranceCompany: ["", [Validators.required]],
      insuranceCompanyId: ["", [Validators.required]],
      selectedColumn: [""],
      reportType: ["", [Validators.required]],
      selectedStatus: ["", [Validators.required]],
      fileType: ["", [Validators.required]],
      reportName: ["", [Validators.required]],
      period: [""],

      // Validators.minLength(3), Validators.maxLength(50)]],
    });


  }
  ngOnDestroy(): void {
    this.rowPerPageSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {

    if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });
    }
  }
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

  sortingEntityArray = [{
    tableColumnName: "Digital Paper Number",
    entityColumnName: "pdDigitalPaperId",
    type: "String"
  },
  {
    tableColumnName: "Policy Number",
    entityColumnName: "pdPolicyNumber",
    type: "String"
  },
  {
    tableColumnName: "Insured Name",
    entityColumnName: "pdInsuredName",
    type: "String"
  },
  {
    tableColumnName: "Usage Type",
    entityColumnName: "vdUsage",
    type: "String"
  },
  {
    tableColumnName: "Effective From",
    entityColumnName: "pdEffectiveFrom",
    type: "String"
  },
  {
    tableColumnName: "Effective to",
    entityColumnName: "pdExpireDate",
    type: "Date"
  },
  {
    tableColumnName: "Email Id",
    entityColumnName: "pdEmailId",
    type: "String"
  },
  {
    tableColumnName: "Registration Number",
    entityColumnName: "vdRegistrationNumber",
    type: "String"
  },
  {
    tableColumnName: "Policy Numberpd",
    entityColumnName: "pdPolicyNumber",
    type: "String"
  },
  {
    tableColumnName: "Make",
    entityColumnName: "vdMake",
    type: "String"
  },
  {
    tableColumnName: "Chassis Number",
    entityColumnName: "vdChassis",
    type: "String"
  },
  // {
  //   tableColumnName: "Expire Date",
  //   entityColumnName:"pdExpireDate",
  //   type:"String"
  // },
  {
    tableColumnName: "Licensed to carry",
    entityColumnName: "vdLicensedToCarry",
    type: "String"
  },
  {
    tableColumnName: "status",
    entityColumnName: "status",
    type: "String"
  },
  {
    tableColumnName: "Model",
    entityColumnName: "vdModel",
    type: "String"
  },
  {
    tableColumnName: "Phone Number",
    entityColumnName: "pdPhoneNumber",
    type: "String"
  },
  // purchase order
  {
    tableColumnName: "Stock Count",
    entityColumnName: "stockCount",
    type: "Integer"
  },
  {
    tableColumnName: "Purchase Date",
    entityColumnName: "purchaseDate",
    type: "Date"
  },
  {
    tableColumnName: "Purchase ID",
    entityColumnName: "purchaseId",
    type: "String"
  },
  {
    tableColumnName: "Order Amount",
    entityColumnName: "orderAmt",
    type: "String"
  },

  {
    tableColumnName: "Order Status",
    entityColumnName: "orderStatus",
    type: "String"
  },
  {
    tableColumnName: "Payment Method",
    entityColumnName: "paymentMethod",
    type: "String"
  }

  ]
  tableDatas: string[] = ['Digital Paper Number', 'Order Status', 'Order Amount', 'Purchase ID', 'Purchase Date', 'Stock Count', 'Phone Number',
    'Model', 'status', 'Licensed to carry', 'Chassis Number', 'Make', 'Policy Numberpd', 'Registration Number', 'Email Id', 'Usage Type', 'Insured Name', 'Policy Number', 'Effective From', 'Effective to'
  ,'Payment Method'];



  shortingmethod(data: any) {
    if (this.reportdata.valid) {
    this.Purchase_ID = !this.Purchase_ID;
    if(data === "Status"){
      data ="status";
    }
    this.tableDatas.forEach(element => {
      if (element === data) {
        this.isAscending = !this.isAscending;
        if (this.isAscending) {
          const columnName = this.getEntityColumnName(data);
          this.setSortingVO(columnName, this.isAscending);
          this.getReportDataTableList();
        } else {
          const columnName = this.getEntityColumnName(data);
          this.setSortingVO(columnName, this.isAscending);
          this.getReportDataTableList();
        }
      }
    });
  }else{
    return;
  }
  }
  setSortingVO(value: string, condition: boolean) {

    const sortArray: FilterOrSortingVo[] = [];
    if (value != null && condition != null) {
      this.sortingFilterVo.columnName = value;
      this.sortingFilterVo.isAscending = condition;
      this.filterVo = [];
      this.filterVo.push(this.sortingFilterVo);
      this.previewData.filterVo = this.filterVo;
    }

  }
  getEntityColumnName(item: string): string {
    let value = ''; if (item) {
      const data = this.sortingEntityArray.find((column) => column.tableColumnName === item);
      if (data) {
        value = data.entityColumnName;
      }
    }
    return value;
  }

  editFlow = false;

  ngOnInit(): void {
    // this.displayedColumns = ['Digital Paper Number', 'Policy Number', 'Insured Name', 'Registration Number', 'Effective From', 'Effective to', 'Make', 'Model', 'Status'];
       this.displayedColumns = ['Digital Paper Number', 'Policy Number', 'Insured Name', 'Registration Number', 'Effective From', 'Effective to', 'Make & Type', 'Status'];
    this.type[1].check = true;
    this.reportTypeNumber = 1;
    this.reportdata.controls['reportType'].setValue(1);
    if (!this.checkUserIsAdmin()) {
      const insuranceCompany = sessionStorage.getItem("companyName");
      this.reportdata.controls["insuranceCompany"].setValue(insuranceCompany);
    }
    this.getPageAccess();
    this.getInsuredCompanyList();
    if (this.identityValue) {
      this.editFlow = true;
    }
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

    this.pageChangedEvent.pipe(debounceTime(300)).subscribe((data: number) => {
      this.changePageIndex();
    });
  }
  doProcess(): void {
    // this.getPrivilege();
    this.getColumnData();
    // this.activatedRoute.queryParams.subscribe(data => {
    //   this.identityValue = data['Identity'];
    //   if (this.identityValue != null) {
    //     this.getSingleValue(this.identityValue);
    //   }
    // });

    this.minLength = this.ZERO;
    this.maxLength = this.TEN;
    this.activatedRoute.queryParams.subscribe(data => {
      this.identityValue = data['Identity'];
      if (this.identityValue != null) {
        this.getSingleValue(this.identityValue);
      }
    });
  }
  generateReport() {

    if(!this.isReportGenerated){
      this.generateNewReport();
    }   

  }

  // New Report Generate Call
  generateNewReport() {
    if (!this.checkUserIsAdmin()) {
      const companyId = sessionStorage.getItem("companyId");
      this.reportdata.controls['insuranceCompanyId'].setValue(companyId);
    }
    if (this.reportdata.valid) {

      this.reportdVo.status = this.reportdata.get('selectedStatus').value;
      this.reportdVo.reportName = this.reportdata.get('reportName').value;
      this.reportdVo.insuredName = this.reportdata.get('insuranceCompany').value;
      this.reportdVo.selectedColumn = this.reportdata.get('selectedColumn').value;
      if (this.reportdata.get('selectedColumn').value === "") {
        this.reportdVo.selectedColumn = [];
      }
      this.reportdVo.reportType = this.reportTypeNumber;
      this.reportdVo.reportType = this.reportdata.get('reportType').value;
      this.reportdVo.fileType = this.reportdata.get('fileType').value;
      this.reportdVo.fileType = this.fileTypeValue;
      this.reportdVo.insuredCompanyId = this.reportdata.get('insuranceCompanyId').value;

      if (this.getdate()) {
        this.tableopenstate = true;

        if (this.fromdate > this.todate) {
          this.tosterservice.error(this.translate.instant('Toaster_error.from_to_date_validation'));
          return;
        }

        this.previewData.reportData = this.reportdVo;
        this.previewData.filterVo = this.filterVo;
        this.isReportGenerated=true;
        this.getreportservice.getReportdata(this.previewData,this.minLength,this.maxLength).subscribe(data => {

          if (data.content.dataList == undefined || data.content.dataList == null || data.content.dataList.length == 0) {
            this.dataNotFound = true;
            this.totalPreviewList = [];
            this.dataSource = new MatTableDataSource(this.totalPreviewList );
            this.tosterservice.error(this.translate.instant('Toaster_error.invalid_preview'));
            this.totalLength = 0;
          }else{

            if (this.identityValue != null) {
              this.reportdVo.identity = this.identityValue;
              this.getreportservice.updateValue(this.reportdVo).subscribe(data => {
                this.router.navigateByUrl('report-Data/reports-card');
                this.isReportGenerated=false;
              });
            } else {

              this.getreportservice.savereport(this.reportdVo).subscribe(value => {
                this.router.navigateByUrl('report-Data/reports-card');
                this.isReportGenerated=false;
              });
            }
            this.previewData.reportData = this.reportdVo;
            this.previewData.filterVo = this.filterVo;
            if (this.reportdVo.fileType == 0) {
              this.downloadReport(FileTypeEnum.EXCEL, this.previewData);
            }
            else if (this.reportdVo.fileType == 1) {
              this.downloadReport(FileTypeEnum.CSV, this.previewData)
            }
            else {
              this.downloadReport(FileTypeEnum.PDF, this.previewData)
            }
          }
        });



        // this.router.navigateByUrl('report-Data/reports-card');
      }
    } else {
      this.tosterservice.error(this.translate.instant('Toaster_error.mandatory_fields'));
    }
  }

  // inputValidation(event: any) {
  //   var charCode = (event.which) ? event.which : event.keyCode;
  //   let k;
  //   if (/^[a-zA-Z\s]*$/.test(event.key)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

  searchOptionForCompanyList(event) {
    const filterValue = event.target.value.toLowerCase();
    if (filterValue != null && filterValue != undefined && filterValue !== "") {
      let SearchList = this.commonColumnList.filter(data => data.toLowerCase().includes(filterValue));
      this.ColumnListCopy = SearchList;
    } else {
      this.ColumnListCopy = this.commonColumnList;
    }

  }

  duplicateValue = [];
  changes(event) {
    this.reportdata.controls['insuranceCompany'].setValue(event.target.value);
    const companyId = this.InsuredCompanyNameList.find(data => data.name === event.target.value);
    if (companyId) {
      this.reportdata.controls['insuranceCompanyId'].setValue(companyId.companyId);
    }
  }

  displayFn(option: any): string {
    return '';
  }

  checkUserIsAdmin() {
    return this.adminService.isAssociationUser();
  }
  previewReport() {
    if (!this.checkUserIsAdmin()) {
      const companyId = sessionStorage.getItem("companyId");
      this.reportdata.controls['insuranceCompanyId'].setValue(companyId);
    }
    if (this.fromdate > this.todate) {
      this.tosterservice.error(this.translate.instant('Toaster_error.from_to_date_validation'));
      return;
    }
    if (this.reportdata.valid) {

      this.reportdVo.status = this.reportdata.get('selectedStatus').value;
      this.reportdVo.reportName = this.reportdata.get('reportName').value;
      this.reportdVo.insuredName = this.reportdata.get('insuranceCompany').value;
      this.reportdVo.selectedColumn = this.reportdata.get('selectedColumn').value;
      if (this.reportdata.get('selectedColumn').value === "") {
        this.reportdVo.selectedColumn = [];
      }
      this.reportdVo.reportType = this.reportTypeNumber;
      this.reportdVo.fileType = this.reportdata.get('fileType').value;
      this.reportdVo.fileType = this.fileTypeValue;
      this.reportdVo.insuredCompanyId = this.reportdata.get('insuranceCompanyId').value;
      if (this.getdate()) {

        this.previewData.reportData = this.reportdVo;
        this.previewData.filterVo = this.filterVo;
        this.getReportsCount(this.previewData);
        this.getReportDataTableList();
      }
    } else {
      this.tosterservice.error(this.translate.instant('Toaster_error.mandatory_fields'));
    }
  }
   /*
  * This method is used to get the report table data list for preview
  */
  private getReportDataTableList() {
    this.getreportservice.getReportdata(this.previewData, this.minLength, this.maxLength).subscribe(data => {

      this.totalPreviewList = [];
      if (data.content.dataList == undefined || data.content.dataList == null || data.content.dataList.length == 0) {
        this.dataNotFound = true;
        this.tosterservice.error(this.translate.instant('Toaster_error.invalid_preview'));
      } else {
        this.dataNotFound = false;
        this.totalPreviewList = data.content.dataList;
      }
      this.dataSource = new MatTableDataSource(this.totalPreviewList);
      if (data.content.dataList[0] != undefined) {
        this.displayedColumns = Object.getOwnPropertyNames(data.content.dataList[0]);
      }
      this.tableopenstate = true;
    });
  }

  /*
  * This method is used to get the report count for preview
  */
  private getReportsCount(previewData: PreviewReportVo) {
    this.getreportservice.getReportDataCount(previewData).subscribe(res => {
      if (res['content']) {
        this.totalLength = res['content'];
        this.pageCount = this.totalLength;
      }
    });
  }

  changePage(event){

    if(event.pageIndex > event.previousPageIndex ){
      //previous
      this.customPageIndex = event.pageIndex+1;
    }else{
     // next
     this.customPageIndex =  this.customPageIndex-1;
    }
    if(event.pageIndex != this.ZERO){
      this.maxLength= event.pageSize;
      this.minLength = event.pageSize * event.pageIndex;
      this.endingIndex = event.pageSize;
      this.pageIndex = this.customPageIndex;
    }else{
      this.maxLength= event.pageSize;
      this.minLength = event.pageIndex;
      this.endingIndex = event.pageSize;
      this.pageIndex = event.pageIndex+1;
    }
   this.getReportDataTableList();
  }

  pageindex(): void {
    this.pageChangedEvent.next(this.pageIndex);
  }

  changePageIndex(): void {
    if (this.pageIndex > 0) {
      const totalPageIndex = this.pageCount / this.endingIndex + 1;
      if(this.pageIndex > totalPageIndex) {
        this.pageIndex = this.customPageIndex === 0 ? 1 : this.customPageIndex;
        return;
      }
      this.customPageIndex = this.pageIndex;
      this.currentPageIndex = this.pageIndex - 1;
      this.maxLength = this.endingIndex;
      this.minLength = this.endingIndex * this.currentPageIndex;
      this.getReportDataTableList();
    }else{
    // this.pageIndex = 1;        
      this.minLength = 0;
      this.maxLength = 10
      this.getReportDataTableList();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 190) {
      event.preventDefault();
    }
  }

  getColumnData() {
    if(this.generateReportPageAccessDto?.isView===false){
      return;
    }

    this.getreportservice.getPurchaseOrderColumn().subscribe((Result) => {
      this.purchaseOrderColumnList = Result.content;
    });

    this.getreportservice.getDigitalPaperColumn().subscribe(Result => {
      this.digitalPaperColumnList = Result.content;
      this.ColumnListCopy = this.digitalPaperColumnList;
      this.commonColumnList = this.digitalPaperColumnList;

    });

  }
  getInsuredCompanyList() {
    this.reportloss.getInsuredCompanyName().subscribe(Result => {
      this.InsuredCompanyNameList = Result.content;
    });
  }

  getSingleValue(identity: string) {
    this.getColumnData();
    this.isEditable = true;
    this.getreportservice.getSingleData(identity).subscribe(data => {
      this.updateValue = data.content;

      this.reportTypeNumber = this.updateValue.reportType;
      if (this.reportTypeNumber === 0) {
        this.displayedColumns = ['Purchase ID', 'Insured Name', 'Purchase Date', 'Stock Count', 'Order Amount', 'Order Status', 'Payment Method'];
        this.idPurchase = true;

        if (this.updateValue.selectedColumn != null) {
          const differentNames = this.updateValue.selectedColumn.filter(name => !this.displayedColumns.includes(name));
          this.reportdata.controls['selectedColumn'].setValue(differentNames);
          this.ColumnNameList = differentNames;
          this.displayedColumns = this.updateValue.selectedColumn;
        }
      } else {
        // this.displayedColumns = ['Digital Paper Number', 'Policy Number', 'Insured Name', 'Registration Number', 'Effective From', 'Effective to', 'Make', 'Model', 'Status'];
          this.displayedColumns = ['Digital Paper Number', 'Policy Number', 'Insured Name', 'Registration Number', 'Effective From', 'Effective to', 'Make & Type', 'Status'];
        this.ColumnListCopy = this.digitalPaperColumnList;
        this.commonColumnList = this.digitalPaperColumnList;
        this.idPurchase = false;
        if (this.updateValue.selectedColumn != null) {
          const differentNames = this.updateValue.selectedColumn.filter(name => !this.displayedColumns.includes(name));
          this.reportdata.controls['selectedColumn'].setValue(differentNames);
          this.ColumnNameList = differentNames;
          this.displayedColumns = this.updateValue.selectedColumn;
        }
      }
      this.reportdata.controls['insuranceCompany'].setValue(this.updateValue.insuredName);
      this.reportdata.controls['insuranceCompanyId'].setValue(this.updateValue.insuredCompanyId);

      if (this.updateValue.fromDate != null || this.updateValue.fromDate != undefined) {

        const day = parseInt(this.updateValue.fromDate[2], 10);
        const month = parseInt(this.updateValue.fromDate[1], 10);
        const year = parseInt(this.updateValue.fromDate[0], 10);

        const monthString = String(month).padStart(2, '0');
        const DayString = String(day).padStart(2, '0');

        let fromtd = year + '-' + monthString + '-' + DayString;
        // let fromtd = ;
        this.ready1 = true;
        this.fromdate = fromtd;
        this.reportdata.controls['fromdate'].setValue(fromtd.toString());
      }

      if (this.updateValue.toDate != null || this.updateValue.toDate != undefined) {

        const day = parseInt(this.updateValue.toDate[2], 10);
        const month = parseInt(this.updateValue.toDate[1], 10);
        const year = parseInt(this.updateValue.toDate[0], 10);

        const monthString = String(month).padStart(2, '0');
        const DayString = String(day).padStart(2, '0');

        let toTd = year + '-' + monthString + '-' + DayString;
        this.ready1 = true;
        this.todate = toTd;
        this.reportdata.controls['todate'].setValue(toTd.toString());
      }

      if(this.updateValue.period !== null){
        this.period = this.updateValue.period;
        this.reportdata.controls['period'].setValue(this.updateValue.period);
      }

      this.reportdata.controls['reportName'].setValue(this.updateValue.reportName);

      if (this.updateValue.status !== null) {
        this.reportdata.controls['selectedStatus'].setValue(this.updateValue.status);
        this.selectedValue = this.updateValue.status;

      }
      this.reportdata.controls['fileType'].setValue(this.updateValue.fileType);
      this.fileTypeValue = this.updateValue.fileType;

      this.fileType[this.updateValue.fileType].check = true;
      if(this.updateValue.reportType ===0){
        this.type[1].check = false;
      }
      this.type[this.updateValue.reportType].check = true;
      this.reportTypeNumber = this.updateValue.reportType;
      this.reportdata.controls['reportType'].setValue(this.updateValue.reportType);

      this.previewReport();
    })
  }

  remove(ListName: string): void {
    const index = this.ColumnNameList.indexOf(ListName);
    if (index >= 0) {
      this.ColumnNameList.splice(index, 1);
    }
    const i = this.displayedColumns.indexOf(ListName);
    if (i >= 0) {
      this.displayedColumns.splice(i, 1);
    }
  }

  isSelected(value: string): boolean {
    return this.selectedValue.includes(value);
  }

  toggleSelection(value: string): void {
    const index = this.selectedValue.indexOf(value);
    if (index > -1) {
      this.selectedValue.splice(index, 1);
    } else {
      this.selectedValue.push(value);
    }
    this.reportdata.controls['selectedStatus'].setValue(this.selectedValue);
  }

  selectedColumn(event): void {
    const selectedColumn = this.ColumnListCopy[event.option.value];
    this.ColumnNameList.forEach(function (item) {
      if (item === selectedColumn) {
        this.ColumnNameList.splice(selectedColumn);
      }
    });

    this.displayedColumns.forEach(function (item) {
      if (item === selectedColumn) {
        this.displayedColumns.splice(selectedColumn);
      }
    })   
    this.ColumnNameList.push(selectedColumn);
    this.reportdata.controls['selectedColumn'].setValue(this.ColumnNameList);
    this.displayedColumns.push(selectedColumn);
    this.selectedColumns = this.ColumnNameList;
    this.totalcolumn = this.ColumnNameList.length.toString();
  }

  SelectFileType(value: string) {
    if (value === 'Excel') {

      this.fileType[0].check = true;
      this.fileType[1].check = false;
      this.fileType[2].check = false;
      this.fileTypeValue = 0;
    }
    else if (value === 'csv') {

      this.fileType[1].check = true;
      this.fileType[2].check = false;
      this.fileType[0].check = false;
      this.fileTypeValue = 1;
    }
    else if (value === 'Pdf') {

      this.fileType[2].check = true;
      this.fileType[0].check = false;
      this.fileType[1].check = false;
      this.fileTypeValue = 2;
    }
    this.reportdata.controls['fileType'].setValue(this.fileTypeValue);
  }

  getdate(): boolean {
    if (!(this.period == null || this.period == undefined || this.period == 'Select')) {
      this.reportdVo.period = this.period
      this.reportdVo.fromDate = null;
      this.reportdVo.toDate = null;
      return true;
    }
    else if (this.fromdate != null || this.fromdate != undefined && this.todate != null || this.todate != undefined) {
      this.reportdVo.fromDate = new Date(this.reportdata.get('fromdate').value);

      let defaultTimeHours = 6; // Example: 9 AM
      const defaultTimeMinutes = 0;
      const defaultTimeSeconds = 0;

      this.reportdVo.fromDate.setHours(defaultTimeHours, defaultTimeMinutes, defaultTimeSeconds);
      this.reportdVo.toDate = new Date(this.reportdata.get('todate').value);
      defaultTimeHours = 28;
      this.reportdVo.toDate.setHours(defaultTimeHours, defaultTimeMinutes, defaultTimeSeconds);
      this.reportdVo.period = null;
      return true;
    } else {
      this.reportdVo.period = null;
      this.reportdVo.fromDate = null;
      this.reportdVo.toDate = null;
      this.tosterservice.error(this.translate.instant('Toaster_error.invalid_date_field'));
      return false;
    }

  }
  reportType(name: any) {
    this.selectedValue = [];
    this.reportdata.controls['selectedStatus'].setValue(this.selectedValue);
    this.dataSource = new MatTableDataSource(this.selectedValue);
    if (name === "Purchase Stock") {
      this.reportTypeNumber = 0;
      this.type[1].check = false;
      this.type[0].check = true;
      this.ColumnNameList = [];
      this.ColumnListCopy = [];
      this.commonColumnList = [];
      this.idPurchase = true;
      this.displayedColumns = ['Purchase ID', 'Insured Name', 'Purchase Date', 'Stock Count', 'Order Amount', 'Order Status', 'Payment Method'];
      this.reportdata.controls['reportType'].setValue(this.reportTypeNumber);
    } else if (name === "Digital Paper") {
      this.reportTypeNumber = 1;
      this.type[1].check = true;
      this.type[0].check = false;
      this.ColumnNameList = [];
      // this.displayedColumns = ['Digital Paper Number', 'Policy Number', 'Insured Name', 'Registration Number', 'Effective From', 'Effective to', 'Make', 'Model', 'Status'];
        this.displayedColumns = ['Digital Paper Number', 'Policy Number', 'Insured Name', 'Registration Number', 'Effective From', 'Effective to', 'Make & Type', 'Status'];
      this.ColumnListCopy = this.digitalPaperColumnList;
      this.commonColumnList = this.digitalPaperColumnList;
      this.idPurchase = false;
      this.reportdata.controls['reportType'].setValue(this.reportTypeNumber);
    }
  }

  ready = false;
  ready1 = true;

  showDate(data: any) {
    if (data == "Select") {
      this.ready = false;
    }
    else {
      this.period = data;
      this.fromdate = null;
      this.todate = null;
      this.ready = true;
      this.fromdate = null;
      this.todate = null;
    }

  }

  setFromDate(data: any) {
    if (data != null) {
      this.minDate = new Date(data);
      this.fromdate = this.parseDate(data);
      if (this.fromdate) {
        this.ready1 = true;
        this.period = null;
      }
    }

  }
  setToDate(data: any) {
    if (data != null) {
      this.todate = this.parseDate(data);
      if (this.todate) {
        this.ready1 = true;
        this.period = null;
      }
    }
  }

  parseDate(selectedDate: string): string {
    const date = new Date(selectedDate);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }
  /**
  * REPORT - DOWNLOAD
  */
  private downloadReport(downloadType: string, data: PreviewReportVo) {
    if (data.reportData.fileType == 0) {
      this.getreportservice.getByteSourceForExcelReport(data).subscribe(response => {
        if (response.size === 0) {
          this.toastr.error(this.translate.instant('Toaster_error.invalid_report_generate_download'));
        } else {
          this.donwloadFile(response, data.reportData.reportName, FileTypeEnum.EXCEL);
        }
      })
    }
    else if (data.reportData.fileType == 1) {
      this.getreportservice.getByteSourceForCsvReport(data).subscribe(response => {
        if (response.size === 0) {
          this.toastr.error(this.translate.instant('Toaster_error.invalid_report_generate_download'));

        } else {
          this.donwloadFile(response, data.reportData.reportName, FileTypeEnum.CSV);
        }
      })
    } else {
      this.getreportservice.getByteSourceForPdfReport(data).subscribe(response => {
        if (response.size === 0) {
          this.toastr.error(this.translate.instant('Toaster_error.invalid_report_generate_download'));
        } else {
          this.donwloadFile(response,data.reportData.reportName, FileTypeEnum.PDF);
        }
      })
    }
  }
  /**
   *
   * @param value
   * @param downloadType
   */
  private donwloadFile(value: any, downloadType: string, donloadType: string) {
    const blob = new Blob([value], { type: donloadType });
    const downloadLink = document.createElement('a');
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
    downloadLink.setAttribute('download', downloadType);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  getPrivilege(): void {
    this.appService.getPrivilegeForPage(this.pageId).subscribe((res: any) => {
      this.pageInfo = res.content;
      this.getPageInfo(this.pageId);
    });
  }

  getPageInfo(pageID: number): boolean {
    if (this.pageInfo != null || this.pageInfo !== undefined) {
      const pageValue = this.pageInfo && (this.pageInfo.length === 0 || this.pageInfo.find((element: any) => element.pageId === pageID));
      return pageValue;
    } else {
      return true;
    }
  }

  checkPrivillege(privillegeName: string): boolean {
    let isEnabled = true;
    if (this.pageInfo && this.pageInfo.length > 0) {
      const privillege = this.pageInfo.find((prv: any) => prv.privilegeName === privillegeName);
      isEnabled = privillege.isEnabled;
    }
    return isEnabled;
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


  getPageAccess(): void {
    this.appService.getPageAccess(appConst.PAGE_NAME.REPORTS.PAGE_IDENTITY).subscribe((response: any) => {
      this.reportPageAccessDto = response.content;
      this.reportPageAccessDto.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.reportPageAccessDto?.sectionData);
      this.generateReportPageAccessDto = this.reportPageAccessDto.sectionData.find(x => x.sectionName ===MenuSectionNames.Generate_Reports)
      this.previewReportPageAccessDto = this.reportPageAccessDto.sectionData.find(x => x.sectionName ===MenuSectionNames.Preview_Report)

      this.isGenerateReportEnabled = this.reportPageAccessDto.isEnabled;
      if (this.isGenerateReportEnabled) {
        this.doProcess();
      }
    });
  }

}
