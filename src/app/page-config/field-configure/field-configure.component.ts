/* eslint-disable @typescript-eslint/no-unused-vars */
import { CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { E } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import remove from 'lodash-es/remove';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { DeletedFieldDto } from 'src/app/models/entity-management-dto/delete-fields-dto';
import { ReportDto } from 'src/app/models/entity-management-dto/report-dto';
import { FieldConfig } from 'src/app/models/field-config';
import { Field } from 'src/app/models/report-loss-dto/field';
import { MetaDataDto } from 'src/app/models/report-loss-dto/meta-data-dto';
import { Section } from 'src/app/models/report-loss-dto/section';
import { ReportLossService } from 'src/app/service/report-loss.service';
import { ConfigurationComponent } from './configuration/configuration.component';
import { InsuredDetailComponent } from './insured-detail/insured-detail.component';
import { StagesComponent } from './stages/stages.component';
import * as _ from 'lodash';
import { UserManagementService } from 'src/app/service/user-management.service';
import { FieldConfigurationService } from 'src/app/service/field-config.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SectionPopupComponent } from './section-popup/section-popup.component';
import { FieldDTO } from 'src/app/models/field-dto';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-field-configure',
  templateUrl: './field-configure.component.html',
  styleUrls: ['./field-configure.component.scss'],
})
export class FieldConfigureComponent implements OnInit {
  insured_detail_Class = 'insured';
  tp_detail_Class = 'tp';
  loss_detail_Class = 'loss';
  police_detail_Class = 'police';
  sub_page = 'sub-page';
  /**MOCK DATA FOR FIELDS */
  minlength: number;
  maxlength: number;
  field: FieldDTO;
  FiledItem_Data: Field[] = [
    {
      fieldId: null,
      aliasName: 'Text Box',
      icon: '/assets/page_config_icons/textboxt.svg',
      defaultValues: '',
      columnName: '',
      entityName: '',
      fieldName: 'Text Box',
      fieldType: null,
      isCoreData: false,
      mandatory: false,
      value: '',
      referenceId: null,
      index: null,
      isSystemGenerated: false,
      tempId: null,
      fieldPosition: null,
      errorMessage: '',
      minLength: 0,
      maxLength: 100,
    },

    {
      fieldId: null,
      aliasName: 'Drop Down',
      icon: '/assets/page_config_icons/dropdown.svg',
      defaultValues: '',
      columnName: '',
      entityName: '',
      fieldName: 'DropDown',
      fieldType: 'Dropdown',
      isCoreData: false,
      mandatory: false,
      value: '',
      referenceId: null,
      index: null,
      isSystemGenerated: false,
      tempId: null,
      fieldPosition: null,
      dropDownList: [{ fieldOptionName: '', fieldOptionIdentity: '' }],
      errorMessage: '',
      minLength: 0,
      maxLength: 100,
    },

    {
      fieldId: null,
      aliasName: 'Date',
      icon: '/assets/page_config_icons/date.svg',
      defaultValues: '',
      columnName: '',
      entityName: '',
      fieldName: 'Date',
      fieldType: 'pDate',
      isCoreData: false,
      mandatory: false,
      value: '',
      referenceId: null,
      index: null,
      isSystemGenerated: false,
      tempId: null,
      fieldPosition: null,
      errorMessage: '',
      minLength: 0,
      maxLength: 100,
    },

    {
      fieldId: null,
      aliasName: 'checkBox',
      icon: '/assets/page_config_icons/checkbox.svg',
      defaultValues: '',
      columnName: '',
      entityName: '',
      fieldName: 'checkBox',
      fieldType: 'checkbox',
      isCoreData: false,
      mandatory: false,
      value: '',
      referenceId: null,
      index: null,
      isSystemGenerated: false,
      tempId: null,
      fieldPosition: null,
      errorMessage: '',
      minLength: 0,
      maxLength: 100,
    },

    {
      fieldId: null,
      aliasName: 'Radio',
      icon: '/assets/page_config_icons/radio.svg',
      defaultValues: '',
      columnName: '',
      entityName: '',
      fieldName: 'Radio',
      fieldType: 'Radio',
      isCoreData: false,
      mandatory: false,
      value: '',
      referenceId: null,
      index: null,
      isSystemGenerated: false,
      tempId: null,
      fieldPosition: null,
      dropDownList: [{ fieldOptionName: '', fieldOptionIdentity: '' }],
      errorMessage: '',
      minLength: 0,
      maxLength: 100,
    },

    {
      fieldId: null,
      aliasName: 'File Upload',
      icon: '/assets/page_config_icons/fileupload.svg',
      defaultValues: '',
      columnName: '',
      entityName: '',
      fieldName: 'fileUpload',
      fieldType: 'file',
      isCoreData: false,
      mandatory: false,
      value: '',
      referenceId: null,
      index: null,
      isSystemGenerated: false,
      tempId: null,
      fieldPosition: null,
      errorMessage: '',
      minLength: 0,
      maxLength: 100,
    },
  ];

  fieldList: Field[] = [];
  stageSectionMap = new Map<String, string[]>();
  sectionFieldMap = new Map<String, Field[]>();
  insertedFieldMap=new Map<String,Field[]>();   // this map is added to avoid inserted field order arrangement 
                                                // change while changing tab
  deletedFieldMap = new Map<String, String[]>();
  metaData: MetaDataDto;
  metaDatoList: ReportDto[] = [];
  configureFieldList: any;
  subSection: any;
  sectionName: string;
  fieldForChild: [];
  sectionList: any[];
  inputData: any;
  test = [];
  activeSection: string;
  deletedFieldList: DeletedFieldDto[] = [];
  stageDetailsList: Section[] = [];
  @ViewChild('configuration') configuration: ConfigurationComponent;
  @ViewChild('stage') stage: StagesComponent;
  @ViewChild('fieldList') fields: InsuredDetailComponent;
  selectedStage: any;
  isObjectAdded: boolean;
  isFieldChanged: boolean = false;
  fieldAddedToDeletion: boolean;
  addedIndex: any;
  isNewFieldAdded: boolean;
  stageSectionData: Section[] = [];
  fieldAddCount = 1;
  metaDataDto: MetaDataDto;
  paperFieldData: Field[];
  vehicleFieldData: Field[];
  subSectionList: any[];
  isRefresh = false;
  fieldMetaData: any[];
  constructor(
    private reportService: ReportLossService,
    private toastr: ToastrService,
    private service: UserManagementService,
    private fieldConfig: FieldConfigurationService,
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getSectionNames();
    this.getMetaData();
  }
  getSectionNames() {
    const parentSectionId = 80;
    const pageIdentity = 'c741ae6b5c3a49b888d2592a51c6bu8u';
    this.fieldConfig
      .getSectionNames(pageIdentity, parentSectionId)
      .subscribe((res: any[]) => {
        if (res) {
          this.subSectionList = [];
          res.forEach((value) => {
            this.subSectionList.push(value);
          });
        }
      });
  }

  openSection() {
    const dialogRef = this.dialog.open(SectionPopupComponent, {
      width: '441px',

      data: {
        headerName: 'Add New Section',
        sectionShow: true,
        configSection: false,
        stages: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getSectionNames();
      }
    });
  }

  openConfigSection() {
    const dialogRef = this.dialog.open(SectionPopupComponent, {
      width: '441px',

      data: {
        headerName: 'Configure Section',
        sectionShow: false,
        configSection: true,
        stages: false,
        sectionNames: this.subSectionList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getSectionNames();
    });
  }

  getMetaData() {
    const pageId = 'c741ae6b5c3a49b888d2592a51c6bu8u';
    this.service.getMetaData(pageId).subscribe((data: any) => {
      this.fieldMetaData = Object.values(data);
      this.metaDataDto = {
        IsActive: this.fieldMetaData[0],
        pageId: this.fieldMetaData[1].pageId,
        pageName: this.fieldMetaData[1].pageName,
        enabled: this.fieldMetaData[1].enabled,
        sectionList: this.fieldMetaData[1].sectionList,
      };
      // this.metaDataDto =  this.fieldMetaData;
      // this.metaDataDto = data.metaData;
      this.stageSectionData = [];
      //  this.subSectionList = [];
      this.metaDataDto.sectionList.forEach((value) => {
        const section = new Section();
        section.sectionName = value.sectionName;
        section.isEnabled =
          value.isEnabled == null || value.isEnabled == false ? false : true;
        section.sectionId = value.sectionId;
        this.stageSectionData.push(section);
        this.sectionList = [];
        value.fieldList.forEach((ele) => {
          this.sectionList.push(ele);
        });
        this.sectionFieldMap.set(value.sectionId, this.sectionList);
      });
      this.inputData = [];
      console.log(this.activeSection);
      if (this.activeSection === undefined) {
        this.inputData = this.metaDataDto.sectionList[0].fieldList;
      }else{
        const filterMetadata= this.metaDataDto.sectionList.find((data) => data.sectionId === this.activeSection );
        this.inputData = filterMetadata.fieldList;
      }

      this.fieldConfig.setAddNew(this.inputData);
    });

    
  }

  /**
   * PREDICATE EMPTY DEFAULT
   * @returns
   */
  noReturnPredicate() {
    return false;
  }
  /**
   * DRAG THE POINTER EXIT
   * @param event
   */
  onSourceListExited(event: CdkDragExit<any>) {
    this.FiledItem_Data.splice(event.container.data(event.item) + 1, 0, {
      ...event.item.data,
      temp: true,
    });
  }
  /**
   * TAB CHANGE EVENT TRIGGER
   * @param event
   */
  tabchange(event: any) {
    if (this.configuration.activeField != null) {
      this.getUpdateFields(true);
    }
    const setNullValue = null;
    this.service.editedField.next(setNullValue);

    // this.getFieldList(event.tab.textLabel);
    this.inputData = [];
    this.activeSection =
      event.tab == undefined
        ? this.activeSection
        : event.tab.textLabel.sectionId.toString();

    let sectionFieldObject;
    if(this.insertedFieldMap.has(this.activeSection)){
        sectionFieldObject=this.insertedFieldMap.get(this.activeSection);
    }
    else{
      sectionFieldObject = this.sectionFieldMap.get(this.activeSection);
    }
    if (sectionFieldObject != undefined) {
      sectionFieldObject.forEach((element) => {
        this.FiledItem_Data.forEach((ele) => {
          ele.aliasName == element.fieldType ? (element.icon = ele.icon) : '';
        });
        this.inputData.push(element);
      });
    } else {
      this.inputData = [];
    }
    // this.service.loaderData.next(this.inputData);
    this.fieldConfig.setAddNew(this.inputData);
  }
  /**
   * DRAG THE POINTER ENTERED
   * @param event
   */
  onSourceListEntered(event: CdkDragEnter<any>) {
    remove(this.FiledItem_Data, { temp: true });
  }

  getSelectedStage(event: any) {
    this.selectedStage = event;
    this.subSectionList = [];
    this.stageSectionMap.get(event).forEach((ele) => {
      this.subSectionList.push(ele);
    });
  }

  getDeletedField(event: any) {
    const index = this.inputData.indexOf(event);
    this.inputData.splice(index, 1);

    if(this.insertedFieldMap.has(this.activeSection)){
      const insertedFieldMapArray = this.insertedFieldMap.get(this.activeSection);
      const index=insertedFieldMapArray.indexOf(event);
      insertedFieldMapArray.splice(index, 1);
      this.insertedFieldMap.set(this.activeSection,insertedFieldMapArray);
    }

    let sectionFieldObject = this.sectionFieldMap.get(this.activeSection);
    sectionFieldObject = this.inputData;
     this.sectionFieldMap.set(this.activeSection, sectionFieldObject);

     if(this.metaDatoList.length !==0){
       this.metaDatoList[0].fieldList =  this.inputData;
     }
    event.defaultValues = 'delete';
    this.service.editedField.next(event);
    if (event.fieldId) {
      const deletedIdnty = [];
      this.deletedFieldList = [];
      deletedIdnty.push(event.identity);
      const dltFld = new DeletedFieldDto();
      dltFld.sectionName = this.metaDataDto.sectionList.find((data) => data.sectionId === this.activeSection ).sectionName;
      dltFld.fieldId = deletedIdnty;
      this.deletedFieldList.push(dltFld);

      const data = new FieldConfig();
      data.platformId = 2;
      data.deletedFields = this.deletedFieldList;
      if (event.fieldId) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.fieldConfig.addOrUpdateFields(data).subscribe((data) => {
          this.service.editedField.next(null);
        });
      }
    }
  }

  getUpdateFields(evt: any) {
    this.isFieldChanged = false;

    if(evt instanceof Object){
      // const sectionData:Field[]=this.sectionFieldMap.get(this.activeSection);
      let sectionData: Field[] =[];
      if(this.insertedFieldMap.has(this.activeSection)){
          sectionData=[...this.insertedFieldMap.get(this.activeSection)]
      }
      else{
           sectionData= [...this.sectionFieldMap.get(this.activeSection)];
      }
      if(sectionData.includes(evt)){
          const duplicateIndex=sectionData.indexOf(evt);
          sectionData.splice(duplicateIndex,1);
      }
      const toAddIndex=evt.fieldPosition;
      sectionData.splice(toAddIndex-1,0,evt);
      this.insertedFieldMap.set(this.activeSection,sectionData);
    }

    const fieldObject = this.configuration.activeField;
    if (fieldObject != null) {
      fieldObject.isCoreData =
        this.configuration.fieldConfigForm.controls['coreDataControl'].value;
      fieldObject.aliasName =
        this.configuration.fieldConfigForm.controls['fieldNameControl'].value;
      fieldObject.mandatory =
        this.configuration.fieldConfigForm.controls['mandatoryControl'].value;
      fieldObject.errorMessage =
        this.configuration.fieldConfigForm.controls[
          'errorMessageControl'
        ].value;
      if (fieldObject.dropDownList) {
        fieldObject.dropDownList.forEach((val) => {
          if (val.fieldOptionName != null) {
            fieldObject.dropDownList =
              this.configuration.fieldConfigForm.controls['dropdownList'].value;
          }
        });
      }
      if (this.configuration.canShowDropDown) {
        fieldObject.fieldType =
          this.configuration.fieldConfigForm.controls[
            'optionControlControl'
          ].value;
      } else {
        fieldObject.fieldType =
          this.configuration.fieldConfigForm.controls[
            'optionControlControl'
          ].value;
      }
      if (fieldObject.fieldId != null) {
        const sectionFieldObject = this.sectionFieldMap.get(this.activeSection);
        for (const sectionFld of sectionFieldObject) {
          if (
            !objectEquals(sectionFld, fieldObject) &&
            sectionFld.fieldId == fieldObject.fieldId
          ) {
            this.isFieldChanged = true;
            break;
          }
        }

        if (this.isFieldChanged) {
          const identityArray = this.inputData.map((ele) => ele.fieldId);
          const index = identityArray.indexOf(fieldObject.fieldId);
          this.inputData[index] = fieldObject;

          const fieldIdentity = sectionFieldObject.map((ele) => ele.fieldId);
          for (let i = 0; i < fieldIdentity.length; i++) {
            if (fieldIdentity[i] == fieldObject.fieldId) {
              sectionFieldObject[i] = fieldObject;
            }
          }

          this.isObjectAdded = false;
          const metaDataDto = new ReportDto();
          metaDataDto.fieldList.push(fieldObject);
          metaDataDto.section = this.metaDataDto.sectionList.find((data) => data.sectionId === this.activeSection ).sectionName;
          metaDataDto.stage = this.selectedStage;

          if (this.metaDatoList.length > 0) {
            this.metaDatoList.forEach((ele) => {
              if (
                ele.section == metaDataDto.section &&
                metaDataDto.stage == this.selectedStage
              ) {
                const fieldIdty = ele.fieldList.map((res) => res.fieldId);
                const index = fieldIdty.indexOf(fieldObject.fieldId);
                this.isObjectAdded = true;
                if (index != -1) {
                  ele.fieldList[index] = fieldObject;
                } else {
                  ele.fieldList.push(fieldObject);
                }
              }
            });
          }

          if (this.isObjectAdded == false) {
            this.metaDatoList.push(metaDataDto);
          }
        }
        this.fieldConfig.setAddNew(this.inputData);
      } else if (fieldObject.fieldId === null) {
        const sectionFieldObject = this.sectionFieldMap.get(this.activeSection);
        if (sectionFieldObject !== undefined) {
          const fieldTempIdentity = sectionFieldObject
            .filter((ele) => ele.tempId != undefined || ele.tempId != null)
            .map((ele) => ele.tempId);
        }

        this.isNewFieldAdded = false;
        const metaDataDto = new ReportDto();
        metaDataDto.fieldList = sectionFieldObject;
        metaDataDto.section = this.metaDataDto.sectionList.find((data) => data.sectionId === this.activeSection ).sectionName;
        metaDataDto.stage = this.selectedStage;

        this.metaDatoList.forEach((ele) => {
          if (ele.section == metaDataDto.section) {
            const fieldIdty = ele.fieldList.map((res) => res.tempId);
            const index = fieldIdty.indexOf(fieldObject.tempId);
            if (index == -1) {
              ele.fieldList.push(fieldObject);
            } else {
              ele.fieldList[index] = fieldObject;
            }
            this.isNewFieldAdded = true;
          }
        });
        if (this.isNewFieldAdded == false) {
          this.metaDatoList.push(metaDataDto);
        }
        // this.fieldConfig.setAddNew( this.inputData);
        // this.service.loaderData.next(this.inputData);
      } else {
        const sectionField: Field[] = [];
        sectionField.push(fieldObject);
        const metaDataDto = new ReportDto();
        metaDataDto.fieldList = sectionField;
        metaDataDto.section = this.metaDataDto.sectionList.find((data) => data.sectionId === this.activeSection ).sectionName;
        if (sectionField) {
          this.sectionFieldMap.set(metaDataDto.section, metaDataDto.fieldList);
          this.metaDatoList.push(metaDataDto);
        }
      }
    } else {
      const sectionFieldObject = this.sectionFieldMap.get(this.activeSection);
      this.isNewFieldAdded = false;
      const metaDataDto = new ReportDto();
      metaDataDto.fieldList = sectionFieldObject;
      metaDataDto.section =this.metaDataDto.sectionList.find((data) => data.sectionId === this.activeSection ).sectionName;
      metaDataDto.stage = this.selectedStage;
      this.metaDatoList.forEach((ele) => {
        if (ele.section == metaDataDto.section) {
          if (ele.fieldList) {
            const fieldIdty = ele.fieldList.map((res) => res.tempId);
            if (fieldObject && fieldObject.tempId) {
              const index = fieldIdty.indexOf(fieldObject.tempId);
              if (index == -1) {
                ele.fieldList.push(fieldObject);
              } else {
                ele.fieldList[index] = fieldObject;
              }
              this.isNewFieldAdded = true;
            }
          }
        }
        if (this.isNewFieldAdded == false) {
          this.metaDatoList.push(metaDataDto);
        }
      });
      if (this.metaDatoList.length === 0) {
        this.metaDatoList.push(metaDataDto);
      }
      this.fieldConfig.setAddNew(this.inputData);
      // this.service.loaderData.next(this.inputData);
    }
  }

  saveConfiguration() {
    this.insertedFieldMap=new Map<String,Field[]>(); 
    this.getUpdateFields(true);

    if(this.isNewFieldAdded===false && this.configuration.fieldConfigForm.controls['fieldNameControl'].value){
      this.toastr.error(this.translate.instant('Toaster_error.No_Modified_Field'));
      this.service.editedField.next(null);
      return;
    }

    if (this.metaDatoList.length > 0) {
       
          // this.metaDatoList.forEach((data)=>{
          //   let fieldData = [];
          //   fieldData = data.fieldList;
          //    let duplicates = [];
          //     duplicates = Array.from(
          //      new Set(
          //        fieldData.filter(
          //          (column, index) =>
          //            fieldData.findIndex(
          //              (item) => item.aliasName === column.aliasName
          //            ) !== index
          //        )
          //      )
          //    );
          //    if (duplicates.length > 0) {
          //      this.toastr.error(this.translate.instant('Toaster_error.field_exist'));
          //      return;
          //    }

          // })


        const data = new FieldConfig();
        data.platformId = 2;
        let finalUpdatedFields: string[] = [];

        this.metaDatoList = this.metaDatoList
          .map((metaData) => {
            metaData.fieldList = metaData.fieldList.filter((element) => {
              return !this.FiledItem_Data.some((value) => element.aliasName === value.aliasName);
            });
        
            return metaData;
          })
          .filter((metaData) => {
            const shouldKeep = !finalUpdatedFields.includes(metaData.section);
            finalUpdatedFields.push(metaData.section);
            return shouldKeep;
          });

        data.updatedFields=this.metaDatoList;
               
        this.fieldConfig.addOrUpdateFields(data).subscribe((data) => {
          if (data) {
            this.metaDatoList = [];
            this.deletedFieldList = [];
            this.getMetaData();
            this.toastr.success(this.translate.instant('Toaster_success.fields_modify'));
            this.service.editedField.next(null);
          } else {
            this.toastr.error(this.translate.instant('Toaster_error.fields_modify_none'));
          }
        });
   

    }
  }

  getNewlyAddedFields(evt: any) {
    const fieldObject = _.cloneDeep(evt);
    const sectionFieldLnk = this.sectionFieldMap.get(this.activeSection);
    fieldObject.tempId = null;
    fieldObject.tempId = this.fieldAddCount;
    sectionFieldLnk.splice(this.addedIndex, 0, fieldObject);
    this.fieldAddCount++;
    this.inputData = [];
    sectionFieldLnk.forEach((element) => {
      this.FiledItem_Data.forEach((ele) => {
        ele.aliasName == element.fieldType ? (element.icon = ele.icon) : '';
      });
      this.inputData.push(element);
    });
    this.service.loaderData.next(this.inputData);
  }

  getAddedIndex(event: any) {
    this.addedIndex = event;
  }

  getStageDetails(event: any) {
    const idList = this.stageDetailsList.map((ele) => ele.sectionId);
    const posistion = idList.indexOf(event.sectionId);
    if (posistion == -1) {
      this.stageDetailsList.push(event);
    } else {
      this.stageDetailsList[posistion] = event;
    }
  }
}
export function objectEquals(obj1, obj2) {
  for (var i in obj1) {
    if (obj1.hasOwnProperty(i)) {
      if (!obj2.hasOwnProperty(i)) return false;
      if (obj1[i] != obj2[i]) return false;
    }
  }
  for (var i in obj2) {
    if (obj2.hasOwnProperty(i)) {
      if (!obj1.hasOwnProperty(i)) return false;
      if (obj1[i] != obj2[i]) return false;
    }
  }
  return true;
}
