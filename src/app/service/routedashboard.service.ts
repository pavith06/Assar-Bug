import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './role access/service/app.service';

@Injectable({
  providedIn: 'root'
})
export class RouteDashboardService {
 
  constructor(private router: Router,private headerService: AppService) {}

  canActivate(): boolean {

   const isAuthGuardActivated = sessionStorage.getItem('auth-guard');
   sessionStorage.removeItem('auth-guard');
    if(this.headerService.isAuthenticated()){
      if(isAuthGuardActivated===undefined || isAuthGuardActivated===null){
            return false;
      }
      return true
    }
  }
}
