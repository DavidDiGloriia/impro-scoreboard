import {Component, effect, input, InputSignal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {TeamNumber} from "@enums/team-number.enum";
import {GameData} from "@models/game-data";
import {ImproData} from "@models/impro-data";
import {FormatImproHeaderPipe} from "@pipes/format-impro-header.pipe";
import {TitleCasePipe} from "@angular/common";
import {FormatTimePipe} from "@pipes/format-time.pipe";
import {ProjectionMode} from "@enums/projection-mode.enum";

@Component({
  selector: 'app-scoreboard',
  imports: [
    ScoreboardTeamComponent,
    FormatImproHeaderPipe,
    TitleCasePipe,
    FormatTimePipe
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {
  readonly Team = TeamNumber;
  readonly ProjectionMode = ProjectionMode;


  gameData: InputSignal<GameData> = input.required();
  improData: InputSignal<ImproData> = input.required();
  roundTimer: InputSignal<number> = input(2700); // 45 minutes in seconds
  improTimer: InputSignal<number> = input(180);
  projectionMode: InputSignal<ProjectionMode> = input.required();
}
