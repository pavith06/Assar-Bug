import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MenuSectionNames } from 'src/app/common/enum/enum';
import { Field } from 'src/app/models/report-loss-dto/field';
import { MetaDataDto } from 'src/app/models/report-loss-dto/meta-data-dto';
import { AccessMappingSectionDto } from 'src/app/models/user-role-management/section-dto';
import { MY_FORMATS } from 'src/app/reports/reports.component';
import { appConst } from 'src/app/service/app.const';
import { DropDownServiceService } from 'src/app/service/drop-down-service.service';
import { PaperService } from 'src/app/service/paper-details/paper-service.service';
import { AppService } from 'src/app/service/role access/service/app.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import * as moment from 'moment';
import { DateConversionService } from 'src/app/service/date-conversion.service';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class ManualComponent implements OnInit, OnDestroy {

  metaDataDto: MetaDataDto;
  paperFieldData: Field[];
  vehicleFieldData: Field[];
  isEditUser = false;
  editableData = null;
  dropdownData: string[] = [];
  mackDropdownList: string[] = [];
  isActive = false;
  usageDropDown: string[] = [];
  multiselect: string[] = [];
  propertyArray: string[] = []
  mapOfObject: any;
  paperType = "NORMAL";
  paperDetailsAccessMappingDetails: AccessMappingSectionDto;
  generatePaperManualAccessData: AccessMappingSectionDto;
  paperDetailsAccessData: AccessMappingSectionDto;
  vehicleDetailsAccessData: AccessMappingSectionDto;
  file: File = null; // Variable to store file
  fileType: string;
  fileField: Field;
  fileName: string;
//   minDate = new Date(); // Today
//   maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // One year from today
//   effectiveFromSelected: Date | null = null;
// expiryDateMin: Date = new Date(); // Default min for Expiry Date
// expiryDateMax: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

minDate = new Date(); // Today
maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // One year from today
effectiveFromSelected: Date | null = null;
expiryDateMin: Date = new Date(); // Default min for Expiry Date
expiryDateMax: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  errorDataSubscription: Subscription;
  fromDate: string;
  toDate: string;
  generateButtonDisable: boolean;

  // Mark fields to hide and treat as "OTHER"
  readonly HIDDEN_FIELDS = ['vdMake', 'vdModel','vdVehicleModel'];
  readonly OTHER_VALUE = 'OTHER';

  constructor(private service: UserManagementService,
    private dropDownService: DropDownServiceService, private paperService: PaperService, private toaster: ToastrService, private appService: AppService,
    private route: Router, private activeRouter: ActivatedRoute, private translate: TranslateService, private dateService: DateConversionService) {
  }

  ngOnInit(): void {
    this.editableData = null;
    this.getPageAccessDetails();
    this.getFieldData();
    this.errorDataSubscription = this.paperService.selectedProduct$.subscribe((data) => {
      this.editableData = data;
      this.propertyArray = Object.getOwnPropertyNames(this.editableData);
      this.mapOfObject = new Map(this.propertyArray.map(e => [e, this.editableData[e]]));
    });
  }

  ngOnDestroy(): void {
    this.errorDataSubscription.unsubscribe();
  }

  getPageAccessDetails() {
    this.appService.getPageAccess(appConst.PAGE_NAME.PAPER_DETAILS.PAGE_IDENTITY).subscribe(response => {
      if (response) {
        this.paperDetailsAccessMappingDetails = response['content'];
        this.generatePaperManualAccessData = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName === MenuSectionNames.Generate_Paper_Manual);
        this.paperDetailsAccessData = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName === MenuSectionNames.Paper_Details);
        this.vehicleDetailsAccessData = this.paperDetailsAccessMappingDetails.sectionData.find(x => x.sectionName === MenuSectionNames.Vehicle_Details);
      }
    });
  }

  createMetaDataDto() {
    this.metaDataDto.sectionList.forEach(sectionList => {
      if (sectionList) {
        this.propertyArray.forEach(element => {
          sectionList.fieldList.find(e => e.aliasName === element ? e.value = this.mapOfObject.get(element) : null);
        });

        this.editableData['Error Fields']?.forEach(element => {
          sectionList.fieldList.find(e => e.aliasName === element ? e.hasError = true : false);
        });

        sectionList.fieldList.forEach(field => {
          if ((field.fieldType === 'pDate' || field.fieldType === 'fDate') && field.value !== null && field.value !== undefined) {
            const dateArray = field.value.split("/");
            const day = parseInt(dateArray[0], 10);
            const month = parseInt(dateArray[1], 10) - 1;
            const year = parseInt(dateArray[2], 10);
            const date = new Date(year, month, day);
            const dateValue = date.toISOString();
            field.value = this.dateService.convertAdjustedISOString(dateValue);
          }
        });
      }
    });
  }

  getDropDownData() {
    const parentFieldMap = this.dropDownService.getParentFieldMap();
    parentFieldMap.forEach(parentField => {
      if (this.HIDDEN_FIELDS.includes(parentField.parentFieldName) || this.HIDDEN_FIELDS.includes(parentField.childFieldName)) {
        return;
      }

      const metaData = this.metaDataDto?.sectionList.find(x => x.sectionId === '105').fieldList.find((dt) => dt.fieldName === parentField.parentFieldName);
      const childMetaData = this.metaDataDto?.sectionList.find(x => x.sectionId === '105').fieldList.find((dt) => dt.fieldName === parentField.childFieldName);
      if (childMetaData && childMetaData?.dropDownList === undefined) {
        this.getChildDropDowValue(null, metaData);
      }
      if (metaData || metaData.dropDownList === undefined) {
        this.buildDropDownValues(parentField.parentFieldName, metaData, null);
      }
    });
  }

  getChildDropDowValue(metaData: any, data: any) {
    if (this.HIDDEN_FIELDS.includes(data.fieldName)) {
      return;
    }
    const childFieldName = this.dropDownService.getChildFieldName(data.fieldName);
    const childmetaData = this.metaDataDto?.sectionList.find(x => x.sectionId === '105').fieldList.find((dt) => dt.fieldName === childFieldName);
    this.buildDropDownValues(childFieldName, childmetaData, data.value);
  }

  buildDropDownValues(fieldName: string, metaData: Field, value: string) {
    if (this.HIDDEN_FIELDS.includes(fieldName)) {
      return;
    }
    if (fieldName && fieldName !== '') {
      this.dropDownService.getOption(metaData.fieldId, value, null).subscribe(data => {
        if (data) {
          metaData.dropDownList = data;
        }
      });
    }
  }

  // generatePaper() {
  //   const uploadType = this.activeRouter.snapshot.paramMap.get('uploadType');
  //   const actionType = this.activeRouter.snapshot.paramMap.get('actionType');

  //   const sectionList = this.metaDataDto.sectionList;
  //   sectionList.forEach((section) => {
  //     section.fieldList.forEach((field) => {
  //       // Set hidden fields 'Make' and 'Model' to "OTHER"
  //       if (this.HIDDEN_FIELDS.includes(field.fieldName)) {
  //         field.value = this.OTHER_VALUE;
  //       }

  //       if ((field.fieldType === 'fDate' || field.fieldType === 'pDate') && field.value != null) {
  //         const value: any = field.value;
  //         let isMoment = null;
  //         if (value instanceof moment) {
  //           isMoment = true;
  //         }

  //         let dateToValidate: Date;
  //         if (isMoment) {
  //           dateToValidate = value._d;
  //         } else if (value instanceof Object) {
  //           dateToValidate = value;
  //         } else {
  //           dateToValidate = new Date(value);
  //         }

  //         if (dateToValidate < this.minDate) {
  //           console.error(`Error: ${field.aliasName} cannot be before current date.`);
  //           field.hasError = true;
  //           field.errorMessage = `${field.aliasName} cannot be before current date.`;
  //         } else if (dateToValidate > this.maxDate) {
  //           console.error(`Error: ${field.aliasName} cannot exceed one year from current date.`);
  //           field.hasError = true;
  //           field.errorMessage = `${field.aliasName} cannot exceed one year from current date.`;
  //         } else {
  //           field.hasError = false;
  //           field.errorMessage = '';
  //         }

  //         if (field.aliasName === 'Effective From') {
  //           if (this.fromDate === undefined || this.fromDate === null) {
  //            const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());

  //             this.fromDate = date;
  //             field.value = this.fromDate;
  //           }
  //         }

  //         if (field.aliasName === 'Expiry Date') {
  //           if (this.toDate === undefined || this.toDate === null) {
  //            const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());

  //             this.toDate = date;
  //             field.value = this.toDate;
  //           }
  //         }
  //       }
  //     });
  //   });

  //   this.metaDataDto.sectionList = sectionList;
  //   this.generateButtonDisable = true;

  //   this.service.saveFieldMetaData(this.metaDataDto, uploadType, actionType).subscribe((data: any) => {
  //     if (data != null) {
  //       this.toaster.success(this.translate.instant('Toaster_success.digital_paper'));
  //       this.route.navigate(['paper-details']);
  //     }
  //   }, (error) => {
  //     this.generateButtonDisable = false;
  //   });
  // }




generatePaper() {
    const uploadType = this.activeRouter.snapshot.paramMap.get('uploadType');
    const actionType = this.activeRouter.snapshot.paramMap.get('actionType');

    const sectionList = this.metaDataDto.sectionList;
    sectionList.forEach((section) => {
        section.fieldList.forEach((field) => {
            // Set hidden fields 'Make' and 'Model' to "OTHER"
            if (this.HIDDEN_FIELDS.includes(field.fieldName)) {
                field.value = this.OTHER_VALUE;
            }

            // if ((field.fieldType === 'fDate' || field.fieldType === 'pDate') && field.value != null) {
            //     const value: any = field.value;
            //     let isMoment = null;
            //     if (value instanceof moment) {
            //         isMoment = true;
            //     }

            //     let dateToValidate: Date;
            //     if (isMoment) {
            //         dateToValidate = value._d;
            //     } else if (value instanceof Object) {
            //         dateToValidate = value;
            //     } else {
            //         dateToValidate = new Date(value);
            //     }

                
            //     if (field.aliasName === 'Effective From') {
                    
                    
            //         const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());
            //         this.fromDate = date;
            //         field.value = this.fromDate;
            //     }

            //     if (field.aliasName === 'Expiry Date') {
                    
            //         const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());
            //         this.toDate = date;
            //         field.value = this.toDate;
            //     }
                
            //     // --- END: UPDATED DATE/TIME LOGIC ---

            //     // if (dateToValidate < this.minDate) {
            //     //     console.error(`Error: ${field.aliasName} cannot be before current date.`);
            //     //     field.hasError = true;
            //     //     field.errorMessage = `${field.aliasName} cannot be before current date.`;
            //     // } else if (dateToValidate > this.maxDate) {
            //     //     console.error(`Error: ${field.aliasName} cannot exceed one year from current date.`);
            //     //     field.hasError = true;
            //     //     field.errorMessage = `${field.aliasName} cannot exceed one year from current date.`;
            //     // } else {
            //     //     field.hasError = false;
            //     //     field.errorMessage = '';
            //     // }

            //     // Your original code that conditionally set this.fromDate/this.toDate 
            //     // when they were undefined/null has been replaced by the logic above 
            //     // to ensure the time component is always correctly applied before saving.
            // }
            if ((field.fieldType === 'fDate' || field.fieldType === 'pDate') && field.value != null) {
    const value: any = field.value;
    let isMoment = null;
    if (value instanceof moment) {
        isMoment = true;
    }

    let dateToValidate: Date;
    if (isMoment) {
        dateToValidate = value._d;
    } else if (value instanceof Object) {
        dateToValidate = value;
    } else {
        dateToValidate = new Date(value);
    }

  //   if (field.aliasName === 'Effective From') {
  //       // Use system current date/time for this field alone
  //      // const now = new Date();
  //       const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());
  //  this.fromDate = date;
  //   field.value = this.fromDate;
       
  //   }

  if (field.aliasName === 'Effective From') {
  const selected = new Date(dateToValidate);  // user selected date
  const now = new Date();                     // current time

  // ✅ Inject current time into selected date
  selected.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

  const date = this.dateService.convertAdjustedISOString(selected.toISOString());
  this.fromDate = date;
  field.value = this.fromDate;
}

    

    if (field.aliasName === 'Expiry Date') {
        // Keep your existing logic for 'Expiry Date'
        const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());
        this.toDate = date;
        field.value = this.toDate;
    }
}

// if ((field.fieldType === 'fDate' || field.fieldType === 'pDate') && field.value != null) {
//   const value: any = field.value;
//   let isMoment = null;

//   if (value instanceof moment) {
//     isMoment = true;
//   }

//   let dateToValidate: Date;

//   if (isMoment) {
//     dateToValidate = value._d;
//   } else if (value instanceof Object) {
//     dateToValidate = value;
//   } else {
//     dateToValidate = new Date(value);
//   }

//   // ✅ Effective From — use user selected date, not today
//   if (field.aliasName === 'Effective From') {
//     const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());
//     this.fromDate = date;
//     field.value = this.fromDate;
//   }

//   // ✅ Expiry Date — also use selected date (auto set logic already handled)
//   if (field.aliasName === 'Expiry Date') {
//     const date = this.dateService.convertAdjustedISOString(dateToValidate.toISOString());
//     this.toDate = date;
//     field.value = this.toDate;
//   }
// }


        });
    });

    this.metaDataDto.sectionList = sectionList;
    this.generateButtonDisable = true;

    this.service.saveFieldMetaData(this.metaDataDto, uploadType, actionType).subscribe((data: any) => {
        if (data != null) {
            this.toaster.success(this.translate.instant('Toaster_success.digital_paper'));
            this.route.navigate(['paper-details']);
        }
    }, (error) => {
        this.generateButtonDisable = false;
    });
}

  getDropdownList(fieldData: any) {
    if (this.HIDDEN_FIELDS.includes(fieldData.fieldName)) {
      return;
    }
    if (fieldData.aliasName == "Model" && fieldData.value == null) {
      const value = this.metaDataDto.sectionList[1].fieldList[3].value;
      this.dropDownService.getOption(fieldData.fieldId, value, fieldData.fieldName).subscribe((data) => {
        if (data) {
          this.dropdownData = data;
        }
      });
    }
  }

  getChildDropDownData(fieldData: any) {
    if (this.HIDDEN_FIELDS.includes(fieldData.fieldName)) {
      return;
    }
    if (fieldData.aliasName == "Make") {
      const value = null;
      this.dropDownService.getOption(fieldData.fieldId, value, fieldData.fieldName).subscribe((data) => {
        if (data) {
          this.mackDropdownList = data;
        }
      });
    }

    if (fieldData.aliasName == "Model") {
      const data = this.metaDataDto.sectionList[1].fieldList[3];
      this.dropDownService.getChildDropDownList(data.fieldId, data.value, data.fieldName).subscribe(data => {
        if (data) {
          this.dropdownData = data;
        }
      });
    }
  }

  setDateValue(data: any, value: any) {
    const date = new Date(value);
    date.setHours(12);
    date.setMinutes(30);
    date.setSeconds(45);
    data.value = date;
  }

  getFieldData() {
    const uploadType = this.activeRouter.snapshot.paramMap.get('uploadType');
    const pageId = "c741ae6b5c3a49b888d2592a51c6bu8u";
    this.service.getFieldMetaDataForGeneratePaper(pageId).subscribe((data: any) => {
      this.isActive = data.isActive;
      this.metaDataDto = data.metaData;
      if (this.editableData !== null) {
        this.createMetaDataDto();
      }
      this.metaDataDto?.sectionList.forEach(
        value => {
          if (value.sectionId === '104') {
            this.paperFieldData = value.fieldList;
            if (uploadType == undefined) {
              this.paperFieldData.forEach(field => {
                field.value = null;
                field.hasError = false;
              });
            }
          }
          else if (value.sectionId === '105') {
            this.vehicleFieldData = value.fieldList;
            if (uploadType == undefined) {
              this.vehicleFieldData.forEach(field => {
                field.value = null;
                field.hasError = false;
              });
            }
          }
        }
      );
      this.getDropDownData();
    });
  }

  getStringInput(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    return items.fieldType === 'String';
  }

  getDateInput(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    return (items.fieldType === 'pDate' || items.fieldType === 'fDate');
  }

  // Add this method to filter allowed dates: only today to one year ahead
// dateFilter = (d: Date | null): boolean => {
//   if (!d) return false;
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const maxDate = new Date();
//   maxDate.setFullYear(maxDate.getFullYear() + 1);
//   maxDate.setHours(23, 59, 59, 999);
//   return d >= today && d <= maxDate;
// };
// dateFilter = (d: Date | null, field?: Field): boolean => {
//   if (!d) return false;

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const oneYearFromToday = new Date();
//   oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
//   oneYearFromToday.setHours(23, 59, 59, 999);

//   // Dynamic range for Expiry Date
//   if (field && field.aliasName === 'Expiry Date' && this.effectiveFromSelected) {
//     return d >= this.expiryDateMin && d <= this.expiryDateMax;
//   }

//   // Default range for all other dates (including Effective From)
//   return d >= today && d <= oneYearFromToday;
// };

dateFilter = (d: Date | null, field?: Field): boolean => {
  if (!d) return false;

  const today = new Date();
  today.setHours(0,0,0,0);

  // If picking expiry date
  if (field && field.aliasName === 'Expiry Date' && this.effectiveFromSelected) {
    return d >= this.expiryDateMin && d <= this.expiryDateMax;
  }

  // Default: effective date must be today onward
  return d >= today;
};


// onEffectiveFromChange(selectedDate: Date) {
//   this.effectiveFromSelected = selectedDate;

//   // Set Expiry Date range based on selected Effective From
//   this.expiryDateMin = new Date(selectedDate);
//   this.expiryDateMax = new Date(selectedDate);
//   this.expiryDateMax.setFullYear(this.expiryDateMax.getFullYear() + 1);
// }

onEffectiveFromChange(selectedDate: Date) {
  if (!selectedDate) return;

  // Store selected Effective From
  this.effectiveFromSelected = new Date(selectedDate);

  // Set Expiry min = selected effective date
  this.expiryDateMin = new Date(selectedDate);

  // Expiry max = selected date + 1 year
  this.expiryDateMax = new Date(selectedDate);
  this.expiryDateMax.setFullYear(this.expiryDateMax.getFullYear() + 1);
}

// Convert Date → dd/MM/yyyy string
formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Return today's date formatted dd/MM/yyyy
displayCurrentDate(): string {
  return this.formatDateToDDMMYYYY(new Date());
}

// Set Expiry Date = Effective From + 1 year
setEffectiveToDate(fromDate: Date) {
  this.expiryDateMin = new Date(fromDate);
  this.expiryDateMax = new Date(fromDate);
  this.expiryDateMax.setFullYear(this.expiryDateMax.getFullYear() + 1);
}


today = new Date();

onEffectiveDateChange(field: any, event: any) {
  const selectedDate = new Date(event.value);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  // ❌ Back-dating block
  if (selectedDate < now) {
    

    const todayStr = this.displayCurrentDate();
    field.value = todayStr;

    const today = new Date();
    this.setEffectiveToDate(today); // reset expiry
    return;
  }

  // ✅ Valid date → auto set expiry +1 year
  this.setEffectiveToDate(selectedDate);

  // ✅ Also update field model
  field.value = this.formatDateToDDMMYYYY(selectedDate);
}


// Add this method to validate and log errors on date change
// onDateChanged(field: Field, event: any) {
//   const date: Date = event.value;
//   if (!this.dateFilter(date)) {
//     console.error(`Error: ${field.aliasName} is out of allowed date range.`);
//     field.hasError = true;
//     field.errorMessage = `${field.aliasName} should be between today and one year from today.`;
//   } else {
//     field.hasError = false;
//     field.errorMessage = '';
//   }
// }
onDateChanged(field: Field, event: any) {
  const date: Date = event.value;

  if (!this.dateFilter(date)) {
    console.error(`Error: ${field.aliasName} is out of allowed date range.`);
    field.hasError = true;
    field.errorMessage = `${field.aliasName} should be between today and one year from today.`;
  } else {
    field.hasError = false;
    field.errorMessage = '';

    // --- New Logic Starts Here ---
    if (field.aliasName === 'Effective From') {
      this.effectiveFromSelected = date;

      // Set Expiry Date min = selected "Effective From"
      this.expiryDateMin = new Date(date);

      // Set Expiry Date max = +1 year from that
      this.expiryDateMax = new Date(date);
      this.expiryDateMax.setFullYear(this.expiryDateMax.getFullYear() + 1);
    }

    // If Effective From cleared, revert to defaults
    if (field.aliasName === 'Effective From' && !date) {
      this.effectiveFromSelected = null;
      this.expiryDateMin = new Date();
      this.expiryDateMax = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }
    // --- New Logic Ends Here ---
  }
}


  getNumberInput(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    if (items.fieldType === 'Integer') {
      if (items.value !== null) {
        this.isEditUser = true;
      }
      return true;
    }
    return false;
  }

  getDropdownInput(items: Field) {
    //console.log('Checking dropdown input for field:', items.fieldName);
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
     // console.log('Field is hidden:', items.fieldName);
      return false;

    }
    return items.fieldType === 'Dropdown';
  }

  getMultiSelect(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    return items.fieldType === 'MultiSelect';
  }

  getCheckBox(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    return items.fieldType === 'checkbox';
  }

  getRadioButton(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    return items.fieldType === 'Radio';
  }

  getFileUploadInput(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    return items.fieldType === 'file';
  }

  getTextInput(items: Field) {
    if (this.HIDDEN_FIELDS.includes(items.fieldName)) {
      return false;
    }
    return (items.fieldType === 'text' || items.fieldType === 'Long' || items.fieldType === 'Double' || items.fieldType === 'Boolean');
  }

  onChange(event) {
    if (event !== undefined) {
      this.file = event.target.files[0];
      this.fileName = this.file.name;
      this.fileType = this.file.type;
      if (this.fileType !== "image/png" && this.fileType !== "image/jpg" && this.fileType !== "image/jpeg") {
        this.toaster.error(this.translate.instant('Toaster_error.valid_image'));
        this.fileName = '';
        this.fileField.value = '';
      }
    }
  }

  clearDateField(field: Field) {
    field.value = null;
  }

  onEnteringInput(field: Field) {
    if (field.hasError) {
      field.hasError = false;
    }
  }

  onChangingFields(field: Field) {
    if (field.hasError) {
      field.hasError = false;
    }
  }

  onDateChangingEvent(field: Field) {
    if (field.hasError) {
      field.hasError = false;
    }
  }

  setMinDate(event: any) {
    this.minDate = event.value._d;
  }
}
