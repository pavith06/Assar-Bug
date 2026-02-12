import { Router } from '@angular/router';
import { UserManagementService, CardDetails } from './../../../service/user-management.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserTotalDTO } from 'src/app/models/user-data-dto';
import { UserListService } from 'src/app/service/user-list.service';

@Component({
  selector: 'app-common-card',
  templateUrl: './common-card.component.html',
  styleUrls: ['./common-card.component.scss']
})
export class CommonCardComponent implements OnInit{

  @Output() sendRoleId = new EventEmitter<string>();
  userTotalLength: any;
  minLength: number;
  maxLength: number;
  constructor(private userCard:UserManagementService,private route:Router){ }
  userTotal:UserTotalDTO[]=[];




/** Mock data Object */
// userListData:any[]=[
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Manager',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Inactive'
// },
// {
//   role:'Sub Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Inactive'
// },
// {
//   role:'Manager',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Inactive'
// },
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Manager',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Inactive'
// },
// {
//   role:'Sub Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Inactive'
// },
// {
//   role:'Manager',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Active'
// },
// {
//   role:'Admin',
//   userCount:'768',
//   role_id:'CM1234',
//   status:'Inactive'
// }
// ];

cardList:CardDetails[];

ngOnInit(): void {
  this.getTotalCardList();
}

getTotalCardList(){
  this.minLength =0;
  this.maxLength = 0;
  this.getCardList(this.minLength, this.maxLength);
}

getCardList(min:number,max:number){
  const platformIdentity = sessionStorage.getItem("platformIdentity")
  this.userCard.getCardDetails(min,max,[],"").subscribe((response)=>{
    if (response) {
      this.cardList = response['content'];
    }
  });
}

getOneUserRole(role:number){
  this.sendRoleId.emit(role.toString())
}

 }
