import {Component, DestroyRef, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproDataService} from "@services/impro-data.service";
import {WindowService} from "@services/window.service";
import {ProjectionData} from "@models/projection-data";

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

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.moveProjection('up');
        break;
      case 'ArrowDown':
        this.moveProjection('down');
        break;
      case 'ArrowLeft':
        this.moveProjection('left');
        break;
      case 'ArrowRight':
        this.moveProjection('right');
        break;
    }
  }

  moveProjection(direction: 'up' | 'down' | 'left' | 'right') {
    this.activeButton = direction;

    // Récupère les données actuelles
    const current = this.projectionData.value();
    let newX = current.x;
    let newY = current.y;

    // Ajuste en fonction de la direction
    switch (direction) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }

    this._improDataService.saveProjectionData(
      new ProjectionData({
        ...current,
        x: newX,
        y: newY
      })).pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (data) => {
        this.projectionData.set(data);
      }
    })

    // Réinitialise l'état du bouton après un petit délai pour l'effet visuel
    setTimeout(() => this.activeButton = null, 150);
  }

  resetPosition() {

  }


}
