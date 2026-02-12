import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SectionPopupComponent } from '../section-popup/section-popup.component';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent  implements OnInit{
  notify:boolean = false;
  claim:boolean = false;
  liability:boolean = false;
  settlement:boolean = false;
  @Input() stage : any;
  @Output() selectedStage = new EventEmitter<any>();
  @Output() stageData = new EventEmitter<any>();
  activeStage: any;
  constructor(public dialog: MatDialog){

  }
  ngOnInit(): void {

  }
  /**
   * NOTIFICATION CARD NGCLASS METHOD
   */
  notification_card(index:any,evt:any){
    this.selectedStage.emit(this.stage[index].sectionName);
    this.stageData.emit(evt);
    this.activeStage = evt;
  }
  /**
   * CLAIM CARD NGCLASS METHOD
   */
  claim_card(){
    this.notify = false;
    this.claim= true;
    this.liability = false;
    this.settlement= false;
  }
  /**
   * LIABILITY CARD NGCLASS METHOD
   */
  liability_card(){
    this.notify = false;
    this.claim= false;
    this.liability = true;
    this.settlement= false;
  }
  /**
   * SETTLEMENT CARD NGCLASS METHOD
   */
  settlement_card(){
    this.notify = false;
    this.claim= false;
    this.liability = false;
    this.settlement= true;
  }
  openStages()
  {

      const dialogRef = this.dialog.open(SectionPopupComponent, {
        width: '441px',

        data: {
          headerName:'Rename',
          sectionShow: false,
          configSection:false,
          stages:true,
        },


      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

      });


  }
}
