import {Component, input} from '@angular/core';
import {Team} from "../../shared/enums/team.enum";

@Component({
  selector: 'app-scoreboard-team',
  imports: [],
  templateUrl: './scoreboard-team.component.html',
  styleUrl: './scoreboard-team.component.scss'
})
export class ScoreboardTeamComponent {
  maxFouls = Array(3);

  team = input<Team>(Team.TEAM_A);
  fouls = input<number>(0);
  score = input<number>(0);

}
