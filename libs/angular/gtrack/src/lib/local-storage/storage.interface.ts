export interface Storage {
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  getObject(key: string): any;
  setObject(key: string, value: unknown): void;
  removeItem(key: string): void;
  clear(): void;
}
