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
  DisplayMediaManagerComponent
} from "@components/video-switcher/match-manager/display-media-manager/display-media-manager.component";
import {
  DisplayAnthemManagerComponent
} from "@components/video-switcher/match-manager/display-anthem-manager/display-anthem-manager.component";
import {
  DisplayTeamManagerComponent
} from "@components/video-switcher/match-manager/display-team-manager/display-team-manager.component";
import {TeamNumber} from "@enums/team-number.enum";
import {Team} from "@models/team";
import {
  DisplayPubsManagerComponent
} from "@components/video-switcher/match-manager/display-pubs-manager/display-pubs-manager.component";

@Component({
  selector: 'app-match-manager',
  imports: [
    NgIf,
    UpperCasePipe,
    DisplayMatchManagerComponent,
    DisplayMediaManagerComponent,
    DisplayAnthemManagerComponent,
    DisplayTeamManagerComponent,
    DisplayPubsManagerComponent
  ],
  templateUrl: './match-manager.component.html',
  styleUrl: './match-manager.component.scss'
})
export class MatchManagerComponent {
  readonly DisplayedScreen = DisplayedScreen;
  protected readonly TeamNumber = TeamNumber;


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

  onTeamChange(value: Team, teamNumber: TeamNumber) {
    const updatedGameData = this.gameData.value().clone()
      .withTeamA(teamNumber === TeamNumber.TEAM_A ? value : this.gameData.value().teamA.clone())
      .withTeamB(teamNumber === TeamNumber.TEAM_B ? value : this.gameData.value().teamB.clone());

    this._improDataService.saveGameData(updatedGameData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.gameData.set(data.clone());
      });
  }
}
