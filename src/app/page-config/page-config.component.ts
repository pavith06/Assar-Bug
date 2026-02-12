import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-config',
  templateUrl: './page-config.component.html',
  styleUrls: ['./page-config.component.scss']
})
export class PageConfigComponent implements OnInit {
  fieldconfigure_Class ="fieldconfigure"
  scheduler_Class ="scheduler";
  main_page="main-page"
  constructor(){

  }
  ngOnInit(): void {

  }
  /**
   * TAB CHANGE EVENT
   * @param event
   */
  tabchange(event:any){

  }
}
