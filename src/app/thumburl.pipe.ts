import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thumburl',
  standalone: true
})
export class ThumburlPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return "/assets/thumbs" + value + ".jpg";
  }

}
