import { Component, OnInit } from '@angular/core';
import { ElectronService } from './services';
import { WindowService } from './services/window.service';
import { RouterOutlet } from '@angular/router';

export const AUTO_MOVE_PROJECTION_STORAGE_KEY = 'improvisation-be:auto-move-projection-on-new-display';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    private windowService: WindowService,
  ) {
  }

  ngOnInit() {
    const enabled = localStorage.getItem(AUTO_MOVE_PROJECTION_STORAGE_KEY) === 'true';
    this.windowService.setAutoMoveProjectionOnNewDisplay(enabled).subscribe();
  }
}
