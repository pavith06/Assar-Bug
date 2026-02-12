import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaperDetailsListDto } from 'src/app/models/paper-details-dto/paper-details-list-dto';
import { ViewPaperDetailsPopupComponent } from 'src/app/paper-details-list/view-paper-details-popup/view-paper-details-popup.component';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DashboardInputDto } from 'src/app/models/dashboard-data-dto/dashboard-input-dto';
import * as moment from 'moment';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-upcoming-expiry-digital-papers',
  templateUrl: './upcoming-expiry-digital-papers.component.html',
  styleUrls: ['./upcoming-expiry-digital-papers.component.scss']
})
export class UpcomingExpiryDigitalPapersComponent implements OnInit {
  upComingExpiryDigitalPapers:PaperDetailsListDto[];
  paperDetailsDto: PaperDetailsListDto;
  dashboardInputData= new DashboardInputDto();
  noDataFound=false;

  @Input() companyUpcomingExpiryPaperAccessDataFromParent:AccessMappingSectionDto;
  isAdmin: boolean;
  constructor(private dashBoardService:DashboardChartService,private router:Router,private dialog: MatDialog,private authorityPaperService:AuthorityPaperService,
    private timeFilter: DashboardService,private adminService: AdminService ){
      this.timeFilter.isChecked$.subscribe((value) => {
        if (value) {
          this.dashboardInputData = value;
          this.getUpcomingExpiryDigitalPapers(this.dashboardInputData);
        }
      });
  }
  ngOnInit(): void {
    this.getUpcomingExpiryDigitalPapers(this.dashboardInputData);
  }

  getUpcomingExpiryDigitalPapers(dashboardInputData: DashboardInputDto) {
    if (Object.keys(dashboardInputData).length === 0) {
      const startDate = moment().startOf('year').format('MM/DD/YYYY');
      const endDate = moment().endOf('year').format('MM/DD/YYYY');

      dashboardInputData.fromDate = new Date(startDate);
      dashboardInputData.toDate = new Date(endDate);
      dashboardInputData.filterType = 'YEAR';
    }

    if(this.companyUpcomingExpiryPaperAccessDataFromParent.isView===false){
      return;
    }
    this.isAdmin = this.adminService.isAssociationUser();

    if(!this.isAdmin){
      this.dashBoardService.getUpcomingExpiryDigitalPapers(dashboardInputData).subscribe((data) => {
        this.upComingExpiryDigitalPapers = data['content'];
        this.noDataFound=this.upComingExpiryDigitalPapers.length===0?true:false;
      });
    }
  }

  GoPaperDetails(){
    this.router.navigateByUrl('/paper-details/expiry')
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
    });
  }
}
