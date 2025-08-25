import {Component, DestroyRef, inject, ResourceRef} from '@angular/core';
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproDataService} from "@services/impro-data.service";
import {GameData} from "@models/game-data";
import {TimerHandling} from "@models/timerHandling";
import {NgIf, UpperCasePipe} from "@angular/common";
import {TeamMetadata} from "@models/team-metadata";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {
  TeamManagerPanelComponent
} from "@components/video-switcher/match-manager/team-manager-panel/team-manager-panel.component";
import {TeamNumber} from "@enums/team-number.enum";
import {Team} from "@models/team";
import {
  ImproManagerPanelComponent
} from "@components/video-switcher/match-manager/impro-manager-panel/impro-manager-panel.component";
import {
  TimeManagerPanelComponent
} from "@components/video-switcher/match-manager/time-manager-panel/time-manager-panel.component";
import {ImproData} from "@models/impro-data";
import {TimerAction} from "@enums/timer-action.enum";
import {
  DisplayMatchManagerComponent
} from "@components/video-switcher/match-manager/display-match-manager/display-match-manager.component";
import {
  DisplayVideoManagerComponent
} from "@components/video-switcher/match-manager/display-video-manager/display-video-manager.component";

@Component({
  selector: 'app-match-manager',
  imports: [
    NgIf,
    UpperCasePipe,
    TeamManagerPanelComponent,
    ImproManagerPanelComponent,
    TimeManagerPanelComponent,
    DisplayMatchManagerComponent,
    DisplayVideoManagerComponent
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
