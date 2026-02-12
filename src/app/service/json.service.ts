import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  englishJson: any;

  constructor(private http:HttpClient) { }

  getEnglishJson(): Observable<any> {
    return this.http.get('assets/i18n/English.json');
  }
}
