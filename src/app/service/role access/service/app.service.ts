import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConst } from '../../app.const';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppService {

  public appConst = appConst;
  private baseUrl = environment.API_BASE_URL+ "/api/privillege/all";

    constructor(public http: HttpClient) { }

  // GET MENU ROLES
  public getMenubyRole(){
    return this.http.get(environment.API_BASE_URL + '/api/menu/all');
  }

  //GET PRIVILEGE FOR PAGE
  public getPrivilegeForPage(pageName: number){
    return this.http.get(this.baseUrl + "?pageId=" + pageName );
  }

  //GET PAGE ACCESS
  public getPageAccess(pageIdentity: string) {
    return this.http.get(environment.API_BASE_URL + '/api/page/access?pageIdentity=' + pageIdentity);
  }


  isAuthenticated(){
    const logintoken = sessionStorage.getItem('token')
    return logintoken?true:false;
  }
}
