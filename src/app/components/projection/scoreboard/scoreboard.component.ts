import {Component, input, InputSignal, signal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {TeamNumber} from "@enums/team-number.enum";
import {GameData} from "@models/game-data";
@Component({
  selector: 'app-scoreboard',
  imports: [
    ScoreboardTeamComponent
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {
  readonly Team = TeamNumber;

  gameData: InputSignal<GameData> = input.required();

  themeTitle = signal('POURVU QUE CA MARCHE !');
  themeStyle = signal('A la manière de la chanson de Gold');

  constructor() {
  }


}
