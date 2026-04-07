import { Pipe, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Role } from '@enums/role.enum';

const ROLE_ORDER: string[] = Object.values(Role);

@Pipe({
  name: 'keyValueNoSort'
})
export class KeyValueNoSortPipe implements PipeTransform {
  transform<T>(value: { [key: string]: T } | null | undefined): KeyValue<string, T>[] {
    if (!value) return [];

    return Object.keys(value)
      .sort((a, b) => {
        const ia = ROLE_ORDER.indexOf(a);
        const ib = ROLE_ORDER.indexOf(b);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      })
      .map(key => ({
        key,
        value: value[key]
      }));
  }
}
