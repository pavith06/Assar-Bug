import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreviousRouteService } from '../service/previous-route.service';

@Component({
  selector: 'app-generate-paper',
  templateUrl: './generate-paper.component.html',
  styleUrls: ['./generate-paper.component.scss'],
})
export class GeneratePaperComponent implements OnInit {
  manual_underline = true;
  bulk_underline = false;
  currentRoute: string;



  manualUpload() {
    this.manual_underline = true;
    this.bulk_underline = false;
  }

  bulkUpload() {
    this.bulk_underline = true;
    this.manual_underline = false;
  }

  bulkrevoke = 'ghrfhgtgh';
  constructor(private router: Router,  private previousRouteService:PreviousRouteService) {
 this.getCurrentUrl();
  }

  ngOnInit(): void {
    this.bulkrevoke = sessionStorage.getItem('revoke');
    // this.previousRouteService.getCurrentRouter().subscribe((response)=>{
    //   if (response) {
    //     const currentRouter = response;
    //     if (currentRouter.includes("/manual")) {
    //       this.manual_underline = true;
    //       this.bulk_underline = false;
    //     }else{
    //       this.manual_underline = false;
    //       this.bulk_underline = true;
    //     }
    //   }
    // })

  }

  getCurrentUrl() {
    this.currentRoute = window.location.href;
    if (this.currentRoute.includes('/bulk')) {
      this.bulk_underline = true;
      this.manual_underline = false;
    } else if (this.currentRoute.includes('/manual')) {
      this.manual_underline = true;
      this.bulk_underline = false;
    }
  }

  manual() {
    this.router.navigate(['generate-paper/manual']);
  }
}
