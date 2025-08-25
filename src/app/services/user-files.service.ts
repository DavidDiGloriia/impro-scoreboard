// src/app/services/user-files.service.ts
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

declare global {
  interface Window {
    electronAPI: {
      getUserFolder: () => Promise<string>;
      listUserFiles: () => Promise<string[]>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserFilesService {

  getUserFolder(): Observable<string> {
    return from(window.electronAPI.getUserFolder());
  }

  listFiles(): Observable<string[]> {
    return from(window.electronAPI.listUserFiles());
  }

  getMP4Files(): Observable<string[]> {
    return from(window.electronAPI.listUserFiles().then(files => files.filter(file => file.toLowerCase().endsWith('.mp4'))));
  }
}
