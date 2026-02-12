import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FilterObject } from 'src/app/models/Filter-dto/filter-object';
import { FilterOrSortingVo } from 'src/app/models/Filter-dto/filter-object-backend';
import { AuthorityPaperDetailsDto } from 'src/app/models/authority-paper-details-dto/authority-paper-details-dto';
import { CompanyDetails } from 'src/app/models/company-dto';
import { FilterOrSortingFilter } from 'src/app/models/purchase-stock-dto/filter-or-sorting';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { AuthorityPaperService } from 'src/app/service/authority-paper.service';
import { AppService } from 'src/app/service/role access/service/app.service';

@Component({
  selector: 'app-authority-paper-details-card',
  templateUrl: './authority-paper-details-card.component.html',
  styleUrls: ['./authority-paper-details-card.component.scss']
})
export class AuthorityPaperDetailsCardComponent implements OnInit, OnChanges {
  totalLength: number;
  ZERO = 0;
  TEN = 10;
  @Input() searchValue:string;
  filterVo: FilterOrSortingVo[];
  authorityPaperDetailsDto: AuthorityPaperDetailsDto[];
  allPaperDetailsCard:AuthorityPaperDetailsDto;
  cardPaperDetailsList:AuthorityPaperDetailsDto[]=[];
  cardPaperDetailsListCopy:AuthorityPaperDetailsDto[]=[];
  allchecks:boolean;
  isShowAllCard=true;
  checks=[];
  cardCompanyIdList=[];
  cardList=[];
  companyList: any[];
  filterData: FilterOrSortingFilter[] = [];
  companyDetails: CompanyDetails[] = [];
  companyNameList = [];
  @Input() paperDetailsPageAccessDtoFromParent:AccessMappingSectionDto;

   constructor(private authorityPaperService : AuthorityPaperService,private appService:AppService) {}
  ngOnInit(): void {
    this.getAuthorityPaperDetailsCount(this.filterVo);
    // this.authorityPaperService.emitFilterVoObject.subscribe(value => {
    //   if (value) {
    //     this.filterData = value;
    //     this.passingFilterVo(this.filterData);
    //   }
    // });
    // this.getMethodForChips();
    this.authorityPaperService.passFilterObject(this.filterObjectArray);
  }
  // cardList:number[]=[1,2,3,4,5,6,7,8,9,10,11,12,13];

  getAuthorityPaperDetailsCount(filterVo: FilterOrSortingVo[]) {

    if(this.paperDetailsPageAccessDtoFromParent?.isView===false){
       return;
    }

    this.authorityPaperService.getAuthorityPaperDetailsCount(filterVo,"").subscribe((count:any)=>{
      this.totalLength = count;
      this.getAuthorityPaperDetailsList(this.ZERO, this.totalLength, filterVo);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchValue'].currentValue!== undefined && changes['searchValue'].currentValue !=="") {
        this.cardPaperDetailsList = this.cardPaperDetailsListCopy.filter((m) => String(m.insuredComapny.toUpperCase()).includes(this.searchValue.toUpperCase()));
        this.isShowAllCard = false;
      }else{
        this.cardPaperDetailsList = this.cardPaperDetailsListCopy;
        this.isShowAllCard = true;
      }
  }

  getAuthorityPaperDetailsList(skip: number, limit: number, filterVo: FilterOrSortingVo[]) {
    this.authorityPaperService.getAuthorityPaperDetailsList(skip,limit,"true",filterVo,"").subscribe((value:AuthorityPaperDetailsDto[])=>{
      if(value){
        this.allPaperDetailsCard=value[0];
        this.cardPaperDetailsList=value;
        this.cardPaperDetailsListCopy = value;
      value.forEach((element,index)=>{
        if(element.insuredComapny==="All Companies"){
              this.cardPaperDetailsList.splice(index,1);
        }
      });
      }
    })

  }

  //method to pass companyId
  passCompanyId(CompanyId:any){
    const arr = JSON.stringify(CompanyId);
    sessionStorage.setItem("companyId", arr);
  }


  //check box call
  onClick(event:any){
    if(event.target.checked==true){
      this.allchecks=true;
      this.checks=[];
      this.cardCompanyIdList=[];
      this.cardPaperDetailsList.forEach(value=>{
        this.cardCompanyIdList.push(value.companyId);
        this.checks.push(true);
      });
      this.passCompanyId(this.cardCompanyIdList);
    }
    else{
      this.checks=[];
      this.cardCompanyIdList=[];
      this.allchecks=false;
      this.passCompanyId(this.cardCompanyIdList);
    }

  }

  onSelectOrDeselect(event:any,companyId:any){
    const index=this.cardList.indexOf(companyId);
    if(event.target.checked==true){
      // this.authorityPaperService.setCheckbox(true);
      this.cardList.push(companyId);
      this.passCompanyId(this.cardList);
    }
    else if(index==-1){
      const indexValue=this.cardCompanyIdList.indexOf(companyId);
      this.cardCompanyIdList.splice(indexValue,1);
      this.allchecks=false;
      this.passCompanyId(this.cardCompanyIdList);
    }
    else{
      // this.authorityPaperService.setCheckbox(false);
      this.allchecks=false;
      this.cardList.splice(index,1);
      this.passCompanyId(this.cardList);
    }
  }

  getMethodForChips() {
    let maxCount:number;
  this.authorityPaperService.getCompanyCount().subscribe((data)=>{
    maxCount=data;
    this.getCompanyList(maxCount);
  });

  }

  private getCompanyList(maxCount: number) {
    this.authorityPaperService.getCompanyList(this.ZERO, maxCount).subscribe((data: any) => {
      this.companyDetails = data;
      this.getCompanyNames(this.companyDetails);
      this.filterObjectArray.forEach(value => {
        if (value.aliasName === 'Insured Company') {
          value.dropdown = this.companyNameList;
        }
      });
    });
  }

  getCompanyNames(companyDetails: CompanyDetails[]) {
    if (companyDetails != undefined) {
      this.companyNameList = this.companyDetails.map(value => new String(value.emInsName));
    }
  }

  passingFilterVo(filterData: FilterOrSortingFilter[]) {
    this.columnAndIDSettingMethod(filterData);
    this.getAuthorityPaperDetailsCount(this.filterData);
  }
  columnAndIDSettingMethod(filterData: FilterOrSortingFilter[]) {
    if (filterData != null && filterData != undefined) {
      const filterFromSearch: FilterOrSortingVo[] = filterData;
      for (let vo of filterFromSearch) {
        let companyId: number[] = [];
        if (vo.valueList.length > 0 && vo.columnName === 'companyId') {
          for (let value of vo.valueList) {
            companyId.push(this.idFindingMethod(value));
          }
        }
        vo.intgerValueList = companyId;
        vo.valueList = [];
        vo.type = 'Integer';
      }
      this.filterData = filterFromSearch;
    }
  }
  idFindingMethod(value: string): number {
    let id: number = 0;
    if (value) {
      const data = this.companyDetails.find((element) => element.emInsName === value);
      id = data.emInsCompanyId;
    }
    return id;
  }
  filterObjectArray: FilterObject[]=[
    {
      columnName: 'companyId',
      condition: 'IN',
      aliasName: 'Insured Company',
      type: 'chips',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null
    },
    {
      columnName: 'stockCount',
      condition: 'BW',
      aliasName: 'Stock Count',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax :false
    },
    {
      columnName: 'Available Stock',
      condition: 'BW',
      aliasName: 'Available Stock',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType: null,
      isMax :false
    },
    {
      columnName:'usedCount',
      condition:'Like',
      aliasName: 'Papers Issued',
      type: 'fields',
      value: [],
      dropdown: [],
      radio: [],
      dataType:null,
      isMax :false
    },
  ];

  // ngOnDestroy(): void {
  //   localStorage.removeItem("companyId");
  // }
}
