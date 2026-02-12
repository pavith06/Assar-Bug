import { AccessMappingSectionDto } from './../../models/user-role-management/section-dto';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardInputDto } from 'src/app/models/dashboard-data-dto/dashboard-input-dto';
import { PaperDetailsListDto } from 'src/app/models/paper-details-dto/paper-details-list-dto';
import { ViewPaperDetailsPopupComponent } from 'src/app/paper-details-list/view-paper-details-popup/view-paper-details-popup.component';
import { AdminService } from 'src/app/service/admin.service';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-recent-digital-papers-authority',
  templateUrl: './recent-digital-papers-authority.component.html',
  styleUrls: ['./recent-digital-papers-authority.component.scss']
})
export class RecentDigitalPapersAuthorityComponent {
  recentDigitalPapers:PaperDetailsListDto[];
  paperDetails: PaperDetailsListDto;
  @Input() authorityRecentDigitalPaperAccessDataFromParent:AccessMappingSectionDto;
  dashboardInputData= new DashboardInputDto();
  isAdmin: boolean;
  noDataFound: boolean=false;

  constructor(private router:Router,private dashboardService:DashboardChartService, private dialog:MatDialog, private authorityPaperService:AuthorityPaperService
    ,private dashBoardService: DashboardService,private adminService: AdminService)
  {
    this.dashBoardService.isChecked$.subscribe((value) => {
      if (value) {
        this.dashboardInputData = value;
        this.getRecentDigitalPapers(this.dashboardInputData);
      }
    });
  }
  ngOnInit(): void {
      this.getRecentDigitalPapers(this.dashboardInputData);
  }

    getRecentDigitalPapers(dashboardInputData: DashboardInputDto) {
    if (Object.keys(dashboardInputData).length === 0) {
      const startDate = moment().startOf('year').format('MM/DD/YYYY');
      const endDate = moment().endOf('year').format('MM/DD/YYYY');

      dashboardInputData.fromDate = new Date(startDate);
      dashboardInputData.toDate = new Date(endDate);
      dashboardInputData.filterType = 'YEAR';
    }

    if(this.authorityRecentDigitalPaperAccessDataFromParent.isView===false){
      return;
    }

    this.isAdmin = this.adminService.isAssociationUser();

    if(this.isAdmin){
      this.dashboardService.getAllRecentDigitalPapers(dashboardInputData).subscribe((data) => {
        this.recentDigitalPapers = data['content'];
        this.noDataFound=this.recentDigitalPapers.length===0?true:false;
      });
    }
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
        this.ngOnInit();
      });
    });


  }

  GoPaperDetails()
  {
    this.dashboardService.getPaperComapnyIds().subscribe((value)=>{
      let companyId:number[]=value['content'];
      const arr = JSON.stringify(companyId);
      sessionStorage.setItem("companyId",arr);
      localStorage.setItem("view",'recent');
      this.router.navigateByUrl('/authority-paper-details/paper-details/card/recent')
    })

  }
}
