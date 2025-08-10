import {Component, input} from '@angular/core';
import {NgClass, NgTemplateOutlet} from "@angular/common";
import { TeamNumber } from '@enums/team-number.enum'
import { Team } from '@models/team';

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

  teamNumber = input<TeamNumber>(TeamNumber.TEAM_A);
  team = input.required<Team>();
  fouls = input<number>(0);
  score = input<number>(0);

}
