import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true,
  pure: false
})
export class SortPipe implements PipeTransform {

  transform(arr: string[] | number[], order: 'asc' | 'desc' = 'asc'): string[] | number[] {
    if (typeof arr[0] === 'string') {
      arr = arr.map(item => parseFloat(item as string));
    }
    
    arr.sort((a, b) => {
      if (order === 'asc') {
        return (a as number) - (b as number);
      } 
      return (b as number) - (a as number);
    });
    
    return arr;
  }

}
