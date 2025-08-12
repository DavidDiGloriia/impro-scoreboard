import {Component, computed, input, InputSignal, Signal} from '@angular/core';
import {Team} from "@models/team";
import {TeamMetadata} from "@models/team-metadata";
import {find, keyBy} from "lodash-es";
import {ImproDataService} from "@services/impro-data.service";
import { NgIf, UpperCasePipe} from "@angular/common";
import {PlayerMetadata} from "@models/player-metadata";
import {KeyValueNoSortPipe} from "@pipes/key-value-no-sort.pipe";
import {RoleNamePipe} from "@pipes/role-name.pipe";

@Component({
  selector: 'app-team-presentation',
  imports: [
    NgIf,
    KeyValueNoSortPipe,
    UpperCasePipe,
    RoleNamePipe
  ],
  templateUrl: './team-presentation.component.html',
  styleUrl: './team-presentation.component.scss'
})
export class TeamPresentationComponent {
  team: InputSignal<Team> = input.required();
  players = this._improDataService.players;
  teamMetadata: Signal<TeamMetadata> = computed(() => {
    return find(this._improDataService.teams.value(), (team: TeamMetadata) => {
      return team.name === this.team().name;
    });
  })

  playersByCode: Signal<{ [name: string]: PlayerMetadata }> = computed(() => {
    const players: PlayerMetadata[] = this.players.value();
    // Crée un objet indexé par player.name, avec la valeur = player
    return keyBy(players, 'code');
  });

  constructor(private _improDataService: ImproDataService) {
  }
}
