import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaseperator'
})
export class CommaseperatorPipe implements PipeTransform {

  transform(input:Array<string>, sep = ','): string {
    return input.join(sep);
  }

}
