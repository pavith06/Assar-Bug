import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format',
})
export class FormatPipe implements PipeTransform {
  transform(value: number | string, locale?: string): string {
    if(value===null || value===undefined || value === ''){
      return null;
    }else{
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 3
      }).format(Number(value));
    }
  }
}
