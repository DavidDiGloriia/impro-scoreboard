import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproDataService} from "@services/impro-data.service";
import {WindowService} from "@services/window.service";

@Component({
  selector: 'app-projection-handling',
  imports: [],
  templateUrl: './projection-handling.component.html',
  styleUrl: './projection-handling.component.scss'
})
export class ProjectionHandlingComponent implements OnInit, OnDestroy {
  private _improDataService: ImproDataService = inject(ImproDataService);
  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _previousDisplayedScreen: DisplayedScreen | null = null;

  displayedScreen = this._improDataService.displayedScreen;

  constructor(private windowService: WindowService) {}

  ngOnInit() {
    this._previousDisplayedScreen = this.displayedScreen.value();
    this.displayScreen(DisplayedScreen.PROJECTION_HANDLING_HELPER);
  }

  ngOnDestroy() {
    this.displayScreen(this._previousDisplayedScreen);
    this.displayedScreen.reload();
  }

  displayScreen(screen: DisplayedScreen) {
    this._previousDisplayedScreen = this.displayedScreen.value();
    this._improDataService.saveDisplayedScreen(screen)
      .pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (data) => {
        this.displayedScreen.set(data);
      }
    })
  }

  notFullscreen(win: 'control' | 'projection') {
    this.windowService.setFullscreen(win, false);
  }
  fullscreen(win: 'control' | 'projection') {
    this.windowService.setFullscreen(win, true);
  }

  move(win: 'control' | 'projection', displayIndex: number) {
    this.windowService.moveWindowToDisplay(win, displayIndex);
  }
}
