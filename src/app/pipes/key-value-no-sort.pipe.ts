import { Pipe, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';

@Pipe({
  name: 'keyValueNoSort'
})
export class KeyValueNoSortPipe implements PipeTransform {
  transform<T>(value: { [key: string]: T } | null | undefined): KeyValue<string, T>[] {
    if (!value) return [];

    return Object.keys(value).map(key => ({
      key,
      value: value[key]
    }));
  }
}
