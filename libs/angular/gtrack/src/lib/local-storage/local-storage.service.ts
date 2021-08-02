import { Injectable } from '@angular/core';
import { Storage } from './storage.interface';
import * as fp from 'lodash/fp';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements Storage {
  getItem(key: string): string {
    return window.localStorage.getItem(key) || '';
  }

  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }

  clear(): void {
    window.localStorage.clear();
  }

  getObject(key: string): any {
    return fp.flow(
      () => this.getItem(key),
      item => (fp.isEmpty(item) ? undefined : JSON.parse(item))
    )();
  }

  setObject(key: string, value: unknown): void {
    this.setItem(key, JSON.stringify(value));
  }
}
