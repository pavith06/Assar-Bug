import { AdminService } from 'src/app/service/admin.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { DashboardInputDto } from 'src/app/models/dashboard-data-dto/dashboard-input-dto';
import { DashboardCount, DashboardService } from './../../service/dashboard.service';

import { Component, OnInit } from '@angular/core';
import { stockDto } from 'src/app/models/allocation-pool-dto';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Date_Select } from 'src/app/common/enum/enum';
import { RouteDashboardService } from 'src/app/service/routedashboard.service';
import { Router } from '@angular/router';

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
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class DashboardHeaderComponent implements OnInit{
  output: string;
  stockCount:stockDto;
  authorityDashboardCount:DashboardCount[];
  isAdmin:boolean;
  allocatedStockCount = 0;
  pendingStockCount = 0;
  minDate= new Date();
  maxDate=null;

  constructor(private dashBoardService:DashboardService, private adminService:AdminService, private translate:TranslateService,
  private router:Router,
  private authGuardService:RouteDashboardService){

  }
  SelectedDate='';
  ngOnInit(): void {
    this.SelectedDate = this.translate.instant('Dashboard.Current Year');
   this.getDashBoardCount();


   this.translate.onLangChange.subscribe(() => {
    this.SelectedDate = this.translate.instant('Dashboard.Current Year');

  });

  }

  getDashBoardCount(){
    this.isAdmin  = this.adminService.isAssociationUser();
    if (this.isAdmin) {
     this.dashBoardService.getAuthorityDashBoardCount(this.isAdmin).subscribe((response)=>{
       if (response) {
         this.authorityDashboardCount = response['content'];
         this.authorityDashboardCount.forEach(element => {
           if (element.status === 2) {
             this.pendingStockCount = element.count;
           }else if(element.status===3){
             this.allocatedStockCount = element.count;
           }
         });
       }
     })
    }else{
     this.dashBoardService.getStockCount(this.isAdmin).subscribe((response)=>{
       if (response) {
         this.stockCount = response['content'];
       }
     })
    }
  }
  barChartDto = new DashboardInputDto();

  fromDate = new FormControl();
  toDate = new FormControl();

  // SelectedDate = 'Current Year';

  setMinDate(event:any){
    this.minDate=event.value._d;
  }

  setMaxDate(event:any){
    this.maxDate=event.value._d;
  }


  select(data: any) {
    const dateFormate = data;

    if (dateFormate === 'Apply Filter') {
      const timeZoneOffsetMinutes:number = new Date().getTimezoneOffset();
      this.SelectedDate = this.translate.instant('Dashboard.Custom');
      this.barChartDto.filterType=Date_Select.CUSTOM;
      const fromDate:Date=this.fromDate.value._d;
      fromDate.setMinutes(fromDate.getMinutes() - timeZoneOffsetMinutes )
      this.barChartDto.fromDate = fromDate;


      const toDate:Date=this.toDate.value._d;
      toDate.setMinutes((toDate.getMinutes() - timeZoneOffsetMinutes) + 1439 )
      this.barChartDto.toDate = toDate;
      this.dashBoardService.setAddNew(this.barChartDto);
    } else if (dateFormate === 'Current Month') {
      const timeZoneOffsetMinutes:number = new Date().getTimezoneOffset();
      this.SelectedDate=this.translate.instant('Dashboard.'+dateFormate);
      this.barChartDto.filterType=Date_Select.MONTH;
      const monthStart =new Date (moment().startOf('month').format('MM/DD/YYYY HH:mm:ss'));
      monthStart.setMinutes(monthStart.getMinutes() - timeZoneOffsetMinutes)
      this.barChartDto.fromDate = monthStart;


      const monthEnd = new Date (moment().endOf('month').format('MM/DD/YYYY HH:mm:ss'));
      monthEnd.setMinutes((monthEnd.getMinutes() - timeZoneOffsetMinutes) + 1439)
      this.barChartDto.toDate = monthEnd;
      this.dashBoardService.setAddNew(this.barChartDto);
    } else if (dateFormate === 'Current Year') {
      const timeZoneOffsetMinutes:number = new Date().getTimezoneOffset();
      this.SelectedDate=this.translate.instant('Dashboard.'+dateFormate);
      const yearStart = new Date(moment().startOf('year').format('MM/DD/YYYY HH:mm:ss'));
      yearStart.setMinutes(yearStart.getMinutes() - timeZoneOffsetMinutes);
      this.barChartDto.fromDate = yearStart;   
      
      const yearEnd = new Date(moment().endOf('year').format('MM/DD/YYYY HH:mm:ss'));
      yearEnd.setMinutes((yearEnd.getMinutes()-timeZoneOffsetMinutes) + 1439)
      this.barChartDto.toDate = yearEnd;
      this.barChartDto.filterType=Date_Select.YEAR;
      this.dashBoardService.setAddNew(this.barChartDto);
    } else if (dateFormate === 'Current Date') {
      const timeZoneOffsetMinutes:number = new Date().getTimezoneOffset();
      this.SelectedDate=this.translate.instant('Dashboard.'+dateFormate);
      this.barChartDto.filterType=Date_Select.Date;
      const dateStart = new Date(moment().startOf('date').format('MM/DD/YYYY HH:mm:ss'));
      dateStart.setMinutes(dateStart.getMinutes()- timeZoneOffsetMinutes);
      this.barChartDto.fromDate = dateStart;


      const dateEnd =new Date(moment().endOf('date').format('MM/DD/YYYY HH:mm:ss'));
      dateEnd.setMinutes((dateEnd.getMinutes()- timeZoneOffsetMinutes)+ 1439)
      this.barChartDto.toDate = dateEnd;
      this.dashBoardService.setAddNew(this.barChartDto);
    }
  }

  onOpeningMenu(){
    this.fromDate=new FormControl();
    this.toDate=new FormControl();
    this.minDate=null;
    this.maxDate=null;
  }

  goToPurchaseStock() {
    this.router.navigate(['/purchase-stock']);
  }
 
  goToPaperDetails() {
    this.router.navigate(['/paper-details']);
  }
}
