import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private service:AuthService,private router:Router){}

  canActivate(){

    if (this.service.isTokenExpired()) {
      return true;
    }else{
      this.router.navigate(['']);
      return false;
    }
  }

}
