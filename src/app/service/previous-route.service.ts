import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
      private routerSubject = new BehaviorSubject<any>(null);
      private currentRouterValue = new BehaviorSubject<any>(null);

      constructor() { }

      setRouterValue(value: string) {
          this.routerSubject.next(value);
      }

      getRouterValue() {
          return this.routerSubject.asObservable();
      }

      setCurrentRouter(value:string){
        this.currentRouterValue.next(value);
      }

      getCurrentRouter(){
        return this.currentRouterValue.asObservable();
      }
}
