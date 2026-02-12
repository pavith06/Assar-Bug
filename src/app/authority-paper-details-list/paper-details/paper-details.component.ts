import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MenuSectionNames, componentName } from 'src/app/common/enum/enum';
import { FilterObject } from 'src/app/models/Filter-dto/filter-object';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { AccessMappingPageDto } from 'src/app/models/user-role-management/access-Mapping-PageDto ';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { appConst } from 'src/app/service/app.const';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { AppService } from 'src/app/service/role access/service/app.service';

@Component({
  selector: 'app-paper-details',
  templateUrl: './paper-details.component.html',
  styleUrls: ['./paper-details.component.scss']
})
export class PaperDetailsComponent implements OnInit,OnDestroy {
  getFilter: FilterOrSortingVo[];
  SelectedColumnInDownload:[]=[];
  columnContent: any;
  isListShown=true;
  isDownloadIcon = false;
  searchData="";
  isCleared=false;
  isDownloadDisable: boolean=false;
  downloadCompanentName: string;
  searchValueForList="";
  searchValueForViewPaper="";
  constructor(public router: Router,private authorityPaperDetailsService: AuthorityPaperService, private appService:AppService,
    private toastr: ToastrService, private translate : TranslateService) {

     const value= localStorage.getItem('view')
     if(value!=undefined || value!=null){
            this.viewPapers();
            localStorage.removeItem('view');
     }
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem('ViewPaper');
    sessionStorage.removeItem('AuthorityPaperDetails');
  }
  ngOnInit(): void {
    this.getPageAccessDetails();
    this.getDropDownList();
  }

  authorityPaperDetailsAccessDto:AccessMappingPageDto;
  paperDetailsPageAccessDto: AccessMappingSectionDto;
  paperDetailsCardPageAccessDto: AccessMappingSectionDto;
  viewPapersPageAccessDto: AccessMappingSectionDto;
  previousUrl ='/dashboard/dash'
  onBack(){
    this.router.navigate([this.previousUrl]);
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
    this.appService.getPageAccess(appConst.PAGE_NAME.AUTHORITY_PAPER_DETAILS.PAGE_IDENTITY).subscribe(response=>{
      if (response) {
        this.authorityPaperDetailsAccessDto = response['content'];
        this.authorityPaperDetailsAccessDto.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.authorityPaperDetailsAccessDto?.sectionData);
        this.paperDetailsPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.Paper_Details_List);
        this.paperDetailsCardPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.Paper_Details_Card);
        this.viewPapersPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName===MenuSectionNames.View_Paper);
        const isList=sessionStorage.getItem('AuthorityPaperDetails');
        const isTransaction=sessionStorage.getItem('ViewPaper');
        if(isList!=null && isList!=undefined && isList!=''){
          this.cardView();
        }
        if(isTransaction!=null && isTransaction!=undefined && isTransaction!=''){
          this.viewPapers();
        }
        
      }
    })
  }

  getDropDownList(){
    this.authorityPaperDetailsService.getDropdownDataList().subscribe((data)=>{
      this.columnContent = data;
    })
  }

  passValueParentToChild(event) {
    this.authorityPaperDetailsService.setSelectedColumn(event);
  }

  transactionList(event){
    this.authorityPaperDetailsService.setSelectedColumn(event);
  }

  filterVoObject: FilterOrSortingVo[];
  filterObjectArray:FilterObject[];
  searchdisable = true;
  showDownload = false;
  companyIdArray:number[]=[];

  open() {
    this.downloadCompanentName =  sessionStorage.getItem("componentName");
    if(this.downloadCompanentName== componentName.PAPER_DETAILS){
      const totalColumn =[ 'Insured Company', 'Stock Count', 'Available Stock', 'Papers Issued'];
      this.authorityPaperDetailsService.setSelectedColumn(totalColumn);
    }
    else if(this.downloadCompanentName== componentName.PAPER_DETAILS_TRANSACTION_LIST){
      const totalColumn =['Digital Paper No', 'Company Name','Policy Number' ,'Insured Name', 'Registration No', 'Effective From','Effective to', 'Status'];
      this.authorityPaperDetailsService.setSelectedColumn(totalColumn);
    }
  }

  isDownloadShowoRnOT(){
    if(this.paperDetailsPageAccessDto?.isDownload === false &&sessionStorage.getItem("componentName") == componentName.PAPER_DETAILS){
      return false;
    }else if(this.viewPapersPageAccessDto?.isDownload === false && sessionStorage.getItem("componentName") == componentName.PAPER_DETAILS_TRANSACTION_LIST){
      return false;
    }else{
      return true;
    }
  }
  closedownload(data) {
    this.showDownload = false
  }
  search(event){
    this.searchData = event.target.value
  }
  card = true;
  list = false;
  listView() {
    sessionStorage.setItem('componentName',componentName.PAPER_DETAILS);
    this.card = true;
    this.list = false;
    this.searchdisable=true;
    this.isDownloadIcon = false;
    sessionStorage.setItem('AuthorityPaperDetails','');
  }
  cardView() {
    sessionStorage.setItem('componentName',componentName.PAPER_DETAILS);
    this.getDropDownList();
    this.isCleared=true;
    this.list = true;
    this.isDownloadIcon = true;
    this.card = false;
    this.searchdisable=false;
    sessionStorage.setItem('AuthorityPaperDetails','list');
    sessionStorage.setItem('ViewPaper','');
  }
  backTocard() {
    sessionStorage.setItem('componentName',componentName.PAPER_DETAILS);
    this.card = true;
    this.list = false;
    this.viewpaper = false;
    this.isCleared=true;
    this.isDownloadIcon = false;
    this.searchdisable=true;
    this.isListShown=true;
    this.authorityPaperDetailsService.setAddNew(true);
    this.authorityPaperDetailsService.setResetCheckBoxValue(true);
    sessionStorage.setItem('AuthorityPaperDetails','');
  }

  viewpaper = false

  viewpaperlist(event:any[]) {
    sessionStorage.setItem('componentName',componentName.PAPER_DETAILS_TRANSACTION_LIST);
    this.columnContent =["Digital Paper No","Company Name","Policy No","Insured Name","Registration No","Effective From","Effective to","Status"];
    this.viewpaper = true;
    this.isDownloadIcon = true;
    this.list = false;
    this.card = false;
    this.searchdisable=false
    if(event.length!==0){
      this.passCompanyIdInSessionStorage(event);
    }
  }
  searchItem(event){
    this.downloadCompanentName =  sessionStorage.getItem("componentName");
      this.searchValueForList =event;
      this.searchValueForViewPaper =event;
    
}
  
  private passCompanyIdInSessionStorage(event: any[]) {
    const arr = JSON.stringify(event);
    sessionStorage.setItem('companyId', arr);
  }

  getFilterArrayObject(event: any) {
    this.filterObjectArray = event;
  }
  emitFilterValue(event: any) {
    this.searchValueForList = "";
    this.searchValueForViewPaper = "";
    this.filterVoObject = event;


    if (this.filterVoObject[0].columnName === 'companyId') {
      this.getFilter = this.filterVoObject;
      this.authorityPaperDetailsService.setFilterValue(this.filterVoObject);
    } else {
      this.authorityPaperDetailsService.passFilterVoObject(this.filterVoObject);
    }


  }

  viewPapers() {
    this.isListShown=false;
    sessionStorage.setItem('ViewPaper','list');
    sessionStorage.setItem('AuthorityPaperDetails','');
    const companyIds = sessionStorage.getItem("companyId");
    if(companyIds!=null && companyIds!=undefined && companyIds !=="") {
      this.viewpaperlist([]);
    } else {
      this.isListShown=true;
      this.toastr.error(this.translate.instant('Toaster_error.No_Companies_selection'),'',{
        timeOut:3000,
      });

    }

  }

  viewPaper(event){
    this.isListShown = false
  }

  getDisableDownloadData(event:any){
    this.isDownloadDisable=event;
  }

}
