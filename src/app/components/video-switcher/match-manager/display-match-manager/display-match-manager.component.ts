import {Component, DestroyRef, inject, ResourceRef} from '@angular/core';
import {
  TeamManagerPanelComponent
} from "@components/video-switcher/match-manager/team-manager-panel/team-manager-panel.component";
import {NgIf} from "@angular/common";
import {
  TimeManagerPanelComponent
} from "@components/video-switcher/match-manager/time-manager-panel/time-manager-panel.component";
import {
  ImproManagerPanelComponent
} from "@components/video-switcher/match-manager/impro-manager-panel/impro-manager-panel.component";
import {TimerHandling} from "@models/timer-handling";
import {TimerAction} from "@enums/timer-action.enum";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TeamNumber} from "@enums/team-number.enum";
import {Team} from "@models/team";
import {ImproData} from "@models/impro-data";
import {ImproDataService} from "@services/impro-data.service";
import {TeamMetadata} from "@models/team-metadata";
import {GameData} from "@models/game-data";

@Component({
  selector: 'app-display-match-manager',
  imports: [
    TeamManagerPanelComponent,
    NgIf,
    TimeManagerPanelComponent,
    ImproManagerPanelComponent
  ],
  templateUrl: './display-match-manager.component.html',
  styleUrl: './display-match-manager.component.scss'
})
export class DisplayMatchManagerComponent {
  readonly TeamNumber = TeamNumber;

  teams: ResourceRef<Record<string, TeamMetadata>>  = this._improDataService.teams;
  gameData: ResourceRef<GameData> = this._improDataService.gameData;
  improData: ResourceRef<ImproData> = this._improDataService.improData;

  private _destroyRef = inject(DestroyRef);

  constructor(private _improDataService: ImproDataService) {
  }

  onAdjustImproTime(value: number): void {
    this._improDataService.saveImproTimer( new TimerHandling().withAction(TimerAction.ADJUST)
      .withDelta(value))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  onResetFouls(teamNumber: TeamNumber) {
    const updatedGameData = this.gameData.value().clone()
      .withTeamA(teamNumber === TeamNumber.TEAM_A ? this.gameData.value().teamA.withFouls(0) : this.gameData.value().teamA.withScore(++this.gameData.value().teamA.score))
      .withTeamB(teamNumber === TeamNumber.TEAM_B ? this.gameData.value().teamB.withFouls(0) : this.gameData.value().teamB.withScore(++this.gameData.value().teamB.score))

    this._improDataService.saveGameData(updatedGameData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.gameData.set(data.clone());
      });
  }

  onTeamChange(value: Team, teamNumber: TeamNumber) {
    const updatedGameData = this.gameData.value().clone()
      .withTeamA(teamNumber === TeamNumber.TEAM_A ? value : this.gameData.value().teamA)
      .withTeamB(teamNumber === TeamNumber.TEAM_B ? value : this.gameData.value().teamB);

    this._improDataService.saveGameData(updatedGameData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.gameData.set(data.clone());
      });
  }

  onImproDataChange(value: ImproData) {
    this._improDataService.saveImproData(value)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data: ImproData) => {
        this.improData.set(data.clone());
      });
  }

  onImproStart(): void {
    this._improDataService.saveImproTimer( new TimerHandling().withAction(TimerAction.START))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  onRoundStart(): void {
    this._improDataService.saveRoundTimer( new TimerHandling().withAction(TimerAction.START))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  onRoundStop(): void {
    this._improDataService.saveRoundTimer( new TimerHandling().withAction(TimerAction.STOP))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  onImproStop(): void {
    this._improDataService.saveImproTimer( new TimerHandling().withAction(TimerAction.STOP))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  onRoundReset(): void {
    this._improDataService.saveRoundTimer( new TimerHandling().withAction(TimerAction.RESET))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  onImproReset(): void {
    this._improDataService.saveImproTimer( new TimerHandling().withAction(TimerAction.RESET))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  onAdjustRoundTime(value: number): void {
    this._improDataService.saveRoundTimer( new TimerHandling().withAction(TimerAction.ADJUST)
      .withDelta(value))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }
}
