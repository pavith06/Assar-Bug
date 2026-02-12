import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardInputDto } from 'src/app/models/dashboard-data-dto/dashboard-input-dto';
import { TransactionsListDto } from 'src/app/models/purchase-stock-dto/transactions-list-dto';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { ViewPurchaseStockPopupComponent } from 'src/app/purchase-stock-list/view-purchase-stock-popup/view-purchase-stock-popup.component';
import { AdminService } from 'src/app/service/admin.service';
import { DashboardChartService } from 'src/app/service/dashboard-chart.service';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-recent-transactions',
  templateUrl: './recent-transactions.component.html',
  styleUrls: ['./recent-transactions.component.scss']
})
export class RecentTransactionsComponent implements OnInit {

  recentTransactionList:TransactionsListDto[];
  dashboardInputData= new DashboardInputDto();
  @Input() authorityRecentTransactionAccessDataFromParent:AccessMappingSectionDto;
  isAdmin: boolean;
  noDataFound=false;

  constructor(private router:Router,private dashboardService:DashboardChartService,private dialog:MatDialog,private dashBoardService: DashboardService, private adminService: AdminService)
  {
    this.dashBoardService.isChecked$.subscribe((value) => {
      if (value) {
        this.dashboardInputData = value;
        this.getRecentTransactions(this.dashboardInputData);
      }
    });
  }
  ngOnInit(): void {
      this.getRecentTransactions(this.dashboardInputData);
  }

  getRecentTransactions(dashboardInputData: DashboardInputDto) {
    if (Object.keys(dashboardInputData).length === 0) {
      const startDate = moment().startOf('year').format('MM/DD/YYYY');
      const endDate = moment().endOf('year').format('MM/DD/YYYY');

      dashboardInputData.fromDate = new Date(startDate);
      dashboardInputData.toDate = new Date(endDate);
      dashboardInputData.filterType = 'YEAR';
    }

    if(this.authorityRecentTransactionAccessDataFromParent.isView===false){
          return;
    }

    this.isAdmin = this.adminService.isAssociationUser();

    if (this.isAdmin) {
      this.dashboardService.getAllRecentTransactions(this.dashboardInputData).subscribe((data) => {
        this.recentTransactionList = data['content'];
        this.noDataFound=this.recentTransactionList.length===0?true:false;
      })
    }

  }


  GoPaperDetails()
  {
    this.dashboardService.getAllCompaniesId().subscribe((value)=>{
      let companyId:number[]=value['content'];
      const arr = JSON.stringify(companyId);
      sessionStorage.setItem("companyId",arr);
      this.router.navigateByUrl('/authority-paper-details/transaction-history')
    })

  }

  openViewPopup(element: any) {
    const dialogRef = this.dialog.open(ViewPurchaseStockPopupComponent, {
      width: '1561px',
      height: '569px',
      data: { approve: true, reject: true, purchaseStockData: element },
      //  height: '75%'

    });

    dialogRef.afterClosed().subscribe();

  }
}
