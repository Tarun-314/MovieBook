import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showTimes'
})
export class ShowTimesPipe implements PipeTransform {

  transform(showTimesJson: string): string {
    if (!showTimesJson) {
      return '';
    }

    try {
      const showTimes = JSON.parse(showTimesJson);
      return Object.keys(showTimes).join(', ');
    } catch (error) {
      console.error('Invalid JSON string:', showTimesJson);
      return '';
    }
  }
}
