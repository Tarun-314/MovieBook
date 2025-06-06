import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 12): string {
    if (value.length > limit) {
      return value.substring(0, limit) + '...';
    } else {
      return value;
    }
  }

}
