import { Injectable } from '@angular/core';
import { FieldConfig } from '../models/field-config';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SectionDetailsDto } from '../models/field-configuration-dto/section-details-dto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FieldConfigurationService {

  private loaderData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}
  addOrUpdateFields(dpFieldConfiguratorDto: FieldConfig) {
    return this.http.post(environment.API_BASE_URL + '/api/dp-page-config/save-update-fields',dpFieldConfiguratorDto);
  }

  public getDropDownList(){
    return this.http.get(environment.API_BASE_URL+"/api/dp-page-config/dp-drop-down-list");
  }

  deleteDropDownOption(identity: string) {
    return this.http.post(environment.API_BASE_URL+'/api/dp-page-config/delete-dropdown-option?identity='+identity,{});
  }

  getSectionNames(pageIdentity: string,parentSectionId:number) {
    return this.http.get(environment.API_BASE_URL+"/api/dp-page-config/get-section-names"+"?pageIdentity="+pageIdentity+"&parentSectionId="+parentSectionId,{});
  }

  addSectionName(sectionDetailsDto: SectionDetailsDto) {
    return this.http.post(environment.API_BASE_URL+'/api/dp-page-config/add-section-name',sectionDetailsDto);
  }

  saveConfigureSection(sectionDetailsDto: SectionDetailsDto[]) {
    return this.http.post(environment.API_BASE_URL+'/api/dp-page-config/update-section-name',sectionDetailsDto);
  }

  deleteSectionName(identity: string) {
    return this.http.post(environment.API_BASE_URL+'/api/dp-page-config/delete-section-name?identity='+identity,{});
  }

  getAddNew(): Observable<any> {
    return this.loaderData.asObservable();
  }

   setAddNew(value: any) {
    this.loaderData.next(value)
  }

}
