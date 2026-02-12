import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'number'
})
export class NumberPipe implements PipeTransform {

  transform(value: number|string):string {

    if(value===0 || value===null || value<0 || value===undefined)
    {
      return '-';
    }
    else
    {
      return String(value);
    }
  
}


}
