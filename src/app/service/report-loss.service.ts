import { TotalLoss } from './../models/report-loss-dto/total-loss';
/* eslint-disable @typescript-eslint/no-empty-function */

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { FieldDTO } from '../models/field-dto';
import { AllocateStockVo, FieldGroupDTO, PurchaseStockData } from '../models/field-group-dto';
import { FieldValueDTO } from '../models/field-value-dto';
import { Field } from '../models/report-loss-dto/field';
import { ReportLossData } from '../models/report-loss-dto/report-loss-data';
import { Section } from '../models/report-loss-dto/section';
import { FieldConfigureComponent } from '../page-config/field-configure/field-configure.component';
import { FieldConfig } from '../models/field-config';
import { PropertyValues } from '../models/purchase-stock-dto/propert-values-dto';

@Injectable({
  providedIn: 'root'
})
export class ReportLossService {

  loaderDataForTabChange = new BehaviorSubject([]);
  editedField = new BehaviorSubject(Field);
  newFieldAdded = new BehaviorSubject('add');
  private baseUrl = environment.API_BASE_URL+ "/digital-paper";
  private commonUrl = environment.API_BASE_URL+ "/api";
  private static REPORT_LOSS_GROUP_NAME = 'ClaimDetailsDto';
  selectedReportData$ = new Subject<any>();
  data:any;
  details:any;
  @Output() isOpen = new EventEmitter<boolean>();
  @Output() view= new EventEmitter<boolean>();
  @Output() viewHistory= new EventEmitter<boolean>();
  @Output() reportView= new EventEmitter<boolean>();
  @Output() hideUser=new EventEmitter<boolean>();
  filledSection$ = new Subject<string>();

  constructor(private http: HttpClient) { }

  public getMetaDataDto(pageId : string, claimId: string){
    if (claimId===null ||  claimId == undefined ) {
      return this.http.get<ReportLossData>(this.baseUrl + "/getpageinfo?page_id=" + pageId  );
    }else{
      return this.http.get<ReportLossData>(this.baseUrl + "/getpageinfo?page_id=" + pageId + "&claim_id=" + claimId);

    }
  }

  public saveReportLoss(reportLossData: ReportLossData,claimId:string,data:Field[]): Observable<any> {

    const fieldGroupDTO: FieldGroupDTO = this.convertToFieldGroup(reportLossData);
    if (claimId===null ||  claimId == undefined ) {
    return this.http.post(this.baseUrl + '/saveOrUpdate?entityName='+ data[0].entityName, fieldGroupDTO);
    }else{
      return this.http.post(this.baseUrl + '/saveOrUpdate?claimId='+ claimId + '&entityName='+ data[0].entityName, fieldGroupDTO);
    }
  }

  public statusButtonFlow(button:string,claimId:string){
     return this.http.get<boolean>(this.baseUrl+"/status/" + button +"?claimId="+ claimId);
  }
  public getInsuredCompanyName(){
    return this.http.get<any>(this.commonUrl+"/get-insuren-company");
  }

  getReportCard() {
    return this.http.get<any>(this.baseUrl+"/get-all-reports");
  }

  public sendTotalLossDetails(totalLoss:TotalLoss){
    return this.http.post(this.baseUrl+"/total-loss",totalLoss);
  }

  public getDropDownData(name : string){
    return this.http.post(environment.API_BASE_URL+"/api/report/getModelDropDownData",name);
  }

  public getTotalLossDropDownValue(name : string){
    return this.http.post(environment.API_BASE_URL+"/api/reasonFor_totalLoss",name);
  }

  public getDropDownList(){
    return this.http.get(environment.API_BASE_URL+"/api/page-config/drop-down/list");
  }

  public modifyMetaData(reqBody:FieldConfig){
    return this.http.post(environment.API_BASE_URL+"/api/page-config/add-modify/fields",reqBody);
  }

  public enableDisableSections(reqBody:Section[]){
    return this.http.post(environment.API_BASE_URL+"/api/page-config/enable-disable/stage",reqBody);
  }

  public getStockDetails(){
    return this.http.get(environment.API_BASE_URL+"/digital-paper/get-total-stock");
  }

  getStockCount(companyId: number) {
    return this.http.get<any>(this.baseUrl+"/get-allocation-stock-count?companyId="+companyId,{});
  }

  public saveOrUpdate(dataList:PurchaseStockData){
    return this.http.post(environment.API_BASE_URL+"/digital-paper/stock-save",dataList);
  }

  public allocateStockSave(dataList:AllocateStockVo){
    return this.http.post(environment.API_BASE_URL+"/digital-paper/allocate-paper-save",dataList);
  }

  public uploadFile(dataList:PurchaseStockData){
    return this.http.post(environment.API_BASE_URL+"/digital-paper/stock-save",dataList);
  }

  public getplateformValue(){
    return this.http.get<PropertyValues>(environment.API_BASE_URL+"/api/get-system-propertyValue");
  }

  public getTotalLossDetails(claimId:string){
    if (claimId===null || claimId=== undefined) {
      return of(null);
    }else{
      return this.http.get<TotalLoss>(this.baseUrl+"/total-loss?claimId="+claimId);
    }
  }
  private convertToFieldGroup(reportLossData: ReportLossData): FieldGroupDTO {
    const fieldGroupDTO: FieldGroupDTO = {
      groupName: ReportLossService.REPORT_LOSS_GROUP_NAME,
      fieldValues: [],
      fieldGroups: []
    };

    const metaData = reportLossData.metaData;
    const sectionList = metaData.sectionList;
    sectionList.forEach((section: Section) => {
      this.getFieldGroupDTO(section, fieldGroupDTO);
    });
    return fieldGroupDTO;
  }

  private getFieldGroupDTO(section: Section, parentFieldGroup: FieldGroupDTO): FieldGroupDTO {
    if(section !== undefined && section !== null) {
      const fieldGroup: FieldGroupDTO = {
        groupName: section.sectionName,
        fieldValues: [],
        fieldGroups: []
      };
      if(section.fieldList && section.fieldList.length > 0) {
        section.fieldList.forEach((field: Field) => {
          const fieldDTO: FieldDTO = {
            fieldId: field.fieldId,
            aliasName:field.aliasName,
            fieldName: field.fieldName,
            fieldType: field.fieldType,
            fieldDefault: field.defaultValues,
            minlength:field.minLength,
            maxlength:field.maxLength,
            regex:field.regex,
            mandatory:field.mandatory
          };
          const fieldValueDTO: FieldValueDTO = {
            field: fieldDTO,
            value: field.value
          };
          fieldGroup.fieldValues.push(fieldValueDTO);
        });
      }
      if(section.sectionList && section.sectionList.length > 0) {
        section.sectionList.forEach((subSection: Section) => {
          this.getFieldGroupDTO(subSection, fieldGroup);
        });
      }
      parentFieldGroup.fieldGroups.push(fieldGroup);
    }
    return parentFieldGroup;
  }
  isOpenStage(value: any) {
    this.isOpen.emit(value);
  }

  showUserComments(data:boolean){
    this.view.emit(data);
}

showClaimHistory(data:boolean){
  this.viewHistory.emit(data);
}

showReportLoss(data:boolean,value:boolean){
  this.hideUser.emit(value)
  this.reportView.emit(data);

}
}
