import {Component, computed, inject, input, Signal} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet} from "@angular/common";
import { TeamNumber } from '@enums/team-number.enum'
import { Team } from '@models/team';
import {ImproDataService} from "@services/impro-data.service";
import { find } from 'lodash-es';
import {TeamMetadata} from "@models/team-metadata";

@Component({
  selector: 'app-scoreboard-team',
  imports: [
    NgTemplateOutlet,
    NgClass,
    NgStyle
  ],
  templateUrl: './scoreboard-team.component.html',
  styleUrl: './scoreboard-team.component.scss'
})
export class ScoreboardTeamComponent {
  readonly Team = TeamNumber;

  private _improDataService = inject(ImproDataService);

  maxFouls = Array(3);

  teamNumber = input<TeamNumber>(TeamNumber.TEAM_A);
  team = input.required<Team>();

  teamMetadata: Signal<TeamMetadata> = computed(() => {
    return find(this._improDataService.teams.value(), (team: TeamMetadata) => {
      return team.name === this.team().name;
    });
  })

  photoClass: Signal<string> = computed(() => {
    if (!this.teamMetadata() &&  this.teamMetadata().group !== 'animaux') {
      return '';
    }

    return `photo-${this.teamNumber()}-${this.teamMetadata().code}`;
  });

  scoreStyle: Signal<Record<string, string>> = computed(() => {
    if (!this.teamMetadata()) {
      return {};
    }
    const color = this.teamMetadata().color ?? '#ff4d4d';

    const bgColor = this._hexToRgba(color, 0.15);
    const textShadow = `0 0 8px ${this._hexToRgba(color, 0.7)}`;

    return {
      color: color,
      'background-color': bgColor,
      'box-shadow': textShadow,
      'border-color': color,
    };
    });

  private _hexToRgba(hex: string, alpha: number): string {
    const match = hex.replace('#', '').match(/.{1,2}/g);
    if (!match) return hex;
    const [r, g, b] = match.map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

}
