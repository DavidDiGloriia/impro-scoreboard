import { Component, DestroyRef, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DisplayedScreen } from "@enums/displayed-screen.enum";
import { ImproDataService } from "@services/impro-data.service";
import { WindowService } from "@services/window.service";
import { ProjectionData } from "@models/projection-data";

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
  projectionData = this._improDataService.projectionData;

  // Direction sélectionnée par l'utilisateur via les boutons
  activeDirection: 'top' | 'bottom' | 'left' | 'right' = 'top';

  // Indicateur pour effet visuel des flèches
  activeButton: 'up' | 'down' | 'left' | 'right' | null = null;

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
      next: (data) => this.displayedScreen.set(data)
    });
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

  selectDirection(direction: 'top' | 'bottom' | 'left' | 'right') {
    this.activeDirection = direction;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowUp':
        this.selectDirection('top');
        this.activeButton = 'up';
        break;
      case 'ArrowDown':
        this.selectDirection('bottom');
        this.activeButton = 'down';
        break;
      case 'ArrowLeft':
        this.selectDirection('left');
        this.activeButton = 'left';
        break;
      case 'ArrowRight':
        this.selectDirection('right');
        this.activeButton = 'right';
        break;
      case '+':
        this.changeValue(this.activeDirection, +1);
        break;
      case '-':
        this.changeValue(this.activeDirection, -1);
    }

    // Effet visuel temporaire
    if(this.activeButton) {
      setTimeout(() => this.activeButton = null, 150);
    }
  }

  changeValue(direction: 'top' | 'bottom' | 'left' | 'right', delta: number) {
    const current: ProjectionData = this.projectionData.value().clone();

    switch(direction) {
      case 'top': current.top = Math.max(0, current.top + delta); break;
      case 'bottom': current.bottom = Math.max(0, current.bottom + delta); break;
      case 'left': current.left = Math.max(0, current.left + delta); break;
      case 'right': current.right = Math.max(0, current.right + delta); break;
    }

    // Mise à jour locale immédiate
    this.projectionData.set(current);

    // Sauvegarde côté service
    this._improDataService.saveProjectionData(current)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => this.projectionData.set(data)
      });
  }



  resetPosition() {
    const reset: ProjectionData = new ProjectionData({ top: 0, bottom: 0, left: 0, right: 0 });
    this.projectionData.set(reset);

    this._improDataService.saveProjectionData(reset)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => this.projectionData.set(data)
      });
  }
}
