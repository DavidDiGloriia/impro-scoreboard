import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  setFullscreen(windowName: 'control' | 'projection', fullscreen: boolean): Observable<void> {
    return from(window.electronAPI.setFullscreen(windowName, fullscreen));
  }

  moveWindowToDisplay(windowName: 'control' | 'projection', displayIndex: number): Observable<void> {
    return from(window.electronAPI.moveWindowToDisplay(windowName, displayIndex));
  }
}
