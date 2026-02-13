import { formatDate } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { FilterObject } from "src/app/models/Filter-dto/filter-object";
import { FilterOrSortingVo } from "src/app/models/Filter-dto/filter-object-backend";
import { AuthorityPaperService } from "src/app/service/authority-paper.service";
import { DateConversionService } from "src/app/service/date-conversion.service";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, OnChanges {

  @Output() emitFilterValue = new EventEmitter<FilterOrSortingVo[]>();
  @Output() searchDataForInput = new EventEmitter<string>();

  @Input() filterObjectFromParent: FilterObject[];
  @Input() clearInputData: boolean;
  @Input() searchdisable: any;
  minDate = new Date();
  isConditionTrue = false;
  isInvalid: boolean;
  searchData:string;
  isClearAllValue=false;
  closeIconEnable:boolean = false;
  constructor(private router: Router, private authorityService: AuthorityPaperService, private dateConversionService: DateConversionService) {
    this.clearAll();
  }
  ngOnInit(): void {
    this.authorityService.emitFilterObject.subscribe((data) => {
      this.filterObject = data;

    })
    this.clearAll();
  }

  /*
  *  Get FilterObject From Parent
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterObjectFromParent']?.currentValue !== undefined) {
      this.filterObject = this.filterObjectFromParent;
    }
    if (changes['clearInputData']?.currentValue !== undefined) {
      // this.searchData ='';
    }
  }
  Search(event) {
    this.searchData = event.target.value;
    this.closeIconEnable = true;
    if(!this.searchData){
      this.closeIconEnable = false;
    }
    this.searchDataForInput.emit(this.searchData);
  }

  removeSearchValue(){
    this.searchData = "";
    this.closeIconEnable = false;
    this.searchDataForInput.emit(this.searchData);
  }

  handleKeyup(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.searchData === "" && this.closeIconEnable) {
      this.closeIconEnable = false;
    }
  }

  readOnly = true;
  showFilter = false;
  filterObjectBackend: FilterOrSortingVo[];
  filterObject: FilterObject[] = []

  // filterObject: FilterObject[] = [
  //   {

  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Purchase ID',
  //     type: 'field',
  //     value: [],
  //     dropdown: [],
  //     radio: [],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Transaction ID',
  //     type: 'field',
  //     value: [],
  //     dropdown: [],
  //     radio: [],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Date of Purchase',
  //     type: 'dates',
  //     value: [],
  //     dropdown: [],
  //     radio: [],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'No.of Papers',
  //     type: 'fields',
  //     value: [],
  //     dropdown: [],
  //     radio: [],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Purchase Amount',
  //     type: 'fields',
  //     value: [],
  //     dropdown: [],
  //     radio: [],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Payement Method',
  //     type: 'chips',
  //     value: [],
  //     dropdown: ['cash', 'cheque'],
  //     radio: [],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Status',
  //     type: 'radio',
  //     value: [],
  //     dropdown: [],
  //     radio: [
  //       {
  //         name: 'Active',
  //         value: false,
  //       },
  //       {
  //         name: 'InActive',
  //         value: false,
  //       },
  //     ],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Dropdown',
  //     type: 'dropdown',
  //     value: [],
  //     dropdown: ['cash', 'cheque', 'c', 'd'],
  //     radio: [],
  //   },
  //   {
  //     columnName: 'null',
  //     condition: 'null',
  //     aliasName: 'Payment Status',
  //     type: 'chips',
  //     value: [],
  //     dropdown: ['success', 'Reject'],
  //     radio: [],
  //   },
  // ];

  validateTypeIsField(type: any) {
    if (type.type === 'field') {
      return true;
    } else {
      return false;
    }
  }

  validateTypeIsString(type: any) {
    if (type.type === 'string') {
      return true;
    } else {
      return false;
    }
  }

  validateTypeIsDates(type: any) {
    if (type.type === 'dates') {
      return true;
    } else {
      return false;
    }
  }

  checkMaxValueToMin(data: any) {
    const min = Number(data.value[0]);
    const max = Number(data.value[1]);
    this.isInvalid=false;

    if(max===0){
      data.isMax=false;
    }

    if ( min > max) {
      data.isMax = true;
    } else {
      data.isMax = false;
    }

    this.checkValidFields()

  }

  checkValidFields() {
    for (const field of this.filterObject) {
      if (field.isMax) {
        this.isInvalid = true;
        break;
      }
    }
  }

  validateTypeIsFields(type: any) {
    if (type.type === 'fields') {
      return true;
    } else {
      return false;
    }
  }

  validateTypeIsChips(type: any) {
    if (type.type === 'chips') {
      return true;
    } else {
      return false;
    }
  }

  validateTypeIsRadio(type: any) {
    if (type.type === 'radio') {
      return true;
    } else {
      return false;
    }
  }

  validateTypeIsDropdown(type: any) {
    if (type.type === 'dropdown') {
      return true;
    } else {
      return false;
    }
  }

  remove(ListName: string, item: any): void {
    const index = item.value.indexOf(ListName);
    if (index >= 0) {
      item.value.splice(index, 1);
    }
  }

  selectedColumn(event: MatAutocompleteSelectedEvent, fieldData: FilterObject): void {
    if (fieldData.value.length !== 0) {
      const isPresent = fieldData.value.find((element) => event.option.viewValue === element);

      if (!isPresent) {
        fieldData.value.push(event.option.viewValue);
      }
    } else {
      fieldData.value.push(event.option.viewValue);
    }
  }

  searchOption(event, item: FilterObject) {
    if (item.dropdownCopy === undefined) {
      item.dropdownCopy = item.dropdown;
    }
    const filterValue = event.target.value.toLowerCase();
    let SearchList = [];
    if (filterValue != null && filterValue != undefined && filterValue !== '') {
      SearchList = item.dropdownCopy.filter((data) =>
        data.toLowerCase().includes(filterValue)
      );
      item.dropdown = SearchList;
    } else {
      item.dropdown = item.dropdownCopy;
    }
    SearchList = [];
  }

  refreshSearchOption(event, item: FilterObject) {
    if (item.dropdownCopy !== undefined) {
      item.dropdown = item.dropdownCopy;
    }else{
      item.dropdownCopy = item.dropdown;
    }
    item.value.forEach(element => {
      item.dropdown = item.dropdown.filter(item => item !== element);
    });
  }

  clearAll() {
    this.searchData="";
    this.filterObject.forEach((element) => {
      element.value = [];
      if (element.radio.length!=0) {
        element.radio.forEach((element3) => {
          element3.value = null;
        });
      }
    });
  }

  searchFilter() {
    this.searchData="";
    const filterObjectVoList: FilterOrSortingVo[] = [];
    this.filterObject.forEach((element) => {
      const filterObjectVo = new FilterOrSortingVo();
      filterObjectVo.columnName = element.columnName;
      filterObjectVo.condition = element.condition;
      filterObjectVo.filterOrSortingType = 'FILTER';
      filterObjectVo.type = null;

      if (element.type === 'dates') {
        this.minDate = new Date(element.value[0]);
      }

      if (element.type !== 'fields') {
        if(element.type!=='dates'){
          if (element.type !== 'radio') {
            if (element.type !== 'chips') {
              if (element.type !== 'string') {
              if (element.value !== null) {
                filterObjectVo.value = element.value[0];
              }
              if (element.value[1] !== null || element.value[1] !== undefined) {
                filterObjectVo.value2 = element.value[1];
              }
              filterObjectVo.type = element.dataType;
            }else{
              if (element.value !== null) {
              filterObjectVo.value = element.value.toString();
              }
            }
            } else {
              element.value.forEach((element1) => {
                filterObjectVo.valueList.push(element1);
              });
              filterObjectVo.type = element.dataType;
            }
          } else {
            if (element.radio[1].value !== null) {
              const value = !element.radio[1].value;
              filterObjectVo.value = value.toString();
            }
            filterObjectVo.type = element.dataType;
          }
        }
        else{
          if (element.value[0] !== undefined) {
            const isoDateStrFrom=this.dateConversionService.convertAdjustedISOString(element.value[0]);
            filterObjectVo.value = isoDateStrFrom;
          }

          if (element.value[1]) {
            const isoDateStrFrom=this.dateConversionService.convertAdjustedISOStringAtEndOfTheDay(element.value[1]);
            filterObjectVo.value2 = isoDateStrFrom;
          }
        }

      } else {
        if ((element.value[0] !== '' || element.value[0] !== undefined) && (element.value[1] === '' || element.value[1] === undefined)) {
          filterObjectVo.condition = "Gt"
          filterObjectVo.value = element.value[0]?.replace(/[^0-9.]/g, '');
        }
        else if ((element.value[1] !== '' || element.value[1] !== undefined) && (element.value[0] === '' || element.value[0] === undefined)) {
          filterObjectVo.condition = "Lt"
          filterObjectVo.value2 = element.value[1]?.replace(/[^0-9.]/g, '');
        }
        else if ((element.value[1] !== '' || element.value[1] !== undefined) && (element.value[0] !== '' || element.value[0] !== undefined)) {
          filterObjectVo.condition = "BW"
          filterObjectVo.value = element.value[0]?.replace(/[^0-9.]/g, '');
          filterObjectVo.value2 = element.value[1]?.replace(/[^0-9.]/g, '');
        }
        filterObjectVo.type = element.dataType;
      }
      if (filterObjectVo.value === undefined || filterObjectVo.value === '') {
        filterObjectVo.value = null;
      }
      if (filterObjectVo.value2 === undefined || filterObjectVo.value === '') {
        filterObjectVo.value2 = null;
      }
      filterObjectVoList.push(filterObjectVo);
    });
    this.emitFilterValue.emit(filterObjectVoList);
    this.showFilter = !this.showFilter;
  }

  closePopUp() {
    if(this.isClearAllValue){
      this.searchFilter();
    }
    this.showFilter = false;
  }
  triggerMethod(){
    this.isClearAllValue =true;
  }
  openFilter() {
    this.showFilter = !this.showFilter;
    // this.clearAll();
    this.closeIconEnable = true;
  }

  checkedRadio(name: string, item: FilterObject) {
    if (name === 'Customer_table.Active' || name === 'userRoleManag.Mapped') {
      item.radio[0].value = true;
      item.radio[1].value = false;
    } else {
      item.radio[0].value = false;
      item.radio[1].value = true;
    }
  }

  setMinData(event:any){
    console.log("boom", event.value);

  }
}
