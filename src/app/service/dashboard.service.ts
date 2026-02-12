import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConstantService } from './constants.service';
import { BarChartDto } from '../models/dashboard-dto/barchart-dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { stockDto } from '../models/allocation-pool-dto';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.API_BASE_URL+"/digital-paper";
  private logoUrl = environment.API_BASE_URL;
  constructor(private http:HttpClient) { }
  @Output() isCheck= new EventEmitter<boolean>();
  private forDate = new BehaviorSubject<BarChartDto>(null);
  public isChecked$ = this.forDate.asObservable();
 reportForList(){
  return this.http.get(this.baseUrl+ConstantService.dashboard+ConstantService.reportList);
}

/**
 *
 * @param param
 * @returns
 */
  getLoggedInUserCompanyId(param: any){
    return this.http.get(environment.API_BASE_URL+'/api/company/get-company',{params : param});
  }
  toggleTrueOrNot(value:boolean){
    this.isCheck.emit(value);
}

getCompanyLogo(id:number){
  return this.http.get(this.logoUrl + '/api/company/get-logo?companyId='+ id)
}

getBarChartData(dashBoardInputDto:BarChartDto):any {
  return this.http.post<any>(this.baseUrl +'/dashboard/inscompany-barchart',dashBoardInputDto);
}

getAuthorityBarChart(dashBoardInputDtoForAuthority: BarChartDto):any {
  return this.http.post<any>(this.baseUrl + '/dashboard/association-barchart',dashBoardInputDtoForAuthority);
}

getAddNew():Observable<BarChartDto> {
  return this.forDate;

}
setAddNew(value:BarChartDto){
  return this.forDate.next(value);
}

getStockCount(isAdmin:boolean) {
  if (!isAdmin) {
    return this.http.get<stockDto>(this.baseUrl + '/get-stock-count');
  }
}

getAuthorityDashBoardCount(isAdmin:boolean){
if (isAdmin) {
  return this.http.get<DashboardCount[]>(this.baseUrl + '/authority/get-dashboard-count');
}
}

}

export class DashboardCount {
  status: number;
  count: number;
}
