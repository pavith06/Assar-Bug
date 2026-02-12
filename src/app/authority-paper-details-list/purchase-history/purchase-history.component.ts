import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MenuSectionNames, componentName } from 'src/app/common/enum/enum';
import { FilterObject } from 'src/app/models/Filter-dto/filter-object';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { ExcelDownloadVo } from 'src/app/models/purchase-stock-dto/purchase-history-dto';
import { FileTypeEnum } from 'src/app/models/report-loss-dto/FileTypeEnum';
import { AccessMappingPageDto } from 'src/app/models/user-role-management/access-Mapping-PageDto ';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { appConst } from 'src/app/service/app.const';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { AppService } from 'src/app/service/role access/service/app.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent implements OnInit , OnDestroy{
  filterVoObject: FilterOrSortingVo[];
  excelDownloadVo = new ExcelDownloadVo;
  columnContent: string[] = ["Insurance Company", "Total Transaction", "Pending Transaction"];

  cardlistview = false;
  cardcardview = true;
  searchdisable = true;
  isShowDownload=false;
  notificationStockId: number;
  searchValue: string;
  previousUrl ='/dashboard/dash';
  disableSubscription: Subscription;
  isDownloadDisable: boolean=false;
  searchValueForValue="";
  isSearch: boolean=false;

  onBack(){
    this.router.navigate([this.previousUrl]);
  }
  cardviewopen() {
    this.router.navigateByUrl("authority-paper-details/purchase-history/list");
    this.cardlistview=!this.cardlistview;
    this.cardcardview=!this.cardcardview;
    this.searchdisable = !this.searchdisable;
    this.isShowDownload = true;

  }
  listViewOpen() {
    this.router.navigateByUrl("authority-paper-details/purchase-history/card");
    this.cardlistview=!this.cardlistview;
    this.cardcardview=!this.cardcardview;
    this.searchdisable = !this.searchdisable;
    this.isShowDownload = false;
  }
  transactionview() {
    const companyIds = sessionStorage.getItem("companyId");
    if(companyIds!=null && companyIds!=undefined && companyIds !=="") {
      this.router.navigate(['authority-paper-details/transaction-history']);
     } else {
      this.toastr.error(this.translate.instant('Toaster_error.No_Companies_selection'),'',{
        timeOut:3000,
      });
     }

  }
  backTocard() {
    this.cardlistview=!this.cardlistview;
    this.cardcardview=!this.cardcardview;
    this.searchdisable = !this.searchdisable;
    this.service.setResetCheckBoxValue(true);
    this.router.navigateByUrl("authority-paper-details/purchase-history/card");
  }

  constructor(private router: Router, private service: AuthorityPaperService,
    private toastr: ToastrService, private appService:AppService, private translate : TranslateService) {
      this.disableSubscription=this.service.getDownloadDisableValue().subscribe((value)=>{
        if(value){
          this.isDownloadDisable=value;
        }
        else{
          this.isDownloadDisable=false;
        }
      });
    }
  ngOnDestroy(): void {
    this.disableSubscription.unsubscribe();
  }


  ngOnInit(): void {
    const curentUrl=window.location.href
    if(curentUrl.includes('/list')){
      this.searchdisable=false;
      this.cardlistview=true;
      this.cardcardview=false
      this.isShowDownload=true;
    }
    else{
      this.searchdisable=true;
      this.cardlistview=false;
      this.cardcardview=true;
      this.isShowDownload=false;
    }
    this.getPageAccessDetails();
    sessionStorage.setItem('companyId','');
    sessionStorage.setItem('componentName',componentName.Purchase_History);
  }

  authorityPaperDetailsAccessDto:AccessMappingPageDto;
  viewHistoryPageAccessDto: AccessMappingSectionDto;
  purchaseHistoryListPageAccessDto: AccessMappingSectionDto;


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
    this.appService.getPageAccess(appConst.PAGE_NAME.AUTHORITY_PAPER_DETAILS.PAGE_IDENTITY).subscribe(response=>{
      if (response) {
        this.authorityPaperDetailsAccessDto = response['content'];
        this.authorityPaperDetailsAccessDto.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.authorityPaperDetailsAccessDto?.sectionData);
        this.viewHistoryPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.View_History);
        this.purchaseHistoryListPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.Purchase_History_List);
      }
    })
  }
  searchItem(event){
    if(this.cardlistview){
      this.searchValueForValue= event;
      this.isSearch = true;
      this.router.navigate([], { queryParams: { recSearchQuery: this.searchValueForValue, isSearch: this.isSearch } });
    }
  }

  filterObject: FilterObject[];
  showDownload = false;
  open() {
    // this.showDownload = true;
    let columnName = [ 'Insurance Company', 'Total Transactions', 'Pending Transactions'];

      this.excelDownload(columnName);
  }

  excelDownload(columnList: string[]) {
    const companyIdList= sessionStorage.getItem('companyId');
    let companyIds:number[]=null
    if(companyIdList!=null && companyIdList!=''){
      companyIds=JSON.parse(companyIdList);
    }
    this.excelDownloadVo.columnList = columnList;
    this.excelDownloadVo.filterVo = this.filterVoObject;
    this.excelDownloadVo.companyId=companyIds;
    if (this.excelDownloadVo.columnList.length !== 0) {
      this.service.excelDownload(this.excelDownloadVo, this.searchValueForValue).subscribe(data => {
        if (data) {
          this.donwloadFile(data, "Purchase-history.xlsx");

        } else {
          this.toastr.error(this.translate.instant('Toaster_error.Invalid_Excel'));
        }
      });
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
    a.download = 'Purchase-history' + '.xlsx';
    document.body.appendChild(a);
    a.click();

  }
  search(event){
    if(this.cardcardview && !this.cardlistview){
    this.router.navigate([], { queryParams: { recSearchQuery: event.target.value,isSearch: false } });
  }
  }

  closedownload(data) {
    this.showDownload = false
    sessionStorage.setItem('componentName',componentName.Purchase_History);
  }

  passValueParentToChild(event) {
    this.service.setSelectedColumn(event);
  }

  paper_list() {
    this.router.navigate(['notification/transaction']);
  }

    emitFilterValue(event:any){
      this.searchValueForValue = "";
      this.isSearch = false;
      this.router.navigate([], { queryParams: { recSearchQuery: this.searchValueForValue, isSearch: this.isSearch } });
      this.filterVoObject=event;
      this.service.passFilterVoObject(this.filterVoObject);
    }
}
