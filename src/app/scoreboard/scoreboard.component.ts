import {Component, signal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {Team} from "../shared/enums/team.enum";

@Component({
  selector: 'app-scoreboard',
  imports: [
    ScoreboardTeamComponent
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent {
  readonly Team = Team;

  themeTitle = signal('POURVU QUE CA MARCHE !');
  themeStyle = signal('A la manière de la chanson de Gold');

}
