import {Component, input} from '@angular/core';
import {NgClass, NgTemplateOutlet} from "@angular/common";
import { TeamNumber } from '@enums/team-number.enum'

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
  readonly Team = TeamNumber;

  maxFouls = Array(3);

  team = input<TeamNumber>(TeamNumber.TEAM_A);
  fouls = input<number>(0);
  score = input<number>(0);

}
