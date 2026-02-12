import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMinimumDecimal',
})
export class FormatMinimumDecimalPipe implements PipeTransform {
  transform(value: number | string, locale?: string): string {
    if(value===null || value===undefined || value === ''){
      return null;
    }else{
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits:3,
        maximumFractionDigits: 3
      }).format(Number(value));
    }
  }
}