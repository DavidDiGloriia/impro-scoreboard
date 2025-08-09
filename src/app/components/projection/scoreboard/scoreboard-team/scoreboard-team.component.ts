import {Component, input} from '@angular/core';
import {NgClass, NgTemplateOutlet} from "@angular/common";
import { Team } from '@enums/team.enum'

@Component({
  selector: 'app-scoreboard-team',
  imports: [
    NgTemplateOutlet,
    NgClass
  ],
  templateUrl: './scoreboard-team.component.html',
  styleUrl: './scoreboard-team.component.scss'
})
export class ScoreboardTeamComponent {
  readonly Team = Team;

  maxFouls = Array(3);

  team = input<Team>(Team.TEAM_A);
  fouls = input<number>(0);
  score = input<number>(0);

}
