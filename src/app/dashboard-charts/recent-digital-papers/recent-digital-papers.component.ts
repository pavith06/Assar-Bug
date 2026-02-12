import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardInputDto } from 'src/app/models/dashboard-data-dto/dashboard-input-dto';
import { PaperDetailsListDto } from 'src/app/models/paper-details-dto/paper-details-list-dto';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { ViewPaperDetailsPopupComponent } from 'src/app/paper-details-list/view-paper-details-popup/view-paper-details-popup.component';
import { AdminService } from 'src/app/service/admin.service';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-recent-digital-papers',
  templateUrl: './recent-digital-papers.component.html',
  styleUrls: ['./recent-digital-papers.component.scss']
})
export class RecentDigitalPapersComponent implements OnInit {
  recentDigitalPaper:PaperDetailsListDto[]
  paperDetailsDto: PaperDetailsListDto;
  @Input() companyRecentDigitalPaperAccessDataFromParent:AccessMappingSectionDto;
  dashboardInputData= new DashboardInputDto();
  isAdmin: boolean;
  noDataFound:boolean;


  constructor(private router:Router,private chartService:DashboardChartService,private authorityPaperService : AuthorityPaperService,public dialog: MatDialog,private dashBoardService: DashboardService
    ,private adminService : AdminService)
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
    this.isAdmin = this.adminService.isAssociationUser();

    if(this.companyRecentDigitalPaperAccessDataFromParent.isView===false){
      return;
    }

    if(!this.isAdmin){
      this.chartService.getRecentDigitalPapersList(dashboardInputData).subscribe((data) => {
        this.recentDigitalPaper = data['content'];
        this.noDataFound=this.recentDigitalPaper.length===0?true:false;
      });
    }
  }

  openViewPopup(data:any){
    this.authorityPaperService.getPaperDetailsData(data.identity).subscribe((result:any)=>{
      this.paperDetailsDto=result;

      const dialogRef = this.dialog.open(ViewPaperDetailsPopupComponent, {
        width: '1150px',
        // height: '530px',
        data: {
          revokeData: this.paperDetailsDto
         }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    })
  }

  GoPaperDetails()
  {
    this.router.navigateByUrl('/paper-details/recent');
  }

}
