import { Pipe, PipeTransform } from '@angular/core';

/*
 * Converts line returns to <br> tags
*/
@Pipe({ name: 'nl2br' })
export class Nl2brPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, '<br/>');
  }
}
