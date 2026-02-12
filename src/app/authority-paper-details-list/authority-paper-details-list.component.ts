import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-authority-paper-details-list',
  templateUrl: './authority-paper-details-list.component.html',
  styleUrls: ['./authority-paper-details-list.component.scss'],
})
export class AuthorityPaperDetailsListComponent {
  currentRoute: string;
  active = true;
  inactive = false;

  constructor(private route: Router) {
    this.getCurrentUrl();
    const actionType = sessionStorage.getItem('notification');
    if (actionType === 'Notification') {
      this.inactive = true;
      this.active = false;
      sessionStorage.removeItem('notification');
    }
  }

  
  papperDetails() {
    this.active = true;
    this.inactive = false;
  }
  purchasehistory() {
    this.inactive = true;
    this.active = false;
  }

  getCurrentUrl() {
    this.currentRoute = window.location.href;
    if (this.currentRoute.includes('authority-paper-details/paper-details')) {
      this.active = true;
      this.inactive = false;
    } else if (this.currentRoute.includes('purchase-history') || this.currentRoute.includes('transaction-history')) {
      this.inactive = true;
      this.active = false;
    }
  }
}
