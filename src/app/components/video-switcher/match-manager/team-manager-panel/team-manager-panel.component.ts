import {Component, computed, input, InputSignal, model, ModelSignal, ResourceRef, Signal} from '@angular/core';
import {TeamNumber} from "@enums/team-number.enum";
import {Team} from "@models/team";
import {TeamMetadata} from "@models/team-metadata";
import {ImproDataService} from "@services/impro-data.service";
import {clamp, find, max} from "lodash-es";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-team-manager-panel',
  imports: [
    FormsModule
  ],
  templateUrl: './team-manager-panel.component.html',
  styleUrl: './team-manager-panel.component.scss'
})
export class TeamManagerPanelComponent {
  team: ModelSignal<Team> = model.required();
  teamNumber: InputSignal<TeamNumber> = input.required();

  teams: ResourceRef<Record<string, TeamMetadata>>  = this._improDataService.teams;

  constructor(private _improDataService: ImproDataService) {}

  teamMetadata: Signal<TeamMetadata> = computed(() => {
    if (!this.teams.value()) {
      return;
    }

    return find(this.teams.value(), (team: TeamMetadata) => {
      return team.name === this.team().name;
    });
  });

  legendColor: Signal<string> = computed(() => {
    if(!this.teamMetadata()) {
      return;
    }
    return this._hexToRgba(this.teamMetadata().color, 1, 0.45);
  });

  buttonColor: Signal<string> = computed(() => {
    if(!this.teamMetadata()) {
      return;
    }

    return this._hexToRgba(this.teamMetadata().color, 1, 0.5);
  });

  backgroundColor: Signal<string> = computed(() => {
    if(!this.teamMetadata()) {
      return;
    }

    return this._hexToRgba(this.teamMetadata().color, 0.4);
  });

  private _hexToRgba(hex: string, alpha: number, darkenFactor = 1): string {
    const match = hex.replace('#', '').match(/.{1,2}/g);
    if (!match) return hex;
    let [r, g, b] = match.map(x => parseInt(x, 16));

    // Appliquer l'assombrissement en multipliant par darkenFactor (0..1)
    r = Math.floor(r * darkenFactor);
    g = Math.floor(g * darkenFactor);
    b = Math.floor(b * darkenFactor);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  onScoreChange(value: number) {
    const minValue = max([value, 0]);

    this.team.update((team: Team) => {
      return team.clone().withScore(minValue);
    });
  }

  onFoulsChange(value: number) {
    const clampedValue = clamp(value, 0, 3);

    this.team.update((team: Team) => {
      return team.clone().withFouls(clampedValue);
    });
  }
}
