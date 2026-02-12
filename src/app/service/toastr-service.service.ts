import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrServiceService {

  constructor(private toastr: ToastrService, private translate: TranslateService) {}

  showSuccess(messageKey: string) {
    this.translate.get(messageKey).subscribe(message => {
      this.toastr.success(message);
    });
  }

  showError(messageKey: string) {
    this.translate.get(messageKey).subscribe(message => {
      this.toastr.error(message);
    });
  }

  
}
