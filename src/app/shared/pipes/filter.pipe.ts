import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string, index: number): any {
    
    if (value.length === 0 || filterString.length === 0) {
      return value;
    }

    const resultArr: any[] = [];
    for (const item of value) {
      if (item[index] === filterString) {
        resultArr.push(item);
      }
    }
    return resultArr;
  }
}
