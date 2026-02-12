import { Component, Inject } from '@angular/core';
import { EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { I18nServiceService } from 'src/app/service/i18n-service.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { DashboardService } from 'src/app/service/dashboard.service';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/service/notification.service';
import { Subscription } from 'rxjs';
import { ErrorHandlerDirective } from '../../directives/errorHandler.directive';
import { NotificationDTO } from 'src/app/models/notification-dto';
import { AppService } from 'src/app/service/role access/service/app.service';
import { appConst } from 'src/app/service/app.const';
import { AdminService } from 'src/app/service/admin.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PurchaseHistoryNotificationDTO } from 'src/app/models/purchase-history-notification-dto';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss']
})
export class NotificationPopupComponent implements OnInit,OnDestroy{

  showmessage=false;
  companyId:number;
  imgUrl='';
  stompClient: any;
  socket: any;
  notificationCount: any = 0;
  companyName: any = '';
  currentCompanyName: string;
  noNotification = false;
  notificationSubscribtion: Subscription;
  notoficationCountSubscription:Subscription;
  notificationDetailsList: NotificationDTO[];
  purchaseHistoryDetailsList: PurchaseHistoryNotificationDTO[]=[];
  isLoadStart=false

  // purchaseHistoryDetailsList:PurchaseHistoryNotificationDTO[];
  menuHeaderList: any;
  notification_Data:any[]=[
    {
      profileImg: 'assets/prfile.svg',
      content:'Garage details has been added for',
      claimId:'1235',
      company:'Partner Insurance Limited',
    },
    {
      profileImg:'assets/prfile.svg',
      content:'Garage details has been added for ',
      claimId:'1235',
      company:'Partner Insurance Limited',
    },
  ]
  public appConst = appConst;

  @Output() showClaimEvent = new EventEmitter<{ claimId: number, isReceivable: boolean }>();
  @Output() fullViewNotification=new EventEmitter<boolean>();
  isReceivable = true;
  fromNotification = false;
  ZERO=0;
  FIFTY=50;
  skip: number;
  countFromNotificationPopup:number;
  clearInterval: NodeJS.Timer;

constructor(  @Inject(MAT_DIALOG_DATA) public data: DialogData,public dialog: MatDialog,private route:Router,  public i18nConf: I18nServiceService,private dashboardService: DashboardService, private activatedRoute: ActivatedRoute,
  private notificationService: NotificationService,private errorHandler: ErrorHandlerDirective, private appservice: AppService, private adminService: AdminService,public dialogRef: MatDialogRef<NotificationPopupComponent>,
  private translate: TranslateService){
  this.getCurrentUrl();
  // this.i18nConf = i18nConf;
  // this.i18nConf.setUpConf();
  this.getLoggedInUserCompanyId();
  this.currentCompanyName  = sessionStorage.getItem("companyName");

  this.purchaseHistoryDetailsList=[];

  this.countFromNotificationPopup=data.notificationCount;
  
  
}
  currentRoute: string;

getCurrentUrl(){
  this.currentRoute = window.location.href;
  this.route.events.subscribe((event: any) => {
    if (event instanceof NavigationEnd) {
      this.currentRoute = event.url
    }
  });

}

  isAdmin:boolean;

  ngOnInit(): void {
  // this.getMenuItems();
  // this.notificationGET();
  // this.notificationCountGET();
  this.isAdmin = this.adminService.isAssociationUser();
  this.activatedRoute.queryParams.subscribe((queryParams: any) => {
    if(!this.fromNotification) {
      this.isReceivable = queryParams["rec"] !== undefined ? queryParams["rec"] !== 'false' : true;
    }
  });

  this.getNotificationMessage(this.ZERO,this.FIFTY,false);
  this.skip=this.FIFTY;
  

    this.clearInterval=setInterval(()=>{
      this.getNotificationMessage(this.skip,this.countFromNotificationPopup,true);
    },2000)
    
    
 
  // this.purchaseHistoryNotificationGet()
  // this.purchaseHistoryNotificationGet();

  }

baseUrl = environment.API_BASE_URL ;
  collapsed=true;
  nav1='dashboard'
  nav2='reportloss'
  nav3='receivable'
  nav4='payable'
  nav5='user'




 /**
   * WEBSCKET CONNECTION & SUBSCRIPTION
   */
 connectWebSocket() {

  const isAdmin = this.adminService.isAssociationUser();
  const associationId = sessionStorage.getItem('associationId');
  this.socket = new SockJS(environment.WEB_SOCKET_URL);
  this.stompClient = Stomp.over(this.socket);
  const _this = this;
  let url = '';
  if (isAdmin) {
     url = '/topic/notification/' + associationId + '/' + isAdmin.toString();
  }else{
    url = '/topic/notification/' + this.companyId + '/' + isAdmin.toString();
  }

  _this.stompClient.connect({}, function (frame: any) {
    _this.stompClient.subscribe(
      url,
      function (response: any) {
        _this.onMessageReceived(response);
      }
    );
  });
}
  /**
   * NOTIFICATION COUNT ADDITION - WEBSOCKET
   * @param response
   */
  onMessageReceived(response: any) {
    const notification = JSON.parse(response.body);
    if(notification != null || notification != undefined){
      this.notificationDetailsList.push(notification);
      this.notificationCount = this.notificationCount + 1;
    }
  }

  /**
   * GET COMPANY ID OF LOGGED-IN USER
   */
  getLoggedInUserCompanyId() {
    const isAdmin = this.adminService.isAssociationUser();
    if (isAdmin) {
      this.connectWebSocket();
      const associationId = sessionStorage.getItem('associationId');
      let associationIdInNumber=null;
      if(associationId){
          associationIdInNumber=Number.parseInt(associationId);
      }
      this.dashboardService.getCompanyLogo(associationIdInNumber).subscribe((response) => {
        if (response) {
          this.imgUrl = response['content']
        }
      });
    }else{

    const identity = sessionStorage.getItem("userIdentity");
    const params = new HttpParams().set("user_id", identity);
    this.dashboardService.getLoggedInUserCompanyId(params).subscribe((data: any) => {
      const name = data.companyId.name;
      this.companyId = data.companyId.companyId;
      if (name != null) {
        this.companyName = name;
        this.connectWebSocket();
      }
      this.dashboardService.getCompanyLogo(this.companyId).subscribe((response) => {
        if (response) {
          this.imgUrl = response['content']
        }
      })
    })
  }
  }
  /**
   * NOTIFICATION GET CALL METHOD
   */
  notificationGET(){

    this.notificationSubscribtion = this.notificationService.getNotificationList().subscribe((res:any)=>{
      if(res) {
        this.notificationDetailsList = res;
      }
    },(error:Response)=>{
      this.errorHandler.getMessage(error);
    })
  }


//   purchaseHistoryNotificationGet()
//   {
//     this.notificationService.getNotificationListPurchaseHistory().subscribe((data:any)=>{
//       if(data)
//       {
// this.purchaseHistoryDetailsList=data
//       }
//     },(error:Response)=>{
//       this.errorHandler.getMessage(error);
//     })
//   }
// digital_paper







  /**
   * NOTIFICATION COUNT CALL GET METHOD
   */
  notificationCountGET(){
    this.notoficationCountSubscription = this.notificationService.getNotificationCount().subscribe((res:any)=>{
      const result = res;
      this.notificationCount = result?.totalCount;
    },(error:Response)=>{
      this.errorHandler.getMessage(error);
    })
  }
  /**
   * DESTROY THE SUBSCRIBTION
   */
  ngOnDestroy(): void {
    if(this.notificationSubscribtion){
      this.notificationSubscribtion.unsubscribe();
    }
    if(this.notoficationCountSubscription){
      this.notoficationCountSubscription.unsubscribe();
    }
    clearInterval(this.clearInterval);

  }

  getNotificationMessage(skip: number, limit: number,isLoad:boolean) {
     if(isLoad){
          this.isLoadStart=true;
          clearInterval(this.clearInterval);
        }
      this.notificationService.getNotificationListPurchaseHistory(skip,limit).subscribe((data: any) => {
      if (data) {
        let notificationContent:PurchaseHistoryNotificationDTO[]= data.content;
        notificationContent.forEach((data)=>{
          const replaceJson= JSON.parse(data['replaceableData']);
          if (replaceJson) {

            const translateTemplate=this.translate.instant("Notification_Template."+data['action']);
            const replacedTranslation=translateTemplate.replace('COMPANY_NAME',replaceJson['COMPANY_NAME'])
                             .replace('STOCK_COUNT', replaceJson['STOCK_COUNT']);
              data.notificationMsg=replacedTranslation;
          }
        this.purchaseHistoryDetailsList.push(data);
        })
        this.isLoadStart=false;
      }
    });
  }

  getNotificationLogo(notification: NotificationDTO): string {
    let name = '';
    name = notification.lastActedCompany;
    if(name === 'AXA insurance') {
      name = 'AXA';
    }
    const logo = '/assets/company_logo/' + name + '_Logo.png';
    return logo;
  }

  showClaim(notification: NotificationDTO, index : number): void {
    this.notificationDetailsList.splice(index,1)
    notification.index=index;
    this.dialogRef.close(notification);
  }

  getMenuHeader(pageName: string): boolean{
    const menuHeader = this.menuHeaderList?.find((element) => element.menuName === pageName);
    return menuHeader;
  }

  getMenuItems(){
    this.appservice.getMenubyRole().subscribe((res: any)=>{
      this.menuHeaderList = res.content;
    });
  }
  getLogo(){
    if (this.imgUrl!=='') {
      return this.imgUrl;
    }else{
      return 'assets/no-logo.svg';
    }
  }

  notificationMsg(data:PurchaseHistoryNotificationDTO) {
    this.closeTab();
    if(this.isAdmin){
      const companyId = [];
      companyId.push(data.actedBy);
      const arr = JSON.stringify(companyId);
      sessionStorage.setItem("companyId", arr);
      this.route.navigate(['authority-paper-details/transaction-history']);
    }
    else{
      this.route.navigate(['/purchase-stock'],{ queryParams: { notificationId: data.actedBy }});
    }


    this.notificationService.updateNotification(data.notificationId).subscribe((data: any) => {
      // this.purchaseHistoryNotificationGet();
      this.notificationService.countSubject.next(true);
    });
      }
  // purchaseHistoryNotificationGet() {
  //   this.notificationService.getNotificationListPurchaseHistory().subscribe((value:any)=>{
  //     if(value){
  //       this.purchaseHistoryDetailsList=value.content;
  //     }
  //   })
  // }

closed=true;
close(){
    this.closed =!this.closed;
  }
  closeTab()
  {
    this.dialog.closeAll();
  }
}
export class DialogData {

  notificationCount:any;
}


