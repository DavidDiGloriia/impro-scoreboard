import {Component, effect, inject, ResourceRef, signal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {TeamNumber} from "@enums/team-number.enum";
import {ImproDataService} from "@services/impro-data.service";
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

  private _improDataService = inject(ImproDataService);

  themeTitle = signal('POURVU QUE CA MARCHE !');
  themeStyle = signal('A la manière de la chanson de Gold');


  gameData = this._improDataService.gameData;

  constructor() {
  }


}
