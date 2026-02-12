import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FirstTimeLoginGuard implements CanActivate {

  constructor(private service:AuthService,private router:Router,){}

  canActivate(){
    if (this.service.loginResponse.firstTimeLogin) {
      return true;
    }else{
      this.router.navigate(['']);
      return false;
    }
  }

}
