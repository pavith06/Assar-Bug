/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from './auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private inject:Injector) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authservice = this.inject.get(AuthService)
    const accessToken=req.clone({
      setHeaders:{
        Authorization:'Bearer ' + authservice.GetToken()
      }
    });
    return next.handle(accessToken);
  }


}
