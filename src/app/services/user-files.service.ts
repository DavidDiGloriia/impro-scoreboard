// src/app/services/user-files.service.ts
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

declare global {
  interface Window {
    electronAPI: {
      // Racine
      getUserFolder: () => Promise<string>;
      listUserFiles: () => Promise<string[]>;

      // PUBS
      getPubsFolder: () => Promise<string>;
      listPubsFiles: () => Promise<string[]>;

      // MATCH
      getMatchFolder: () => Promise<string>;
      listMatchFiles: () => Promise<string[]>;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserFilesService {

  // Dossier principal
  getUserFolder(): Observable<string> {
    return from(window.electronAPI.getUserFolder());
  }

  listFiles(): Observable<string[]> {
    return from(window.electronAPI.listUserFiles());
  }

  // PUBS
  getPubsFolder(): Observable<string> {
    return from(window.electronAPI.getPubsFolder());
  }

  listPubsFiles(): Observable<string[]> {
    return from(window.electronAPI.listPubsFiles());
  }

  // MATCH
  getMatchFolder(): Observable<string> {
    return from(window.electronAPI.getMatchFolder());
  }

  listMatchFiles(): Observable<string[]> {
    return from(window.electronAPI.listMatchFiles());
  }

  // Filtrage des fichiers média
  getMediaFiles(): Observable<string[]> {
    const extensions = ['.mp4', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

    return from(
      window.electronAPI.listMatchFiles()
        .then(files =>
          files.filter(file =>
            extensions.some(ext => file.toLowerCase().endsWith(ext))
          )
        )
    );
  }
}
