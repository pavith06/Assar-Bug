
import { Component, OnInit, ViewChild } from '@angular/core';
import { appConst } from '../service/app.const';
import { AppService } from '../service/role access/service/app.service';
import { AdminService } from '../service/admin.service';
import { AccessMappingPageDto } from '../models/user-role-management/access-Mapping-PageDto ';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { Router } from '@angular/router';
import { zip } from 'rxjs';
import { AccessMappingSectionDto } from '../models/user-role-management/section-dto';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit{

  insurenceTpListFromChart:InsuredAndTpArray;
  @ViewChild(DashboardHeaderComponent) dashboardHeader:DashboardHeaderComponent;

  dateFilterDropdown:string[]=['Current Year','Current Month','Current Date','Custom'];
  isAdmin=false

  receivablePageInfo: any;
  payablePageInfo: any;
  public appConst = appConst;
  receivablePageId = appConst.PAGE_NAME.DASHBOARD.PAGEID;
  payablePageId = appConst.PAGE_NAME.DASHBOARD.PAGEID;
  isReceivableDashboard = true; // true means payable dashboard; false means receivable dashboard
  privilegeName = appConst.PAGE_NAME.DASHBOARD.BUTTON_ACCESS.QUICKLINKS;
  menuHeaderList: any;

  dashboardPageAccessData: AccessMappingPageDto;
  isDashboardEnabled = true;


  barChartAccessData: AccessMappingSectionDto;
  horizontalBarChartAccessData: AccessMappingSectionDto;
  doughnutChartAccessData: AccessMappingSectionDto;
  predictionCartAcessData:AccessMappingSectionDto;
  companyRecentDigitalPaperAccessData:AccessMappingSectionDto;
  companyUpcomingExpiryPaperAccessData:AccessMappingSectionDto;
  authorityRecentDigitalPaperAccessData:AccessMappingSectionDto;
  authorityRecentTransactionAccessData:AccessMappingSectionDto;
  quickLinksAccessData:AccessMappingSectionDto;


  collectFilterCompanyList(event:InsuredAndTpArray){
    this.insurenceTpListFromChart = event;


  }

  constructor(private router: Router, private appService : AppService, private adminService: AdminService){
    
  }
  ngOnInit(): void {
    this.getPageAccessDetails();
  }

  floatCheck=false;
   rotate(){
     this.floatCheck=!this.floatCheck;
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

  getPageAccessDetails(): void {
    this.checkUserIsAdmin();
    let identity=appConst.PAGE_NAME.DASHBOARD.PAGE_IDENTITY

    if(this.isAdmin){
      identity=appConst.PAGE_NAME.AUTORITY_DASHBOARD.PAGE_IDENTITY;
    }
    
    zip(
      this.appService.getPageAccess(identity),
    )
    .subscribe((responseList: any) => {
      if(responseList) {
        this.dashboardPageAccessData = responseList[0].content;
        this.isDashboardEnabled = this.dashboardPageAccessData.isEnabled;
        if(!this.isDashboardEnabled) {
          this.router.navigateByUrl('/dashboard/dash');
        } else {
          this.getMenuItems();
          // this.getReceivablePrivilege();
          // this.getPayablePrivilege();
          if(this.dashboardPageAccessData && this.dashboardPageAccessData.sectionData && !this.isAdmin) {
            
            this.dashboardPageAccessData.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.dashboardPageAccessData?.sectionData);
            //bar chart
            this.barChartAccessData = this.dashboardPageAccessData?.sectionData[0];
            //doughnut chart
            this.doughnutChartAccessData = this.dashboardPageAccessData?.sectionData[1];
            //prediction chart
            this.predictionCartAcessData = this.dashboardPageAccessData?.sectionData[2];
            //recent digital paper
            this.companyRecentDigitalPaperAccessData = this.dashboardPageAccessData?.sectionData[3];
            //expiry paper
            this.companyUpcomingExpiryPaperAccessData = this.dashboardPageAccessData?.sectionData[4];
            //quick links
            this.quickLinksAccessData = this.dashboardPageAccessData?.sectionData[5];
          }
          if(this.dashboardPageAccessData && this.dashboardPageAccessData.sectionData && this.isAdmin) {

            this.dashboardPageAccessData.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.dashboardPageAccessData?.sectionData);
            //bar chart
            this.barChartAccessData = this.dashboardPageAccessData?.sectionData[0];
            //pie chart
            this.doughnutChartAccessData = this.dashboardPageAccessData?.sectionData[1];
            //details
            this.horizontalBarChartAccessData = this.dashboardPageAccessData?.sectionData[2];
            //vertical
            this.authorityRecentDigitalPaperAccessData = this.dashboardPageAccessData?.sectionData[4];
            //stacked
            this.authorityRecentTransactionAccessData = this.dashboardPageAccessData?.sectionData[3];
            //quick links
            this.quickLinksAccessData = this.dashboardPageAccessData?.sectionData[5];
          }
        }
      }
    });
  }

  getReceivablePrivilege(){
    this.appService.getPrivilegeForPage(this.receivablePageId).subscribe((res: any)=>{
      this.receivablePageInfo = res.content;
      this.getReceivablePageInfo(this.receivablePageId);
    });
  }

  getPayablePrivilege(){
    this.appService.getPrivilegeForPage(this.payablePageId).subscribe((res: any)=>{
      this.payablePageInfo = res.content;
      this.getPayablePageInfo(this.payablePageId);
    });
  }

  getReceivablePageInfo(pageID: number): boolean{
    const pageValue = this.receivablePageInfo && (this.receivablePageInfo.length === 0 || this.receivablePageInfo.find((element: any) => element.pageId === pageID));
    return pageValue;
  }

  getPayablePageInfo(pageID: number): boolean{
    const pageValue = this.payablePageInfo && (this.payablePageInfo.length === 0 || this.payablePageInfo.find((element: any) => element.pageId === pageID));
    return pageValue;
  }

  // checkPrivillege(privillegeName: string): boolean {
  //   let isEnabled = true;
  //   const pageInfo = !this.isReceivableDashboard ? this.receivablePageInfo : this.payablePageInfo;
  //   if(pageInfo && pageInfo.length > 0) {
  //     const privillege = pageInfo.find((prv: any) => prv.privilegeName === privillegeName);
  //     isEnabled = privillege.isEnabled;
  //   }
  //   return isEnabled;
  // }

  checkUserIsAdmin(){
    this.isAdmin=this.adminService.isAssociationUser();
    return this.isAdmin;
  }

  checkUserIsAdminForReportLoss(){
    return !this.adminService.isAssociationUser();
  }

  setToggleChange(isReceivable: boolean): void {
      this.privilegeName = appConst.PAGE_NAME.DASHBOARD.BUTTON_ACCESS.QUICKLINKS;
  }

  getMenuHeader(pageName: string): boolean{
    const menuHeader = this.menuHeaderList?.find((element) => element.menuName === pageName);
    return menuHeader;
  }

  getMenuItems(){
    this.appService.getMenubyRole().subscribe((res: any)=>{
      this.menuHeaderList = res.content;
    });
  }

  isBarChartEnabled(): boolean {
    return this.barChartAccessData?.isView;
  }

  isDoughnutChartEnable(): boolean {
    return  this.doughnutChartAccessData?.isView;
  }

  isHorizontalBarChartEnabled(): boolean {
    return this.horizontalBarChartAccessData?.isView;
  }

  isPredictionChartEnable(): boolean {
    return this.predictionCartAcessData?.isView;
  }

  isCompanyRecentDigital(): boolean {
    return this.companyRecentDigitalPaperAccessData?.isView;
  }
  isCompanyUpcomingExpiryPaper(): boolean {
    return this.companyUpcomingExpiryPaperAccessData?.isView;
  }
  isAuthorityRecentDigital(): boolean {
    return this.authorityRecentDigitalPaperAccessData?.isView;
  }
  isAuthorityRecentTransaction(): boolean {
    return this.authorityRecentTransactionAccessData?.isView;
  }


}
export class InsuredAndTpArray{
  insurenceCompanyNames:string[];
  tpCompanyNames:string[];
}
