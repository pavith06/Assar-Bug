
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
const BaseUrl = environment.API_BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class DashboardNotificDetailsService {

constructor(private http: HttpClient) { }

/**
 * RECEIVABLE GET METHOD
 * @returns
 */

/**
 * PAYABLE GET METHOD
 * @returns
 */

}
