import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ReportLossService } from 'src/app/service/report-loss.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Field } from 'src/app/models/report-loss-dto/field';
import { DropDownListDto } from 'src/app/models/entity-management-dto/drop-down-type';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FieldConfigurationService } from 'src/app/service/field-config.service';
import { ToastrService } from 'ngx-toastr';
import { DataTypeEnum } from 'src/app/models/field-config-enum/datatypeenum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  select: any;
  fieldConfigForm!: FormGroup;
  canShowDataType: boolean;
  canShowDropDown: boolean;
  @Input() selectedFields: any;
  activeField: Field = null;
  optionalInputField: string;
  selectedField: Field = null;
  optionalInuputData: string[] = [];
  dropDownEnable: boolean;
  deletedIdentityList: any;
  active: any;
  constructor(
    private fb: FormBuilder,
    private report: ReportLossService,
    private service: UserManagementService,
    private toastr: ToastrService,
    private fieldConfig: FieldConfigurationService,
    private translate: TranslateService
  ) {}
  /** ACCESS MOCK DATA */
  Access_List_Data: any = [
    { IsActive: true, Name: 'Insured Company' },
    { IsActive: false, Name: 'Third Part Company' },
  ];
  /** OPTION MOCK DATA */
  Options_Data: DropDownListDto[] = [
    { value: '0', viewValue: 'Long' },
    { value: '1', viewValue: 'Double' },
    { value: '2', viewValue: 'Boolean' },
    { value: '3', viewValue: 'String' },
  ];
  dataType = ['STRING', 'NUMBER', 'LONG', 'BOOLEAN', 'DOUBLE', 'TEXT'];
  optionalDataType = ['DROPDOWN', 'MULTISELECT', 'RADIOBUTTON', 'CHECKBOX'];

  /** DATA TYPE MOCK DATA */
  data_Type_Data: any = [
    { value: '0', viewValue: 'String' },
    { value: '1', viewValue: 'file' },
    { value: '2', viewValue: 'checkbox' },
    { value: '3', viewValue: 'pDate' },
    { value: '4', viewValue: 'Dropdown' },
    { value: '5', viewValue: 'MultiSelect' },
    { value: '6', viewValue: 'Radio' },
    { value: '7', viewValue: 'fDate'}
  ];

  radio_data = [
    { value: false, viewValue: 'Insurance Company' },
    { value: true, viewValue: 'Third Party Company' },
  ];
  get channels() {
    return this.fieldConfigForm.get('AccessList') as FormArray;
  }

  ngOnInit(): void {
    this.service.editedField.subscribe((data: any) => {
      if (data != null) {
        if(!data.defaultValues){
        this.formBuilder();
        this.activeField = null;
        if (data != null && data != undefined) {
          const recievedData = JSON.stringify(data);
          if (recievedData !== undefined) {
            this.activeField = JSON.parse(recievedData);
          }
        }
        this.bindFieldData(this.activeField);
        this.enableDisableConfiguration(this.activeField);
      }
      } else {
        this.activeField = null;
        this.dropDownEnable=false;
        const setNullValue='';
        this.fieldConfigForm.controls['fieldNameControl'].setValue(setNullValue);
        this.fieldConfigForm.controls['mandatoryControl'].setValue(setNullValue);
        this.fieldConfigForm.controls['coreDataControl'].setValue(setNullValue);
        this.fieldConfigForm.controls['datatypeControlControl'].setValue(setNullValue);
        this.fieldConfigForm.controls['optionControlControl'].setValue(setNullValue);
        this.fieldConfigForm.controls['errorMessageControl'].setValue(setNullValue);
      }
    });
  }

  bindFieldData(activeField: Field) {
    if (activeField !== null && activeField.fieldName !== undefined) {
      this.fieldConfigForm.controls['fieldNameControl'].setValue(
        activeField.aliasName
      );
      this.fieldConfigForm.controls['mandatoryControl'].setValue(
        activeField.mandatory
      );
      this.fieldConfigForm.controls['coreDataControl'].setValue(
        activeField.isCoreData
      );
      this.canShowDataType = this.dataType.includes(
        activeField.fieldName.toUpperCase()
      );
      this.canShowDropDown = this.optionalDataType.includes(
        activeField.fieldName.toUpperCase()
      );
      this.fieldConfigForm.controls['datatypeControlControl'].setValue(
        activeField.referenceId
      );
      this.fieldConfigForm.controls['optionControlControl'].setValue(
        activeField.fieldType
      );
      this.fieldConfigForm.controls['errorMessageControl'].setValue(
        activeField.errorMessage
      );
    }
  }

  enableDisableConfiguration(activeField: Field) {
    if (
      activeField !== null &&  activeField.fieldType == DataTypeEnum.dropDownFieldType ||
      activeField !== null && activeField.aliasName ==  DataTypeEnum.dropDownAliasName ||
      activeField !== null &&  activeField.fieldType == DataTypeEnum.multiselectFieldType ||
      activeField !== null &&  activeField.aliasName == DataTypeEnum.multiselectFieldType ||
      activeField !== null &&  activeField.aliasName == DataTypeEnum.radioFieldType ||
      activeField !== null &&  activeField.fieldType == DataTypeEnum.radioFieldType
    ) {
      const options = this.fieldConfigForm.get('dropdownList') as FormArray;
      options.reset();
      this.fieldConfigForm.patchValue(activeField.dropDownList);
      this.activeField.dropDownList.forEach((opt) =>
        options.push(this.fb.group(opt))
      );
      this.dropDownEnable = true;
    } else {
      this.dropDownEnable = false;
    }
    // if (this.activeField.fieldType === 'Date') {
    //   this.activeField = false;
    // }
  }
  private formBuilder() {
    this.fieldConfigForm = this.fb.group({
      fieldNameControl: [''],
      mandatoryControl: [''],
      datatypeControlControl: [''],
      optionControlControl: [''],
      coreDataControl: [''],
      errorMessageControl: [''],
      dropdownList: this.fb.array([]),
    });
  }
  /**
   * RADIO CHNAGE EVENT
   * @param event
   */
  changeEventRadio(event: any) {
    let result = event;
  }

  setInpoutValue(event: any) {
    this.optionalInuputData.push(event.target.value);
  }

  /**
   * @function add-new-dropdown
   * @param index
   */
  addOptionFormGroup(index: number) {
    const options = this.fieldConfigForm.get('dropdownList') as FormArray;
    options.insert(index, this.createOptionFormGroup());
  }

  /**
   * @function remove-existing-dropdown
   * @param index
   */
  deleteOptionFormGroup(index: number) {
    const emails = this.fieldConfigForm.get('dropdownList') as FormArray;
    emails.controls.forEach((control: FormControl, i: number) => {
      if (
        control.value.fieldOptionIdentity === '' ||
        control.value.fieldOptionIdentity === null
      ) {
        emails.removeAt(index);
      } else {
        if (i === index) {
          const identity = control.value.fieldOptionIdentity;
          emails.removeAt(index);
          this.fieldConfig
            .deleteDropDownOption(identity)
            .subscribe((result) => {
              if (result === true) {
                this.ngOnInit();
                this.toastr.success(this.translate.instant('Toaster_success.fields_delete'));
              }
            });
        }
      }
    });
  }
  /**
   * @function build-dropdown-data
   */
  get dropDownData() {
    return this.fieldConfigForm.get('dropdownList') as FormArray;
  }

  /**
   * @function init-dropdown-options
   */
  createOptionFormGroup() {
    return this.fb.group({
      fieldOptionName: '',
      fieldOptionIdentity: '',
    });
  }
}
/**
 * CHECKBOX ERROR ABSTRACT METHOD
 * @returns
 */
export function customValidateArrayGroup() {
  return function validate(formArr: AbstractControl): ValidationErrors | null {
    const filtered = formArr.value.filter((chk) => chk.isActive);
    return filtered.length ? null : { hasError: true };
  };
}
