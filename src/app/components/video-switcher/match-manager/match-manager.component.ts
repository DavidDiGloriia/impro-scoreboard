import {Component, DestroyRef, effect, inject, ResourceRef} from '@angular/core';
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
import {TeamMetadata} from "@models/team-metadata";
import {find} from "lodash-es";
import {
  DisplayPubsManagerComponent
} from "@components/video-switcher/match-manager/display-pubs-manager/display-pubs-manager.component";
import {
  DisplayStarPlayerManagerComponent
} from "@components/video-switcher/match-manager/display-star-player-manager/display-star-player-manager.component";
import {
  DisplayVoteManagerComponent
} from "@components/video-switcher/match-manager/display-vote-manager/display-vote-manager.component";

@Component({
  selector: 'app-match-manager',
  imports: [
    NgIf,
    UpperCasePipe,
    DisplayMatchManagerComponent,
    DisplayMediaManagerComponent,
    DisplayAnthemManagerComponent,
    DisplayTeamManagerComponent,
    DisplayPubsManagerComponent,
    DisplayStarPlayerManagerComponent,
    DisplayVoteManagerComponent
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

  /** Libellé court de l'équipe pour les boutons (« Aigles » plutôt que « Les Aigles »), repli sur le nom complet. */
  teamLabel(team: Team | undefined): string {
    const metadata = find(this._improDataService.teams.value(), (t: TeamMetadata) => t.name === team?.name);
    return metadata?.shortName || team?.name || '';
  }

  constructor(private _improDataService: ImproDataService) {
    effect(() => {
      console.log(this.displayedScreen.value());
    });
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
