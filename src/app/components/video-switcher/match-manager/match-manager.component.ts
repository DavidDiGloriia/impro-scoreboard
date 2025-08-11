import {Component, DestroyRef, inject, ResourceRef} from '@angular/core';
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproDataService} from "@services/impro-data.service";
import {GameData} from "@models/game-data";
import {NgIf, UpperCasePipe} from "@angular/common";
import {TeamMetadata} from "@models/team-metadata";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-match-manager',
  imports: [
    NgIf,
    UpperCasePipe
  ],
  templateUrl: './match-manager.component.html',
  styleUrl: './match-manager.component.scss'
})
export class MatchManagerComponent {
  readonly DisplayedScreen = DisplayedScreen;

  teams: ResourceRef<Record<string, TeamMetadata>>  = this._improDataService.teams;
  gameData: ResourceRef<GameData> = this._improDataService.gameData;
  displayedScreen: ResourceRef<DisplayedScreen> = this._improDataService.displayedScreen;

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
