import {Component, input, InputSignal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {TeamNumber} from "@enums/team-number.enum";
import {GameData} from "@models/game-data";
import {ImproData} from "@models/impro-data";
import {FormatImproHeaderPipe} from "@pipes/format-impro-header.pipe";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-scoreboard',
  imports: [
    ScoreboardTeamComponent,
    FormatImproHeaderPipe,
    TitleCasePipe
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {
  readonly Team = TeamNumber;

  gameData: InputSignal<GameData> = input.required();
  improData: InputSignal<ImproData> = input.required();

  constructor() {
  }


}
