import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  read<T>(key: string): T{
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }

  save<T>(key: string, newData: T): T {
    const existing: T | null = this.read<T>(key);
    const merged = this.deepMerge(existing, newData);
    localStorage.setItem(key, JSON.stringify(merged));
    return this.read(key);
  }

  private deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || typeof source !== 'object') return source;
    const result = { ...target };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const key of Object.keys(source)) {
      if (this.isPlainObject(source[key]) && this.isPlainObject(target[key])) {
        result[key] = this.deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  private isPlainObject(obj: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj && typeof obj === 'object' && !Array.isArray(obj);
  }
}
