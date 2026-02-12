import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { AdminService } from './admin.service';
import { DashboardInputDto } from '../models/dashboard-data-dto/dashboard-input-dto';
import { BehaviorSubject } from 'rxjs';
import { DoughnutData } from '../dashboard-charts/dashboard-doughnut/dashboard-doughnut.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardChartService {
  baseUrl = environment.API_BASE_URL +"/digital-paper"+"/dashboard";
  private getListData = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) { }

  getRecentDigitalPapersList(barChartDto: DashboardInputDto){
      return this.http.post(this.baseUrl+"/get-recent-digital-papers",barChartDto);
  }

  getUpcomingExpiryDigitalPapers(barChartDto: DashboardInputDto){
    return this.http.post(this.baseUrl+"/get-expiry-digital-papers",barChartDto);
  }

  getAllRecentDigitalPapers(barChartDto: DashboardInputDto){
    return this.http.post(this.baseUrl+"/get-all-recent-digital-papers",barChartDto);
  }

  getAllRecentTransactions(barChartDto: DashboardInputDto){
    return this.http.post(this.baseUrl+"/get-all-recent-transactions",barChartDto);
  }

  getTopCompaniesPurchases(dashboardInputDto:DashboardInputDto){
    return this.http.post(this.baseUrl+"/get-companies-top-purchases",dashboardInputDto);
  }

  getAllCompaniesId(){
    return this.http.get(this.baseUrl+"/get-all-companyIds");
  }

  getPaperComapnyIds(){
    return this.http.get(this.baseUrl+"/get-paper-companyIds");
  }

  setValue(value: boolean) {
    this.getListData.next(value);
  }

  getValue() {
    return this.getListData.asObservable();
  }


  getDoughNutChartData(dashboardInputDto:DashboardInputDto,isAssociation:boolean ) {    
    if (isAssociation) {
      return this.http.post<DoughnutData>(this.baseUrl + "/doughnut-association-count", dashboardInputDto);
    }else{
      return this.http.post<DoughnutData>(this.baseUrl + "/doughnut-insurance-count", dashboardInputDto);
    }
  }
 
   getPredictionChartData() {
     return this.http.get(this.baseUrl+'/get-prediction-data');
   }
}
