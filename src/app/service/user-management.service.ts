import { MenuDto } from './../models/user-role-management/menu-dto';
import { userPageDto } from './../models/user-role-management/user_pageDto';
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserRolePage } from './../models/user-role-management/user-role-pageDto';
import { UserRoleDto } from './../models/user-role-management/userRoleDto';
import { MetaDataDto, userDissableDto } from 'src/app/models/report-loss-dto/meta-data-dto';
import { RoleDto, UserDto } from './../models/user-role-management/role-dto';
/* eslint-disable @typescript-eslint/no-empty-function */
import { FieldGroupDTO } from './../models/field-group-dto';
import { Field } from './../models/report-loss-dto/field';
import { FieldDTO } from './../models/field-dto';
import { FieldValueDTO } from './../models/field-value-dto';
import { Section } from './../models/report-loss-dto/section';
import { BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { appConst } from './app.const';
import { PoolDto } from '../models/allocation-pool-dto';
import { FilterOrSortingVo } from '../models/Filter-dto/filter-object-backend';
import { FieldConfig } from '../models/field-config';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
 
  loaderData = new BehaviorSubject([]);
  editedField = new BehaviorSubject(Field);
  private baseUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }


  private ClickAddnew = new BehaviorSubject<boolean>(false);
  private headerMenuRefresh =new BehaviorSubject<boolean>(false);

  public ClickAdd$ = this.ClickAddnew.asObservable();


  getAccessMappingDetails(pageid:string,userRoleId:string){
    if (userRoleId!==null) {
      return this.http.get<any>(this.baseUrl + "/api/get-role-page-info?page_id="+ pageid + "&role_id="+ userRoleId )
    }else{
      return this.http.get<any>(this.baseUrl + "/api/get-role-page-info?page_id="+ pageid )

    }
  }
  getFieldMetaDataForGeneratePaper(pageId:string) {
    return this.http.get<any>(this.baseUrl + "/api/paper-details/get-metadata-for-generate-paper?pageId="+pageId);
  }

  getMetaData(pageId:string){
    return this.http.get<any>(this.baseUrl + "/api/paper-details/get-metadata?pageId="+pageId);
  }

  saveFieldMetaData(data:MetaDataDto,uploadType:string,actionType:string) {

    const fieldGroupDTO: FieldGroupDTO = this.convertToFieldGroup(data.sectionList,UserManagementService.DIGITAL_PAPER_DTO);


    return this.http.post(this.baseUrl+"/digital-paper/save?uploadType="+uploadType+'&actionType='+actionType ,fieldGroupDTO);
  }

  sendUserRoleData(data:MetaDataDto,accessMap:RoleDto,isActive:boolean){
    const fieldGroupDTO: FieldGroupDTO = this.convertToFieldGroup(data.sectionList,UserManagementService.USER_MANAGEMENT_ROLE__GROUP_NAME);
    const sendUserRoleDetails = new UserRolePage();
    sendUserRoleDetails.roleDetails = fieldGroupDTO;
    sendUserRoleDetails.accessMapping = accessMap;
    sendUserRoleDetails.isActive = isActive;
    return this.http.post(this.baseUrl + "/api/user-role/saveOrUpdate",sendUserRoleDetails)
  }

  sendUserData(data:MetaDataDto,notification:MenuDto[],isActive:boolean){
    const fieldGroupDTO: FieldGroupDTO = this.convertToFieldGroup(data.sectionList,UserManagementService.USER_MANAGEMENT_GROUP_NAME);
    const sendUserDetails = new userPageDto();
    const userDto = new UserDto()
    userDto.menuData = notification;
    sendUserDetails.isActive = isActive;
    sendUserDetails.userDetails = fieldGroupDTO;
    sendUserDetails.enableNotification = userDto;
    return this.http.post(this.baseUrl + "/api/user-management/saveOrUpdate" + "?platform_id=" + "e31c7ccb51d047e7930b5cf5908ae9de",sendUserDetails)


  }

  private static USER_MANAGEMENT_ROLE__GROUP_NAME = 'UserRoleManagementDto';
  private static DIGITAL_PAPER_DTO = 'DigitalPaperDto';
  private static USER_MANAGEMENT_GROUP_NAME = 'UserManagementDto';
  public convertToFieldGroup(sectionList: Section[],groupName:string): FieldGroupDTO {
    const fieldGroupDTO: FieldGroupDTO = {
      groupName: groupName,
      fieldValues: [],
      fieldGroups: []
    };

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

  getCardDetails(min:number,max:number,filter:FilterOrSortingVo[],searchValue:string){
    return this.http.post<CardDetails>(this.baseUrl + "/api/get-role-card"+'?min=' + min+'&max='+max+'&searchValue='+searchValue,filter);
  }

  userRoleDownload(min:number,max:number, filter:FilterOrSortingVo[], searchValue:string){
    return this.http.post(this.baseUrl + "/api/download-role-card"+'?min=' + min+'&max='+max+'&searchValue='+searchValue,filter, { responseType: 'blob' });
    
  }

  getTotalCountForUserRole(filter:FilterOrSortingVo[],searchValue:string){
    return this.http.post<CardDetails>(this.baseUrl + "/api/get-role-list-count"+'?searchValue=' + searchValue,filter);
  }


  getUserManagementTableCount(filterVo: FilterOrSortingVo[], searchValue:string){
    return this.http.post<any>(this.baseUrl + "/api/get-user-management-count?searchValue="+ searchValue,filterVo)
  }

   getUserDetails(pageId:string,userId:any){

    if (userId !== 'null' && userId !== null) {
      return this.http.get<any>(this.baseUrl + "/api/get-user-management-page-info?page_id="+ pageId +"&user_id=" + userId)
    }else{
      return this.http.get<any>(this.baseUrl + "/api/get-user-management-page-info?page_id="+ pageId)

    }
  }

  getUserManagementTableList(min:number,max:number,filterVo: FilterOrSortingVo[], searchvalue:string){

    return this.http.post<any>(this.baseUrl + "/api/get-user-management-list"+'?min=' + min+'&max='+max+'&searchValue='+searchvalue,filterVo)
  }

  deleteUserDetails(userRoleDissabel:userDissableDto){
    return this.http.post(this.baseUrl + "/api/user-management/deleteUser",userRoleDissabel,{})
  }

  userDownloadMethoad(min:number,max:number,filterVo: FilterOrSortingVo[],searchValue:string) {
    return this.http.post(this.baseUrl + "/api/download-user-management-list"+'?min=' + min+'&max='+max+'&searchValue='+searchValue,filterVo, { responseType: 'blob' })
  }

  deleteUserRoleDetails(userListDissabelDto: userDissableDto){
    return this.http.post(this.baseUrl + "/api/user-role/deleteRole",userListDissabelDto,{})
  }


  getPageBasedOnRoles(list:number[]){
    const listOfRole = new ListOfRoles();
    listOfRole.listOfRoles = list;
    return this.http.post<any>(this.baseUrl + "/api/user-management/showPages"  ,listOfRole)
  }


  downloadUserExcelList(){
   return this.http.get(this.baseUrl + "/api/user-management/download-excel" , {responseType: 'blob'})
  }


  downloadRoleExcelList(){
    return this.http.get(this.baseUrl + "/api/user-role/download-excel" , {responseType: 'blob'})
   }

   setAddNew(value:boolean){
      return this.ClickAddnew.next(value);
  }

  getDropdownData(){
    const filter:FilterOrSortingVo[] = [];
    return this.http.post<AllocationUserTypeDto[]>(this.baseUrl + "/api/user-role/get-user-type",filter)
  }

  getOneStockPoolCount(identity:string){
    return this.http.post(this.baseUrl + "/digital-paper/allocation-pool/get-stock-pool?id=" + identity,{})
  }

  poolAction(poolDto:PoolDto){
    return this.http.post(this.baseUrl + "/digital-paper/allocation-pool/pool-action", poolDto)
  }

  getAllStockPool(filterObject:FilterOrSortingVo[],identity:string,min:number, max:number, searchValue:string){
    if (identity!== null) {
      return this.http.post(this.baseUrl + "/digital-paper/allocation-pool/get-all-stockpool?id=" + identity + "&min=" + min + "&max="+ max+ "&searchValue="+ searchValue,filterObject)
    }else{
      return this.http.post(this.baseUrl + "/digital-paper/allocation-pool/get-all-stockpool?min=" + min + "&max="+ max +"&searchValue="+ searchValue,filterObject)
    }
  }

  getStatusChange(identity:string, status:boolean){
    return this.http.post(this.baseUrl + "/digital-paper/allocation-pool/change-stockpool-status?status=" + status +"&id="+ identity,{})
  }

  getTotalCountForUserType() {
    return this.http.get<any>(this.baseUrl + "/digital-paper/allocation-pool/get-stockpool-count")
  }

  getAllocationType() {
    return this.http.get<any>(this.baseUrl + "/digital-paper/allocation-pool/get-allocation-type");
  }

  setDashBoardHeaderRefresh(value:boolean) {
    this.headerMenuRefresh.next(value);
  }

  getDashboardHeaderRefresh(){
     return  this.headerMenuRefresh.asObservable();
  }

}

export class CardDetails{
  roleId:number;
  roleName:string;
  description:string;
  userCount:number;
  isActive:boolean;
  inActiveDate:string;
  isMapped:boolean;
  roleIdentity:string;
}

export class ListOfRoles{
  listOfRoles:number[];
}

export class AllocationUserTypeDto{
  userTypeName:string;
  identity:string;
}
