import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {
  saveLocal(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocal(key: string): any {
    const value = localStorage.getItem(key);
    if (value !== null || value !== void 0) return JSON.parse(value as string);
  }

  clearLocal(key: string) {
    if (key) localStorage.removeItem(key);
  }
}