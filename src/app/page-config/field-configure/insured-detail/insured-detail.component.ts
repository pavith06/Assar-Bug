import { CdkDragDrop, moveItemInArray, copyArrayItem, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import remove from 'lodash-es/remove';
import { distinctUntilChanged } from 'rxjs';
import { Field } from 'src/app/models/report-loss-dto/field';
import { UserManagementService } from 'src/app/service/user-management.service';
import * as _ from 'lodash';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { FieldConfigurationService } from 'src/app/service/field-config.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-insured-detail',
  templateUrl: './insured-detail.component.html',
  styleUrls: ['./insured-detail.component.scss']
})
export class InsuredDetailComponent  {
  insured_details_Data: any = []
  @Input() insured_details_input;
  @Input() isRefresh : boolean;
  @Output() deletedField = new EventEmitter<any>();
  @Output() updatedField = new EventEmitter<any>();
  @Output() addedField = new EventEmitter<any>();
  @Output() addedIndex = new EventEmitter<any>();
  @ViewChild('configuration') configuration: ConfigurationComponent;
  selectedField: any = null;
  activeField: any[];
  index: any = 0;
  tempCount = 1;
  fieldName: any;
  mandatory: any;
  errorMessage: any;
  metadataFieldsName: any;
  sectionList: any[];
  constructor(private service: UserManagementService,private fieldConfig : FieldConfigurationService,private toastr:ToastrService ) {

  }

  ngOnInit(): void {
    this.fieldConfig.getAddNew().subscribe((value)=>{
      if(value){
        this.activeField = null;
        this.selectedField = null;
        this.insured_details_Data = [];
        this.sectionList=value.sectionList;
        this.insured_details_Data=value;
      }
    })
  }

  /**
 * @function destination-dropped
 * @param event
 */
  destinationDropped(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        const newField = _.cloneDeep(this.insured_details_Data[event.currentIndex]);
        newField.tempId = this.tempCount;
        this.tempCount++;
        this.insured_details_Data[event.currentIndex] = newField;
        newField.fieldPosition = event.currentIndex+1;
        this.emitSelectedField(newField);
    }
    for (let i = 0; i < this.insured_details_Data.length; i++) {
      this.insured_details_Data[i].fieldPosition = i + 1;
     }
  }
  /**
   * REMOVE ITEM BY INDEX
   * @param index
   */
  removeItem(index: any, field: any) {
    this.deletedField.emit(field);
  }
  emitSelectedField(field: any) {
    this.activeField = field;
    this.selectedField = field;
    this.updatedField.emit(this.selectedField);
    this.service.editedField.next(field);
  }

}
