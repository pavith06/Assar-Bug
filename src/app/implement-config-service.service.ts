import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { implementConfigurationVo } from './page-config/implement-config/implement-config.component';

@Injectable({
  providedIn: 'root'
})
export class ImplementConfigServiceService {
       
  private baseUrl = environment.API_BASE_URL+ "/digital-paper";
  private commonUrl = environment.API_BASE_URL+ "/api";
  
  constructor(private http: HttpClient) { }

  getInsuredUserList() {
    return this.http.get(this.commonUrl+"/get-insurance-user-data");
  }

  addUserType(userTypeName: string) {
    return this.http.post(this.commonUrl+"/save-allocation-type",userTypeName);
  }

  saveImplementationConfiguration(data:implementConfigurationVo[]) {
    return this.http.post(this.commonUrl+"/save-implement-configuration",data);
  }
  saveDigitalPaperTemplate(htmlTemplate:string) {
    const authorityId = 1;
    return this.http.post(this.baseUrl+"/save-digitalpaper-template"+"?authorityId="+authorityId,htmlTemplate);
  }
  getSavedConfiguration(dataList:implementConfigurationVo[]) {
    return this.http.post(this.commonUrl+"/get-implement-configure-data",dataList);
  }

}
