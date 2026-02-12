import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nServiceService {

  currentLang = 'English';
  selectedLanguageSubject = new Subject();

  setSelectedLanguage(language:any) {
    this.currentLang = language;
    this.applyLanguage(this.currentLang);
  }
  private applyLanguage(language:any) {
    this.selectedLanguageSubject.next(language);
    this.translate.use(language);
  }
  getLanguages() {
    return this.translate.getLangs();
  }

  constructor(public translate: TranslateService) {
    this.translate = translate;
   }

  setUpConf() {
    this.translate.addLangs(['English', 'French']);
    this.selectedLanguageSubject.next(this.currentLang);
    this.translate.setDefaultLang(this.currentLang);
    this.applyLanguage(this.currentLang);
  }
}
