import {Component, input, InputSignal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {TeamNumber} from "@enums/team-number.enum";
import {GameData} from "@models/game-data";
import {ImproData} from "@models/impro-data";
import {FormatImproHeaderPipe} from "@pipes/format-impro-header.pipe";
import {NgStyle, TitleCasePipe} from "@angular/common";
import {FormatTimePipe} from "@pipes/format-time.pipe";
import {JoinNonEmptyPipe} from "@pipes/join-non-empty.pipe";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {ImproDataService} from "@services/impro-data.service";
import {TeamLayoutComponent} from "@components/projection/team-layout/team-layout.component";

@Component({
  selector: 'app-scoreboard',
  imports: [
    ScoreboardTeamComponent,
    FormatImproHeaderPipe,
    TitleCasePipe,
    FormatTimePipe,
    JoinNonEmptyPipe,
    NgStyle,
    TeamLayoutComponent
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {
  readonly Team = TeamNumber;
  readonly ProjectionMode = ProjectionMode;


  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

  gameData: InputSignal<GameData> = input.required();
  improData: InputSignal<ImproData> = input.required();
  roundTimer: InputSignal<number> = input(2700); // 45 minutes in seconds
  improTimer: InputSignal<number> = input(180);
  projectionMode: InputSignal<ProjectionMode> = input.required();

  /** Logo affiché à la place du thème quand aucune impro n'est en cours. */
  logoSrc = this._improDataService.leaderLogo;

  constructor(private _improDataService: ImproDataService) {
  }
}
