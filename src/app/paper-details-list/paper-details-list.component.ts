import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ViewPaperDetailsPopupComponent } from './view-paper-details-popup/view-paper-details-popup.component';
import { PaperDetailsListDto } from '../models/paper-details-dto/paper-details-list-dto';
import { RevokeDigitalPaperPopupComponent } from './revoke-digital-paper-popup/revoke-digital-paper-popup.component';
import { AuthorityPaperService } from '../service/authority-paper.service';
import { FilterOrSortingVo } from '../models/Filter-dto/filter-object-backend';
import { MatTableDataSource } from '@angular/material/table';
import { FilterObject } from '../models/Filter-dto/filter-object';
import { FileTypeEnum } from '../models/report-loss-dto/FileTypeEnum';
import { ToastrService } from 'ngx-toastr';
import { BulkRevokeService } from '../service/paper-details/bulk-revoke';
import { PaperService } from '../service/paper-details/paper-service.service';
import { PaperDetailService } from '../service/paper-details.service';
import { Observable, Subject, Subscription, debounceTime, zip } from 'rxjs';
import { AppService } from '../service/role access/service/app.service';
import { appConst } from '../service/app.const';
import { AccessMappingSectionDto } from '../models/user-role-management/section-dto';
import { JsonService } from '../service/json.service';
import { MenuSectionNames } from '../common/enum/enum';
import { CheckboxstateService } from '../service/check-box/checkboxstate.service';
import { ExcelDownloadVo } from '../models/purchase-stock-dto/purchase-history-dto';
import { TranslateService } from '@ngx-translate/core';
// const ELEMENT_DATA: PaperDetailsListDto[] = [
//   {policyNumber: "DP73345", paperNumber: 'PN2262782323', insuredName: 'jenny wilson', registrationNumber: 'RN43359392A',effectiveFrom:'10/01/2023',effectiveTo:'10/02/2022',status:"Active"},
//   {policyNumber: "DP73345", paperNumber: 'PN2262782323', insuredName: 'jenny wilson', registrationNumber: 'RN43359392A',effectiveFrom:'10/01/2023',effectiveTo:'10/02/2022',status:"Revoked"},
//   {policyNumber: "DP73345", paperNumber: 'PN2262782323', insuredName: 'jenny wilson', registrationNumber: 'RN43359392A',effectiveFrom:'10/01/2023',effectiveTo:'10/02/2022',status:"Expired"},

// ];
@Component({
  selector: 'app-paper-details-list',
  templateUrl: './paper-details-list.component.html',
  styleUrls: ['./paper-details-list.component.scss']
})
export class PaperDetailsListComponent implements OnInit,OnDestroy,AfterViewInit{

  dataSource = new MatTableDataSource<PaperDetailsListDto>();
  filterVo: FilterOrSortingVo[]=[];
  filterVoObject: FilterOrSortingVo[]=[];
  paperDetailsDto: PaperDetailsListDto[];
  dataNotFound: boolean;
  Digital_Paper_No = false;
  Policy_No = false;
  Insured_Name= false;
  Registration_NO = false;
  Effective_From = false;
  Effective_to = false;
  Status= false;
  maximum : number;
  remainder : number;
  generateUpload: boolean;
  isGotToPageDissabel=false;
  generateRevoke: boolean;
  searchdisable = false;
  currentComponentName: string;
  downloadclose: boolean;
  columnList: string[];
  allSelectCheckList: PaperDetailsListDto[]=[];  // If select all check box clicks, it got pushed.
  eachSelectCheckList:PaperDetailsListDto[]=[];      // If each paper is selected individually, it got pushed.
  finalCheckOutputList: PaperDetailsListDto[];     // After our desired selections of checkboxes , this array got pushed
  removableColumnList =['Digital Paper No','Policy Number','Insured Name','Registration Number','Effective From','Expire Date'];
  paperDetailsAccessMappingDetails:AccessMappingSectionDto;
  paperListAccessData:AccessMappingSectionDto;
  manualRevokeAccessData:AccessMappingSectionDto;
  printAccessData:AccessMappingSectionDto;
  englishJson: any;
  tableId:string='3';
  globalCheckboxState:boolean=false;
  globalCheckboxStateCopy:boolean=false;
  viewType:string="";
  excelDownloadVo = new ExcelDownloadVo();
  view=null;
  private searchSubject = new Subject<number>();
  searchValue="";
  removableDigitalPaperIds: string[]=[];
  isPrintPreview: boolean;



  @ViewChild(MatPaginator) paginator: MatPaginator;
  rowPerPageSubscription: Subscription;
  constructor(private router:Router,public dialog: MatDialog,private paginatorName: MatPaginatorIntl,private authorityPaperService : AuthorityPaperService,
    private toaster:ToastrService, private bulkRevokeService:BulkRevokeService , private paperService: PaperService,private paperDetailService:PaperDetailService, private appService : AppService,
    private json:JsonService, public checkboxStateService:CheckboxstateService, private activateRoute: ActivatedRoute, private translate:TranslateService, private detector: ChangeDetectorRef)
  {

    this.searchSubject .pipe(debounceTime(300)).subscribe((pageIndex: number) => {
      this.changePageIndex();
    });

    this.authorityPaperService.ClickAdd$.subscribe(value=>{
      if(value){
        this.paginator.pageIndex = 0;
        this.pageIndex=1;
      }
    });

    this.activateRoute.params.subscribe((data)=>{
      this.viewType=data['viewtype'];
    })

    this.json.getEnglishJson().subscribe((response)=>{
      if(response){
        this.englishJson=response;
      }
    });
    // if(paginatorName) {
    //   paginatorName.itemsPerPageLabel = this.translate.instant('Pagination.Rows_per_page');
    // }

    // paginatorName.itemsPerPageLabel =

  }
  ngOnDestroy(): void {
    this.checkboxStateService.resetTableCheckboxState(this.tableId);
    this.rowPerPageSubscription.unsubscribe();
  }
  redirect(){
    this.router.navigate(['generate-paper']);
    sessionStorage.setItem('revoke','gdgffgfgv');
  }

  ngOnInit() {
    this.getPageAccessDetails();
    if(this.viewType!="" && this.viewType!=undefined){
      if(this.viewType==='expiry'){
        this.view=true
      }
      else{
        this.view=false
      }
    }
    this.authorityPaperService.passFilterObject(this.filterObjectArray);
    // this.getDropdownList();

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

  ngAfterViewInit(): void {

    if(this.paginatorName) {
      this.rowPerPageSubscription=this.translate.get('Paginator.ItemsPerPageLabel').subscribe((translation: string) => {
        this.paginatorName.itemsPerPageLabel = translation;
      });
    }
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

  getPageAccessDetails(){
    this.appService.getPageAccess(appConst.PAGE_NAME.PAPER_DETAILS.PAGE_IDENTITY).subscribe(response=>{
      if (response) {
        this.paperDetailsAccessMappingDetails = response['content'];
        this.paperDetailsAccessMappingDetails.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.paperDetailsAccessMappingDetails?.sectionData);
        this.paperListAccessData = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName===MenuSectionNames.Paper_List);
        this.manualRevokeAccessData = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName===MenuSectionNames.Revoke_Manual);
        this.printAccessData = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName===MenuSectionNames.Print);
        this.getPaperDetailsCount(this.filterVo, this.searchValue);
      }
    })
  }

  bulkrevoke='Bulk Revoke'
  bulkrevokevisiable=false;
  openDialog(): void {
    this.router.navigate(['generate-paper/bulk-revoke']);
    sessionStorage.setItem('revoke',this.bulkrevoke);


  }
  totalLength: number;
  pagesize = 10;
  minLength = 0;
  maxLength = 10;
  endingIndex = 10;
  ZERO = 0;
  TEN = 10;
  isButtonEnable=false;
  displayedColumns: string[] = ['Check Box','Digital Paper No', 'Policy No', 'Insured Name', 'Registration No', 'Effective From', 'Effective to', 'Status','View',"Revoke"];

  changePage(event){
    if(event.pageIndex != 0){
      this.pageIndex = event.pageIndex +1;
      this.maxLength= event.pageSize;
      this.minLength = event.pageSize *event.pageIndex;
      this.endingIndex = event.pageSize;
    }else{
      this.pageIndex=1;
      this.maxLength= event.pageSize;
      this.minLength = event.pageIndex;
      this.endingIndex = event.pageSize;
    }

    this.getPaperDetailsList(this.minLength,this.maxLength,this.searchValue,this.filterVoObject,this.view);
  }
  maximumcount(event){
    this.pagesize = event;
    this.maximum = this.totalLength/this.pagesize
    this.remainder = this.totalLength%this.pagesize;
    if(this.remainder != 0){
      this.maximum =  Math.floor(this.maximum + 1);
    }
  }

  pageIndex=1;
  pageindex()
  {
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
      this.maxLength= this.endingIndex;
      this.minLength = this.endingIndex *(this.pageIndex-1);
     
      this.getPaperDetailsList(this.minLength,this.maxLength,this.searchValue,this.filterVoObject,this.view);
     
    }else{  
      // this.pageIndex = 1;
      this.minLength = 0;
      this.maxLength = 10;
      this.getPaperDetailsList(this.minLength,this.maxLength,this.searchValue,this.filterVoObject,this.view);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 190) {
      event.preventDefault();
    }
  }

  openViewPopup(data:any): void {
      this.paperDetailsDto=data;

      const dialogRef = this.dialog.open(ViewPaperDetailsPopupComponent, {
        width: '1150px',
        // height: '530px',
        data: {
          revokeData: this.paperDetailsDto
         }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.getPaperDetailsList(this.minLength,this.maxLength,this.searchValue,this.filterVoObject,this.view);
      });


  }

  email(){
    if(!this.isButtonEnable) return;    
    if(!this.globalCheckboxState && !this.globalCheckboxStateCopy){
      this.authorityPaperService.sendEmail(this.finalCheckOutputList).subscribe((data:any)=>{
        if(data['content']){
          this.toaster.success("",this.translate.instant('Digital_Paper_Email_Success.Success_Message'));
        }
        else{
          this.toaster.error("",this.translate.instant('Digital_Paper_Email_Error.error_message'));
        }
    });
    }
     else{
        this.authorityPaperService.sendMailForAllPapers(this.searchValue,this.filterVoObject,this.removableDigitalPaperIds).subscribe((data:any)=>{
          if(data['content']){
            this.toaster.success("",this.translate.instant('Digital_Paper_Email_Success.Success_Message'));
          }
          else{
            this.toaster.error("",this.translate.instant('Digital_Paper_Email_Error.error_message'));
          }
        });
     } 
  
  
  }


  openViewRevokePopup(data: any): void {
    if (data.status === "Active" && this.manualRevokeAccessData.isView) {
      const dialogRef = this.dialog.open(RevokeDigitalPaperPopupComponent, {
        width: '550px',
        height: '266px',
        data: {
          policyNumber: data.pdDigiltaPaperId,
          identity: data.identity
        },

      });

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }else{
      this.toaster.error(this.translate.instant('Toaster_error.unauthorized'));
    }
  }


  getPaperDetailsCount(filterVo: FilterOrSortingVo[], searchValue:string) {

    if(this.paperListAccessData.isView===false){
        return;
    }
    this.pageIndex=1;
    this.authorityPaperService.getPaperDetailsCount(filterVo,this.view,searchValue).subscribe((data: any) => {
      this.totalLength = data;
      const totalNUmber = this.totalLength / 10;
      if (this.isFloat(totalNUmber)) {
        this.maximum =  Math.floor(totalNUmber+1);
      }else{
        this.maximum = totalNUmber;
      }
      this.maximumcount(this.TEN);
      this.getPaperDetailsList(this.ZERO, this.TEN,this.searchValue, filterVo,this.view);
    })
  }

  isFloat(n: number): boolean {
    return Number(n) === n && n % 1 !== 0;
  }

  getPaperDetailsList(skip: number, limit: number,searchvalue:string, filterVo: FilterOrSortingVo[],view:string) {

    this.authorityPaperService.getPaperDetailsList(skip, limit,searchvalue, filterVo,view).subscribe((value: any) => {
      this.paperDetailsDto = [];
      this.paperDetailsDto = value;

      if(this.globalCheckboxState || this.globalCheckboxStateCopy){
          if(this.isPrintPreview){
                this.globalCheckboxState=false;
                this.globalCheckboxStateCopy=this.globalCheckboxState;
                this.checkboxStateService.resetTableCheckboxState(this.tableId);
                this.isPrintPreview=false
          }
          else{
            this.paperDetailsDto.forEach((element)=>{
             const isRemoved= this.removableDigitalPaperIds.includes(element.pdDigiltaPaperId);
              if(!isRemoved){
                const eachState= this.globalCheckboxState || this.globalCheckboxStateCopy;
                this.checkboxStateService.setCheckboxState(this.tableId, element.digitalPaperId, eachState);
              }
            })
          }

      }

      if (this.paperDetailsDto === null || this.paperDetailsDto.length === 0) {
        this.dataNotFound = true;
        if(this.paperDetailsDto.length <=9){
          this.isGotToPageDissabel=true;
        }
      }else{
        this.dataNotFound = false;
        this.isGotToPageDissabel=false;
      }
      this.dataSource = new MatTableDataSource<PaperDetailsListDto>(this.paperDetailsDto);
    })
  }

  filterObjectArray: FilterObject[]=[
    {
      columnName:'pdDigitalPaperId',
      condition:'Like',
      aliasName: 'Paper_Details_table_list.digital_paper_no',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    {
      columnName:'pdPolicyNumber',
      condition:'Like',
      aliasName: 'Paper_Details_table_list.policy_nO',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    {
      columnName:'pdInsuredName',
      condition:'Like',
      aliasName: 'Paper_Details_table_list.insured_name',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    {
      columnName:'vdRegistrationNumber',
      condition:'Like',
      aliasName: 'Paper_Details_table_list.registration_no',
      type: 'field',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null
    },
    // {
    //   columnName:'pdEffectiveFrom',
    //   condition:'BW',
    //   aliasName: 'Paper_Details_table_list.effective_from',
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
      aliasName: 'Paper_Details_table_list.status',
      type: 'chips',
      value: [],
      dropdown: ['Active','Expired','Revoked','Rejected'],
      radio: [],
      dataType:null
    },
  ];

  searchItem(event){
      this.searchValue =event;
      this.isButtonEnable = true;
      this.getPaperDetailsCount( this.filterVoObject, this.searchValue);
  }

  //for Filter
  emitFilterValue(event: FilterOrSortingVo[]) {
    this.searchValue ="";
    const filterFromSearch: FilterOrSortingVo[] = event;
    let effectiveFromValue=null;
    let effectiveTo=null;
    let condition=null
    for (let vo of filterFromSearch) {
      const type = this.getColumnType(vo.columnName);
      vo.type = type;
      if (vo.columnName === 'pdExpireDate') {
        if(vo.value && vo.value2===null){
          vo.condition='Ge'
        }
        else if(vo.value===null && vo.value2){
            vo.condition='Le'
            vo.value=vo.value2;
            vo.value2=null;
        }

        effectiveFromValue=vo.value;
        effectiveTo=vo.value2;
        condition=vo.condition;
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
    this.getPaperDetailsCount(this.filterVoObject, this.searchValue);
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

  sortingmethod(data: any) {
    const paperDetails = data;

    if (paperDetails === "Digital Paper No") {
      this.Digital_Paper_No = !this.Digital_Paper_No;
      this.Policy_No = false;
      this.Insured_Name= false;
      this.Registration_NO = false;
      this.Effective_From = false;
      this.Effective_to = false;
      this.Status= false;
      if (this.Digital_Paper_No) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Digital_Paper_No);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Digital_Paper_No);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (paperDetails === "Policy No") {
      this.Policy_No = !this.Policy_No;
      this.Digital_Paper_No = false;
      this.Insured_Name= false;
      this.Registration_NO = false;
      this.Effective_From = false;
      this.Effective_to = false;
      this.Status= false;
      if (this.Policy_No) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Policy_No);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Policy_No);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (paperDetails === "Insured Name") {
      this.Insured_Name = !this.Insured_Name;
      this.Digital_Paper_No = false;
      this.Policy_No = false;
      this.Registration_NO = false;
      this.Effective_From = false;
      this.Effective_to = false;
      this.Status= false;
      if (this.Insured_Name) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Insured_Name);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Insured_Name);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (paperDetails === "Registration No") {
      this.Registration_NO = !this.Registration_NO;
      this.Digital_Paper_No = false;
      this.Policy_No = false;
      this.Insured_Name= false;
      this.Effective_From = false;
      this.Effective_to = false;
      this.Status= false;
      if (this.Registration_NO) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Registration_NO);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Registration_NO);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (paperDetails === "Effective From") {
      this.Effective_From = !this.Effective_From;
      this.Digital_Paper_No = false;
      this.Policy_No = false;
      this.Insured_Name= false;
      this.Registration_NO = false;
      this.Effective_to = false;
      this.Status= false;
      if (this.Effective_From) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Effective_From);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Effective_From);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (paperDetails === "Effective to") {
      this.Effective_to = !this.Effective_to;
      this.Digital_Paper_No = false;
      this.Policy_No = false;
      this.Insured_Name= false;
      this.Registration_NO = false;
      this.Effective_From = false;
      this.Status= false;
      if (this.Effective_to) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Effective_to);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Effective_to);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
    }
    else if (paperDetails === "Status") {
      this.Status = !this.Status;
      this.Digital_Paper_No = false;
      this.Policy_No = false;
      this.Insured_Name= false;
      this.Registration_NO = false;
      this.Effective_From = false;
      this.Effective_to = false;
      if (this.Status) {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Status);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
      }
      else {
        const columnName = this.getEntityColumnName(paperDetails);
        this.setSortingVO(columnName, this.Status);
        this.getPaperDetailsCount(this.filterVoObject,this.searchValue);
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

    onpagebackward() {
      if (this.paperDetailsDto != null) {
        this.dataNotFound = false;
      }
    }


    openDrowpown(){
      this.currentComponentName='paper_details';
      sessionStorage.setItem('componentName',this.currentComponentName);
    }

    closedowload(data) {
      this.downloadclose = false;
    }


    getDropdownList(){
      this.columnList=[];
      this.paperService.getDropdownData().subscribe((value:any[])=>{
        let column : string[] = value;
        column = column.filter( ( el ) => !this.removableColumnList.includes( el ) );
        this.columnList=column;
      })
    }

  paperDetailsDownload(){
    if(!this.isButtonEnable) return;
      // this.downloadclose=true;
      const totalColumn = ['Digital Paper No', 'Policy No', 'Insured Name', 'Registration No', 'Effective From', 'Effective to', 'Status'];     
      if(!this.globalCheckboxState && !this.globalCheckboxStateCopy){
        this.columnFromParent(totalColumn);
      }
      else{
        this.allPapersDownload();
      }
    }
   
  allPapersDownload() {
    this.paperService.paperDetailsExcelAllDownload(this.searchValue,
      this.view, this.filterVoObject, this.removableDigitalPaperIds).subscribe((data: any) => {
        if (data) {
          this.donwloadFile(data);
        } else {
          this.toaster.error(this.translate.instant('Toaster_error.Invalid_Excel'));
        }
      });
  }

    columnFromParent(event:any){
      this.excelDownloadVo.columnList = event;
      this.excelDownloadVo.filterVo = this.filterVoObject;
      if(this.finalCheckOutputList?.length>0){
        const digitalPaperIds:number[] = this.finalCheckOutputList.map(el=>el.digitalPaperId);
        this.excelDownloadVo.companyId=digitalPaperIds;
      }
        this.paperService.paperDetailsExcelDownload(this.excelDownloadVo,this.searchValue).subscribe((data:any)=>{
          if(data){
            this.donwloadFile(data);

          }else {
            this.toaster.error(this.translate.instant('Toaster_error.Invalid_Excel'));
          }
        });
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
      a.download = 'Paper Details' + '.xlsx';
      document.body.appendChild(a);
      a.click();
    }

//<________________________Print Logic starts____________________________

    selectedDigitalPaper:PrintDocument[] = [];

    printPreview(){
      if(!this.isButtonEnable) return;
      this.isPrintPreview=true;
      const imageUrls = [];
      const imageAPIs: Observable<any>[] = [];
      this.selectedDigitalPaper.forEach(element => {
        imageAPIs.push(this.paperDetailService.getImageFromUrl(element.url));
      });
      zip(imageAPIs).subscribe((responses: any[]) => {
        if(responses && responses.length > 0) {
          responses.forEach((response) => {
            const blob = new Blob([response], { type: 'image/jpeg' });
            const imagePath = URL.createObjectURL(blob);
            imageUrls.push(imagePath);
          });

          this.doPrint(imageUrls);
        }
      });
    }

    doPrint(imageUrls): void {
      const printWindow = window.open('', '_blank');
      const printDocument = printWindow.document;

      // Generate HTML for printing
      const imagesHtml = imageUrls.map(url => `<img src="${url}" alt="Image" />`).join('');
      // const imagesHtml = imageUrls.map(url => `<img src="${url}" alt="Image" />`).join('');

      printDocument.open();
      printDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Images</title>
            <style>
              img {
                width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            ${imagesHtml}
          </body>
        </html>
      `);


      // Trigger print dialog
      setTimeout(()=> {
        printDocument.close();
        printWindow.print();
        printWindow.close();
      }, 200);
    }

    blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    sendObject(element:PaperDetailsListDto,event){
      if (event.target.checked === true) {
        const selectedCheckbox = new PrintDocument;
        selectedCheckbox.name = element.pdDigiltaPaperId;
        selectedCheckbox.url = element.fileURL;
        this.selectedDigitalPaper.push(selectedCheckbox);
      }
      else if (event.target.checked === false) {
        this.selectedDigitalPaper.forEach(element1 => {
          if (element1.name === element.pdDigiltaPaperId) {
           const index = this.selectedDigitalPaper.indexOf(element1);
            this.selectedDigitalPaper.splice(index,1);
          }
        });
      }
      this.selectedDigitalPaper.length>0?this.isButtonEnable=true:this.isButtonEnable=false;
    }


//<_________________________Print Logic ends______________________________________


//<________________________Checkbox Logic starts___________________________________


    // For all select

  toggleGlobalCheckBox() {
    this.globalCheckboxState = !this.globalCheckboxState;
    this.globalCheckboxStateCopy=this.globalCheckboxState;
    this.checkboxStateService.setGlobalCheckboxState(this.globalCheckboxState);
      // this.authorityPaperService.getPaperDetailsList(this.ZERO, this.ZERO,this.searchValue, [],null).subscribe((data: PaperDetailsListDto[]) => {
      //   if (data) {
      //     allPaperDetailsDataList = data;
      //     allPaperDetailsDataList.forEach(paper => {
      //       this.checkboxStateService.setCheckboxState(this.tableId, paper.digitalPaperId, this.globalCheckboxState);
      //     });
      //     this.allSelectCheckList = allPaperDetailsDataList;
      //     this.finalCheckOutputList = this.allSelectCheckList;
      //   }
      // })

      if(this.globalCheckboxState){
        if(this.removableDigitalPaperIds.length>0){
          this.removableDigitalPaperIds=[];
        }
          if (this.paperDetailsDto) {
                this.selectedDigitalPaper=[];
                this.paperDetailsDto.forEach((element)=>{
                     let printDocument = new PrintDocument();
                      printDocument.name=element.pdDigiltaPaperId;
                      printDocument.url=element.fileURL;
                      this.checkboxStateService.setCheckboxState(this.tableId, element.digitalPaperId, this.globalCheckboxState);
                      this.selectedDigitalPaper.push(printDocument);
                });
          }
        
      }else {
      this.checkboxStateService.resetTableCheckboxState(this.tableId);
      this.allSelectCheckList = [];
      this.eachSelectCheckList=[];
      this.finalCheckOutputList = this.allSelectCheckList;
      this.selectedDigitalPaper=[];
      this.removableDigitalPaperIds=[];
    }
    this.globalCheckboxState ? this.isButtonEnable = true : this.isButtonEnable = false;
  }

    // For individual select and deselect

  toggleCheckBox(element: PaperDetailsListDto) {
    const currentState = this.checkboxStateService.getCheckboxState(this.tableId, element.digitalPaperId);

    if(this.globalCheckboxState || this.globalCheckboxStateCopy){
        this.globalCheckboxState=false;
        const isIdAddedAlready=this.removableDigitalPaperIds.includes(element.pdDigiltaPaperId);
        if(isIdAddedAlready){
          const index=this.removableDigitalPaperIds.indexOf(element.pdDigiltaPaperId);
          this.removableDigitalPaperIds.splice(index,1);
        }
        else{
          this.removableDigitalPaperIds.push(element.pdDigiltaPaperId);
        }
    }

    if (!currentState === true) {
      this.checkboxStateService.setCheckboxState(this.tableId, element.digitalPaperId, !currentState);
      if (this.allSelectCheckList.length === 0) {
        this.eachSelectCheckList.push(element);
        this.finalCheckOutputList = this.eachSelectCheckList;
      }
      else {
        this.allSelectCheckList.push(element);
        this.finalCheckOutputList = this.allSelectCheckList;
      }
    }
    else {
      this.checkboxStateService.setGlobalCheckboxState(false);
      this.checkboxStateService.setCheckboxState(this.tableId, element.digitalPaperId, !currentState);
      if (this.allSelectCheckList.length === 0) {
        const index = this.eachSelectCheckList.indexOf(element);
        this.eachSelectCheckList.splice(index, 1);
        this.finalCheckOutputList = this.eachSelectCheckList;
      } else {
        const index = this.allSelectCheckList.indexOf(element);
        this.allSelectCheckList.splice(index, 1);
        this.finalCheckOutputList = this.allSelectCheckList;
      }
    }

    this.eachSelectCheckList.length > 0 ? this.isButtonEnable = true : this.isButtonEnable = false;
  }


}



export class PrintDocument{
  name:string;
  url:string;
}
