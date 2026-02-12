import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';


@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {


  constructor() { }




  success(message: string) {
    return of(message)

}
}
