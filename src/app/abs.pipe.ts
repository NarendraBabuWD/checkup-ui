import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'abs'})

export class AbsPipe implements PipeTransform {
    transform(value: number): any { 
      return Math.abs(value);
    }
}