import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment} from "src/environments/environment";
import { NotificationDTO } from '../models/notification-dto';
import { PurchaseHistoryNotificationDTO } from '../models/purchase-history-notification-dto';

const baseUrl = environment.API_BASE_URL+"/digital-paper";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

constructor(private http: HttpClient) { }

countSubject =new Subject();
/**
 * NOTIFICATION LIST
 * @returns
 */
getNotificationList(): Observable<NotificationDTO[]>{
  return this.http.get<NotificationDTO[]>(baseUrl+'/api/claim/notification');
}
/**
 * NOTIFICATION COUNT
 * @returns
 */
getNotificationCount(){
  return this.http.get(baseUrl+'/get-notification-Count');
  }

getNotificationListPurchaseHistory(skip:number,limit:number):Observable<PurchaseHistoryNotificationDTO[]>{

  const params={
    skip,
    limit
  }
return this.http.get<PurchaseHistoryNotificationDTO[]>(baseUrl+'/get-notification',{params});
}

updateNotification(notificationid:number){
  return this.http.post(baseUrl+'/Update-notificationt',notificationid);
  }

}
