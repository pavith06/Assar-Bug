import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApprovalLevelDto, ApprovalLimitDto } from '../models/approval-limit-dto';
import { Messager, UserDataDTO, UserTotalDTO } from '../models/user-data-dto';

@Injectable({
  providedIn: 'root'
})
export class UserListService {
  private baseUrl = environment.API_BASE_URL+"/api";
  @Output() cardShow= new EventEmitter<boolean>();
  @Output() isClone= new EventEmitter<boolean>();
  private ClickAddnew = new BehaviorSubject<boolean>(false);
  public ClickAdd$ = this.ClickAddnew.asObservable();
  constructor(private http:HttpClient,private router:Router) { }


  getUserTableDate(userId) {
    // return this.http.get(userId);

    // const data:UserDataDTO[]= [
    //   {
    //     RoleName: 'yuva',
    //      Description: 'Helium',
    //       AddedData: '12/01/2023', Mapped: 'Mapped',
    //       Status:'Active'
    //   },
    //   {RoleName: 'rani', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'bharathi', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'raja', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'hari', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'chandru', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'saravana', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'eli', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'sri', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'mari', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'sree', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'wanted', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'more', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'each', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'for', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'loop', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    //   {RoleName: 'example', Description: 'Helium', AddedData: '12/01/2023', Mapped: 'Mapped',Status:'Active'},
    // ];
    // const myObservable = from(data);
    return null;
  }

  getUserTotalList(){
    // return this.http.get(userId);
    const data:UserTotalDTO[] = [
      {
        name: '123',
      },
      {
        name: '543',
      },
      {
        name: '65',
      },
    ];
    const myObservable = from(data);
    return myObservable;
  }


  fileUploadData(){
    const response=[
      {
        uploadimage:"/assets/cloud-upload.svg",
         text:"Drag & Drop the Document here ",
         "width":" 152px",
         "left0": "41px",
         "left-1":"41px",
         "width1": "100%",
        //  "border": "none",
         "height": "232px",
         "border": "1px solid",
         "radius": "124px",
         updatedImage:"/assets/file-text.svg",
          }
            // {
            //    image:"assets/Tp_details.svg",
            //     title:"Tp Details",
            //      "marginleft":"74px",
            //       "position":"absolute"
            //      },
    ]

    return of(response)
  }


DynamicFormData(){
    const responce=[
      {
        "pageId": "1",
        "claimId": null,
        "sectionList": [
            {
                "sectionId": "1",
                "sectionName": "Notification Stage",
                "parentSection": 0,
                "association": 1,
                "subSectionList": [
                    {
                        "sectionId": "6",
                        "sectionName": "Insured Details",
                        "fieldList": [
                            {
                                "fieldId": "1",
                                "fieldName": "registration No",
                                "fieldType": "text",
                                "value": "",
                                "mandatory": false,
                                "coreData": false
                            },
                            {
                              "fieldId": "1",
                              "fieldName": "Select Name",
                              "fieldType": "dropdown",
                              "value":"select data",
                              "option":[{
                                opt:"yuva"
                              },{
                                opt:"maha"
                              },{
                                opt:"rani"
                              },{
                                opt:"siva"
                              },{
                                opt:"sri"
                              }],
                              "mandatory": true,
                              "coreData": false
                          },
                          {
                            "fieldId": "1",
                            "fieldName": "Last Name",
                            "fieldType": "checkbox",
                            "value": "",
                            "mandatory": false,
                            "coreData": false
                        },
                        {
                          "fieldId": "1",
                          "fieldName": "Date",
                          "fieldType": "date",
                          "value": "",
                          "mandatory": false,
                          "coreData": false
                      },
                      {
                        "fieldId": "1",
                        "fieldName": "Phnone Number",
                        "fieldType": "text",
                        "value": "",
                        "mandatory": false,
                        "coreData": false
                    }
                        ]
                    }
                ]
            }
        ],
        "receivable": false
    }
    ]
    return of(responce)
}

// PreviouseMesgData(){
//   const data:Meassager[] = [
//       {
//       Sender: "hi",
//       Receiver: "hi",
//       date:"2.30 1/01/2023"
//     },
//     {
//       Sender: "qiueryuertwuetrweuryweiruerer",
//       Receiver: "hi",
//       date:"2.30 1/01/2023"
//     },
//     {
//       Sender: "dmnsdhfsgkfjsnfsdf",
//       Receiver: "hi",
//       date:"2.30 1/01/2023"
//     },
//     {
//       Sender: "sefkjshfjksdncmzxvxv",
//       Receiver: "hi",
//       date:"2.30 1/01/2023"
//     },
//     {
//       Sender: "dfidfsidufssef",
//       Receiver: "hi",
//       date:"2.30 1/01/2023"
//     }, {
//       Sender: "kjfhkjsdfnskjdfshfkjsdf",
//       Receiver: "hi",
//       date:"2.30 1/01/2023"
//     }

// ];
//   const myObservable = from(data);
//   return myObservable;

// }

getUserComments(claimId: number):Observable<any>{

      return this.http.get(this.baseUrl+"/reportloss/comments?claimId="+claimId);
  }

  setUserComments(claimId:number, data:Messager):Observable<any>{
    // claimId=this.claimId;
      return this.http.post(this.baseUrl+"/reportloss/comments?claimId="+claimId,data);
  }

  getFieldList(){
    return this.http.get<any>(this.baseUrl+"/Approvallimit/field-list")
  }
  getRoleList(){
    return this.http.get<any>(this.baseUrl+"/Approvallimit/role-list")
  }
  saveApprovalLimit(ApprovalLimitDto:any){
    return this.http.post(this.baseUrl+"/Approvallimit/saveOrUpdate",ApprovalLimitDto)
  }
  getApprovalLimitList(min:number,max:number){
    return this.http.get<ApprovalLimitDto[]>(this.baseUrl+"/Approvallimit/get-approval-list"+'?min=' + min+'&max='+max);
  }

  getApprovalLimitCount(){
    return this.http.get<ApprovalLimitDto[]>(this.baseUrl+"/Approvallimit/get-approval-count");
  }

  DeleteApprovalimit(approvalLimitId:any){
    return this.http.get(this.baseUrl+"/Approvallimit/delete-list?approvalLimitId=" +approvalLimitId);
  }
  getAppprovalLimitByIdentity(approvalLimitId:any){
    return this.http.get<ApprovalLimitDto>(this.baseUrl+"/Approvallimit/edit-list?approvalLimitId=" +approvalLimitId)
  }
  public showCard(value){
    this.cardShow.emit(value);
}

  getClaimHistory(claimId: number):Observable<any>{
    return this.http.get(this.baseUrl+"/claim/history?claimId="+claimId);
  }
  public clone(value){
    this.isClone.emit(value);
}

getAddNew():Observable<boolean> {
  return this.ClickAddnew;
 
}
setAddNew(value:boolean){
  return this.ClickAddnew.next(value);
 
}
}
