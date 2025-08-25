import {Component, DestroyRef, inject, ResourceRef} from '@angular/core';
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproDataService} from "@services/impro-data.service";
import {GameData} from "@models/game-data";
import {NgIf, UpperCasePipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ImproData} from "@models/impro-data";
import {
  DisplayMatchManagerComponent
} from "@components/video-switcher/match-manager/display-match-manager/display-match-manager.component";
import {
  DisplayVideoManagerComponent
} from "@components/video-switcher/match-manager/display-video-manager/display-video-manager.component";
import {
  DisplayAnthemManagerComponent
} from "@components/video-switcher/match-manager/display-anthem-manager/display-anthem-manager.component";

@Component({
  selector: 'app-match-manager',
  imports: [
    NgIf,
    UpperCasePipe,
    DisplayMatchManagerComponent,
    DisplayVideoManagerComponent,
    DisplayAnthemManagerComponent
  ],
  templateUrl: './match-manager.component.html',
  styleUrl: './match-manager.component.scss'
})
export class MatchManagerComponent {
  readonly DisplayedScreen = DisplayedScreen;

  gameData: ResourceRef<GameData> = this._improDataService.gameData;
  displayedScreen: ResourceRef<DisplayedScreen> = this._improDataService.displayedScreen;
  improData: ResourceRef<ImproData> = this._improDataService.improData;

  private _destroyRef = inject(DestroyRef);

  constructor(private _improDataService: ImproDataService) {
  }

  displayScreen(screen: DisplayedScreen) {
    this._improDataService.saveDisplayedScreen(screen)
      .pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
        next: (data) => {
          this.displayedScreen.set(data);
        }
    })
  }

}
