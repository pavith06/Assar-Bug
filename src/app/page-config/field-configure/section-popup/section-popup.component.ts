import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ImplementConfigServiceService } from 'src/app/implement-config-service.service';
import { SectionDetailsDto } from 'src/app/models/field-configuration-dto/section-details-dto';
import { FieldConfigurationService } from 'src/app/service/field-config.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-section-popup',
  templateUrl: './section-popup.component.html',
  styleUrls: ['./section-popup.component.scss'],
})
export class SectionPopupComponent implements OnInit {
  sectionName: FormGroup;

  headerName: string;
  section: boolean;
  stages: boolean;
  SatgeValue: string;
  configSection: boolean;
  insured_details_Data: any[];
  sectionNameDatas: any[] = [];
  tempCount: any;
  constructor(
    public dialogRef: MatDialogRef<SectionPopupComponent>,
    private service: ImplementConfigServiceService,
    private userManagementService: UserManagementService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private fieldConfig: FieldConfigurationService,
    private translate: TranslateService
  ) {
    dialogRef.disableClose = true;
    this.headerName = this.data.headerName;
    this.section = this.data.sectionShow;
    this.configSection = this.data.configSection;
    this.stages = this.data.stages;
    this.insured_details_Data = this.data.sectionNames;

    if (this.stages) {
      this.SatgeValue = 'Stages';
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    this.sectionName = this.fb.group({
      sectionName: new FormControl(''),
    });
  }

  addSectionName() {
    const section = new SectionDetailsDto();
    section.platformId = 2;
    section.pageIdentity = 'c741ae6b5c3a49b888d2592a51c6bu8u';
    section.subSectionIdentity = 'iogiufvcajywfdcwvjaxs';
    section.sectionName = this.sectionName.get('sectionName').value;
    this.fieldConfig.addSectionName(section).subscribe((value) => {
      if (value === true) {
        this.dialogRef.close(true);
      }
    });
  }
  closeDialog() {
    this.dialogRef.close(false);
  }

  /**
   * @function destination-dropped
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.insured_details_Data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        this.insured_details_Data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const newField = _.cloneDeep(
        this.insured_details_Data[event.currentIndex]
      );
      newField.tempId = this.tempCount;
      this.tempCount++;
      this.insured_details_Data[event.currentIndex] = newField;
      // this.emitSelectedField(newField);
    }
    for (let i = 0; i < this.insured_details_Data.length; i++) {
      this.insured_details_Data[i].fieldPosition = i + 1;
    }
  }
  sectionDetailsDto: SectionDetailsDto[] = [];
  inputChanges(event: any, index: number) {
    for (let i = 0; i <= this.insured_details_Data.length; i++) {
      if (i === index) {
        this.insured_details_Data[index].sectionName = event.target.value;
        this.sectionDetailsDto = this.insured_details_Data;
      }
    }
  }

  saveConfigureSection() {
    if (this.sectionDetailsDto.length > 0) {
      this.fieldConfig.saveConfigureSection(this.sectionDetailsDto).subscribe((result) => {
          if (result) {
            this.toastr.success(this.translate.instant('Toaster_success.update'));
            this.dialogRef.close(true);
          }
        });
    } else {
      this.fieldConfig.saveConfigureSection(this.insured_details_Data).subscribe((result) => {
          if (result) {
            this.toastr.success(this.translate.instant('Toaster_success.update'));
            this.dialogRef.close(true);
          }
        });
    }
  }

  deleteSection(identity: string) {
    this.fieldConfig.deleteSectionName(identity).subscribe((val)=> {
      if(val === true) {
        this.toastr.success(this.translate.instant('Toaster_success.delete'));
        this.ngOnInit();
        this.closeDialog();
       }
    })
  }
}

export interface DialogData {
  sectionNames: any[];
  headerName: string;
  sectionShow: boolean;
  configSection: boolean;
  stages: boolean;
}
