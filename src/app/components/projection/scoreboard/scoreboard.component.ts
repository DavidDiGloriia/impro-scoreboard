import {Component, input, InputSignal, signal, WritableSignal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {TeamNumber} from "@enums/team-number.enum";
import {GameData} from "@models/game-data";
import {ImproData} from "@models/impro-data";
import {FormatImproHeaderPipe} from "@pipes/format-impro-header.pipe";
import {TitleCasePipe} from "@angular/common";
import {FormatTimePipe} from "@pipes/format-time.pipe";

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

  gameData: InputSignal<GameData> = input.required();
  improData: InputSignal<ImproData> = input.required();
  roundTimer: InputSignal<number> = input(2700); // 45 minutes in seconds
  improTimer: InputSignal<number> = input(180);

  modeBasseWavre: WritableSignal<boolean> = signal(true);
}
