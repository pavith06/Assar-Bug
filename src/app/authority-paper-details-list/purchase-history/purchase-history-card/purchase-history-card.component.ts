import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PurchaseHistoryDto } from 'src/app/models/purchase-stock-dto/purchase-history-dto';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { PurchaseHistoryPopupComponent } from './purchase-history-popup/purchase-history-popup.component';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessMappingPageDto } from 'src/app/models/user-role-management/access-Mapping-PageDto ';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { appConst } from 'src/app/service/app.const';
import { AppService } from 'src/app/service/role access/service/app.service';
import { MenuSectionNames } from 'src/app/common/enum/enum';
@Component({
  selector: 'app-purchase-history-card',
  templateUrl: './purchase-history-card.component.html',
  styleUrls: ['./purchase-history-card.component.scss']
})
export class PurchaseHistoryCardComponent implements OnInit {
  ZERO = 0;
  searchvalue: string;
  isAllCompanyShow = true;

  // cardList:number[]=[1,2,3,4,5,6,7,8,9,10,11,12,13];

  constructor(public dialog: MatDialog, private authorityPaperService: AuthorityPaperService, private router: Router, private activatedRoute: ActivatedRoute, private appService: AppService) {
    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      this.searchvalue = queryParams['recSearchQuery'];
      if (this.searchvalue !== "" && this.searchvalue !== undefined) {
        this.cardHistoryList = this.cardHistoryListCopy.filter((m) => String(m.comapanyName.toUpperCase()).includes(this.searchvalue.toUpperCase()));
        this.isAllCompanyShow = false;
      } else {
        this.cardHistoryList = this.cardHistoryListCopy;
        this.isAllCompanyShow = true;
      }
    });
  }

  // reactiveForm = new FormGroup({
  //   numberOfPapers: new FormControl('', [Validators.required]),
  //   totalCostValue: new FormControl('',[Validators.required]),
  //   paymentMethod: new FormControl('',[Validators.required]),
  // })

  ngOnInit() {
    this.getPageAccessDetails();
  }

  authorityPaperDetailsAccessDto: AccessMappingPageDto;
  purchaseHistoryPageAccessDto: AccessMappingSectionDto;
  viewHistoryPageAccessDto: AccessMappingSectionDto;

  getEnabledPrivilegeFromMultipleRoles(sectionDataArray:AccessMappingSectionDto[]):AccessMappingSectionDto[]{
    const result: AccessMappingSectionDto[] = Object.values(
      sectionDataArray.reduce((accumulator, obj) => {
        let accessMappingAccumulator:AccessMappingSectionDto= null;
        if (!accumulator[obj.sectionName]) {
          accumulator[obj.sectionName] = obj;
        }
        accessMappingAccumulator=accumulator[obj.sectionName];
        if(obj.isView){          
          accessMappingAccumulator.isView=obj.isView;
        }
        if(obj.isClone){
          accessMappingAccumulator.isClone=obj.isClone;
        }
        if(obj.isDisable){
          accessMappingAccumulator.isClone=obj.isDisable;
        }
        if(obj.isDownload){
          accessMappingAccumulator.isDownload=obj.isDownload;
        }
        if(obj.isEdit){
          accessMappingAccumulator.isEdit=obj.isEdit;
        }
        if(obj.isNotification){
          accessMappingAccumulator.isNotification=obj.isNotification;
        }
        accumulator[obj.sectionName]=accessMappingAccumulator;
        return accumulator;
      }, {} as Record<string, AccessMappingSectionDto>)
    );
    
    return result
  }

  getPageAccessDetails() {
    this.appService.getPageAccess(appConst.PAGE_NAME.AUTHORITY_PAPER_DETAILS.PAGE_IDENTITY).subscribe(response => {
      if (response) {
        this.authorityPaperDetailsAccessDto = response['content'];
        this.authorityPaperDetailsAccessDto.sectionData=this.getEnabledPrivilegeFromMultipleRoles(this.authorityPaperDetailsAccessDto?.sectionData);
        this.purchaseHistoryPageAccessDto = this.authorityPaperDetailsAccessDto?.sectionData.find(x => x.sectionName === MenuSectionNames.Purchase_History_Card);
        const filterVo: FilterOrSortingVo[] = [];
        this.getCardDetails(filterVo);
      }
    })
  }


  purchaseHistory: PurchaseHistoryDto[] = [];
  cardHistoryList: PurchaseHistoryDto[] = [];
  cardHistoryListCopy: PurchaseHistoryDto[] = [];
  allCompanyCard: PurchaseHistoryDto;
  dataNotFound = false;    //ui is not finished
  InsuranceCompany: string;
  TotalTransactions: string;
  PendingTransactions: string;
  Notification: boolean;
  maxValue: number
  checks = [];
  allchecks: boolean;
  cardCompanyIdList = [];
  cardList = [];
  notifiList = [];

  openDialog(data: any) {
    const dialogRef = this.dialog.open(PurchaseHistoryPopupComponent, {
      width: '854px',
      height: '520px',
      data: { PurchasehistoryData: data },
      //  height: '60%'
    });

    dialogRef.afterClosed().subscribe()
  }

  //method to pass companyId
  passCompanyId(CompanyId: any) {
    const arr = JSON.stringify(CompanyId);
    sessionStorage.setItem("companyId", arr);
  }


  //check box call
  onClick(event: any) {
    if (event.target.checked == true) {
      this.allchecks = true;
      this.checks = [];
      this.cardCompanyIdList = [];
      this.cardHistoryList.forEach(value => {
        this.cardCompanyIdList.push(value.companyId);
        this.checks.push(true);
      });
      this.passCompanyId(this.cardCompanyIdList);
    }
    else {
      this.checks = [];
      this.cardCompanyIdList = [];
      this.allchecks = false;
      this.passCompanyId(this.cardCompanyIdList);
    }

  }

  onSelectNotification(event: any, companyId: any) {
    if (event) {
      this.cardHistoryList.forEach(value => {
        if (value.companyId === companyId) {
          this.notifiList.push(companyId);
          const companyIdArr = [];
          companyIdArr.push(companyId);
          const arr = JSON.stringify(companyIdArr);
          sessionStorage.setItem("companyId", arr);
        }
        this.router.navigate(['authority-paper-details/transaction-history']);
      });
    }
  }

  onSelectOrDeselect(event: any, companyId: any) {
    const index = this.cardList.indexOf(companyId);
    if (event.target.checked == true) {
      // this.authorityPaperService.setCheckbox(true);
      this.cardList.push(companyId);
      this.passCompanyId(this.cardList);
    }
    else if (index == -1) {
      const indexValue = this.cardCompanyIdList.indexOf(companyId);
      this.cardCompanyIdList.splice(indexValue, 1);
      this.allchecks = false;
      this.passCompanyId(this.cardCompanyIdList);
    }
    else {
      // this.authorityPaperService.setCheckbox(false);
      this.allchecks = false;
      this.cardList.splice(index, 1);
      this.passCompanyId(this.cardList);
    }
  }


  //-------------------Card Details backend service call----------------------------------------

  getCardDetails(filterVo: FilterOrSortingVo[]) {

    if(this.purchaseHistoryPageAccessDto?.isView===false){
        return;
    }

    this.authorityPaperService.getPurchaseHistoryCount(filterVo,"").subscribe((value: any) => {
      this.maxValue = value;
      this.getCardList(this.ZERO, this.maxValue, filterVo);
    })
  }

  getCardList(skip: number, limit: number, val: FilterOrSortingVo[]) {
    this.authorityPaperService.getPurchaseHistory(skip, limit, val,"").subscribe((value: PurchaseHistoryDto[]) => {
      if (value) {
        this.allCompanyCard = value[0];
        this.cardHistoryList = value;
        this.cardHistoryListCopy = value;
        value.forEach((element, index) => {
          if (element.comapanyName === "All Companies") {
            this.cardHistoryList.splice(index, 1);
          }
        });
      }
    })
  }
  //---------------------------------------Card Details backend service ends-----------------------------

}
