import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private STORAGE_KEY = 'improData';

  readImproData(): any {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  saveImproData(newData: any): void {
    const existing = this.readImproData();
    const merged = this.deepMerge(existing, newData);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
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
