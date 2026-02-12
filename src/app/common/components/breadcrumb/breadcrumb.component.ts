import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
export interface Breadcrumb {
  label: string;
  url: string;
}
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: any;
  props:any;
  constructor(
    private breadcrumbService: BreadcrumbService,) { }

  ngOnInit() {
    this.breadcrumbService.set('@ChildOne', 'Child One');
  }

}
