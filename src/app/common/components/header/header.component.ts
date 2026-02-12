import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementService } from 'ncloud-common-ui';
import { Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { NotificationDTO } from 'src/app/models/notification-dto';
import { PurchaseHistoryNotificationDTO } from 'src/app/models/purchase-history-notification-dto';
import { AdminService } from 'src/app/service/admin.service';
import { appConst } from 'src/app/service/app.const';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { FileUploadService } from 'src/app/service/file-upload.service';
import { I18nServiceService } from 'src/app/service/i18n-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PreviousRouteService } from 'src/app/service/previous-route.service';
import { ProfileService } from 'src/app/service/profile.service';
import { AppService } from 'src/app/service/role access/service/app.service';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';
import { ErrorHandlerDirective } from '../../directives/errorHandler.directive';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, OnDestroy {


  showmessage = false;
  companyId: number;
  imgUrl = '';
  stompClient: any;
  socket: any;
  notificationCount = 0;
  companyName = '';
  currentCompanyName: string;
  noNotification = false;
  notificationSubscribtion: Subscription;
  notoficationCountSubscription: Subscription;
  headerRefreshSubscription:Subscription;
  notificationDetailsList: PurchaseHistoryNotificationDTO[];
  ZERO=0;
  FIVE=5;


  menuHeaderList: any[];
  notification_Data: any[] = [
    {
      profileImg: 'assets/prfile.svg',
      content: 'Garage details has been added for',
      claimId: '1235',
      company: 'Partner Insurance Limited',
    },
    {
      profileImg: 'assets/prfile.svg',
      content: 'Garage details has been added for ',
      claimId: '1235',
      company: 'Partner Insurance Limited',
    },
  ]
  public appConst = appConst;

  @Output() showClaimEvent = new EventEmitter<{ claimId: number, isReceivable: boolean }>();
  @Output() fullViewNotification = new EventEmitter<boolean>();
  isReceivable = true;
  fromNotification = false;
  showOrNot=false;
  headerShowOrNot=false;
  profileImage: any;
  private previousUrl = '';
  private currentUrl = '';
  lang: string;
  countUpdateSubscription: Subscription;
  userName: string;

  constructor(public dialog: MatDialog, private route: Router, public i18nConf: I18nServiceService, private dashboardService: DashboardService, private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService, private errorHandler: ErrorHandlerDirective, private appservice: AppService, private adminService: AdminService,
    private authorityService:AuthorityPaperService,private userProfileService:ProfileService,private fileService:FileUploadService, private previousRouteService:PreviousRouteService
    ,private userManagementService:UserManagementService, private translate: TranslateService, public renderer: Renderer2) {

      this.lang = sessionStorage.getItem('Language');
    if (this.lang)  {
      translate.use(this.lang);
      if(this.lang ==='French'){

        this.renderer.setAttribute(document.body, 'dir', 'ltr');
        this.renderer.addClass(document.body, 'french');
        this.renderer.removeClass(document.body, 'arabic');
        localStorage.setItem('Language',this.lang );
        sessionStorage.setItem('Language',this.lang );
        this.lang='French';
  
       }
       else{
      this.renderer.setAttribute(document.body, 'dir', 'ltr');
      this.renderer.removeClass(document.body, 'arabic');
      this.renderer.removeClass(document.body, 'french');
      localStorage.setItem('Language',this.lang );
      sessionStorage.setItem('Language',this.lang );
      this.lang='English';
    }
    setTimeout(() => {
      this.translate.use(this.lang);
     }, 1000);
     
  
    }

    this.translate.onLangChange.subscribe((data)=>{
      this.purchaseHistoryNotificationGet();
    })
    this.getCurrentUrl();
    this.i18nConf = i18nConf;
    this.i18nConf.setUpConf();
    this.getLoggedInUserCompanyId();
    this.currentCompanyName = sessionStorage.getItem("username");
    this.userName=sessionStorage.getItem('username');
    this.userProfileService.getValue().subscribe(value=>{
      if(value){
        this.getProfilePic();
        this.currentCompanyName = sessionStorage.getItem("username");
      }
    });
    this.countUpdateSubscription=this.notificationService.countSubject.subscribe((value)=>{
      if(value){
        this.notificationCount--;
      }
    })

    this.headerRefreshSubscription=this.userManagementService.getDashboardHeaderRefresh().subscribe(value=>{
      if(value){
        this.redirectingToPageBasedOnPrivilegeAction();
      }
    });


  }
  currentRoute: string;

  private redirectingToPageBasedOnPrivilegeAction() {
    this.appservice.getMenubyRole().subscribe((res: any) => {
      this.menuHeaderList = res.content;
      if (this.menuHeaderList.length === 0) {
        this.route.navigateByUrl('/page-not-found');
      }
      else {
        const reversedMenuList = this.menuHeaderList.slice().reverse();
        for (let menu of reversedMenuList) {
          if (menu.routeUrl) {
            let routeUrl=menu.routeUrl;
            if(routeUrl===appConst.MENU_CONSTANTS.MENUNAME.USERMANAGEMENT.URL)
                 routeUrl='/usermanagement/user-role/list'
            this.route.navigateByUrl(routeUrl);
          };

          break;
        }
      }
      this.userManagementService.setDashBoardHeaderRefresh(false);
    });
  }

  getCurrentUrl() {
    this.currentRoute = window.location.href;
    this.route.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.previousUrl=this.currentUrl;
        this.currentUrl=this.currentRoute;
        this.previousRouteService.setRouterValue(this.previousUrl);
        this.previousRouteService.setCurrentRouter(this.currentRoute);

      }
    });

  }

  isAdmin: boolean;

  ngOnInit(): void {
    this.getMenuItems();
    // this.notificationGET();
    // this.notificationCountGET();

    this.isAdmin = this.adminService.isAssociationUser();
    this.getProfilePic();   // Method for Previewing Profile of User
    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      if (!this.fromNotification) {
        this.isReceivable = queryParams["rec"] !== undefined ? queryParams["rec"] !== 'false' : true;
      }
    });
    this.getNotificationCount();

  }
  getNotificationCount(){
    this.notificationService.getNotificationCount().subscribe((data: any) => {
      if (data) {
        this.notificationCount = data.content;
        this.noNotification=this.notificationCount===0?true:false;
        this.purchaseHistoryNotificationGet();
      }
    });
  }

  baseUrl = environment.API_BASE_URL;
  collapsed = true;
  nav1 = 'dashboard'
  nav2 = 'reportloss'
  nav3 = 'receivable'
  nav4 = 'payable'
  nav5 = 'user'


  onLoadingNotification(){
    this.purchaseHistoryNotificationGet();
  }

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
    if (notification != null || notification != undefined) {
      this.purchaseHistoryDetailsList.unshift(notification);
      this.notificationCount = this.notificationCount + 1;
    }
  }

  /**
   * GET COMPANY ID OF LOGGED-IN USER
   */
  getLoggedInUserCompanyId() {
    const isAdmin = this.adminService.isAssociationUser();
    if (isAdmin) {
      const associationId = sessionStorage.getItem('associationId');
      let associationIdInNumber=null;
      if(associationId){
          associationIdInNumber=Number.parseInt(associationId);
      }
      this.connectWebSocket();
      // this.companyId =1;
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
   * NOTIFICATION COUNT CALL GET METHOD
   */
  notificationCountGET() {
    this.notoficationCountSubscription = this.notificationService.getNotificationCount().subscribe((res: any) => {
      const result = res;
      this.notificationCount = result?.totalCount;
    }, (error: Response) => {
      this.errorHandler.getMessage(error);
    })
  }
  /**
   * DESTROY THE SUBSCRIBTION
   */
  ngOnDestroy(): void {
    if (this.notificationSubscribtion) {
      this.notificationSubscribtion.unsubscribe();
    }
    if (this.notoficationCountSubscription) {
      this.notoficationCountSubscription.unsubscribe();
    }
    if(this.headerRefreshSubscription){
      this.headerRefreshSubscription.unsubscribe();
    }
    if(this.countUpdateSubscription){
      this.countUpdateSubscription.unsubscribe();
    }
  }

  getNotificationLogo(notification: NotificationDTO): string {
    let name = '';
    name = notification.lastActedCompany;
    if (name === 'AXA insurance') {
      name = 'AXA';
    }
    const logo = '/assets/company_logo/' + name + '_Logo.png';
    return logo;
  }

  showClaim(notification: NotificationDTO, index: number): void {
    this.notificationDetailsList.splice(index, 1)
    this.notificationCount--;
    this.isReceivable = notification.receivable;
    this.fromNotification = true;
    this.showClaimEvent.emit({
      claimId: notification.claimId,
      isReceivable: this.isReceivable
    });
  }

  getMenuHeader(pageName: string): boolean {
    const menuHeader = this.menuHeaderList?.find((element) => element.menuName === pageName);
    return menuHeader;
  }

  getMenuItems() {
    this.appservice.getMenubyRole().subscribe((res: any) => {
      this.menuHeaderList = res.content;
    });
  }
  getLogo() {
    if (this.imgUrl !== '') {
      return this.imgUrl;
    } else {
      return 'assets/no-logo.svg';
    }
  }

  notification_fullview() {

    this.fullViewNotification.emit();


  }
  popup_fullscreen() {
    this.showmessage = true;
    const dialogRef = this.dialog.open(NotificationPopupComponent, {
      width: '600px',
      data:{
        notificationCount:this.notificationCount
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showClaim(result, result.index);
      }

    });
  }
  purchaseHistoryDetailsList: PurchaseHistoryNotificationDTO[]=[];

  purchaseHistoryNotificationGet() {

    this.notificationService.getNotificationListPurchaseHistory(this.ZERO,this.FIVE).subscribe((data: any) => {
      this.purchaseHistoryDetailsList=[];
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
      }
    });
  }
  notificationMsg(data:PurchaseHistoryNotificationDTO) {
    if(this.isAdmin){
    // this.route.navigate(['authority-paper-details/transaction-history'],{ queryParams: { notificationId: data.actedBy }});
    const companyId = [];
    companyId.push(data.actedBy);
    const arr = JSON.stringify(companyId);
    sessionStorage.setItem("companyId", arr);
    this.route.navigate(['authority-paper-details/transaction-history']);
    sessionStorage.setItem("notification","Notification");

    }else{
      this.route.navigate(['/purchase-stock'],{ queryParams: { notificationId: data.actedBy }});
    }


    if (this.notificationCount > 0) {
      this.notificationCount--;
    }


    this.notificationService.updateNotification(data.notificationId).subscribe((data: any) => {
      this.purchaseHistoryNotificationGet();
    });
      }

      getProfilePic(){
            const userIdentity=sessionStorage.getItem('userIdentity');
            this.userProfileService.getUserProfilePicture(userIdentity).subscribe((data)=>{
              if(data){
                const profilePicture=data['content'];
                if(profilePicture===null || profilePicture===""){
                  this.profileImage='/assets/ProfilePic.png'
                }
                else{
                    this.profilePreview(profilePicture); // fileReader call
                }
              }
            },
            (error)=>{
              this.profileImage='/assets/ProfilePic.png'
            }
            );
      }

     profilePreview(profilePicture:string) {
         this.fileService.downloadImageByImageName(profilePicture).subscribe((response:Blob)=>{
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.profileImage = e.target.result;
          };
         reader.readAsDataURL(response);

         })
    }

    handleImageError() {
      this.imgUrl = 'assets/no-logo.svg';
    }
    handleImageErrorUserLogo(){
      this.profileImage='/assets/ProfilePic.png'
    }

    logout(){
        this.route.navigateByUrl('login/insurance-company');
        sessionStorage.setItem("auth-guard",'true');
    }
}



