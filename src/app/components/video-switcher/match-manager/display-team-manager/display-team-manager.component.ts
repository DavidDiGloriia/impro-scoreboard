import {Component, computed, input, model, Signal} from '@angular/core';
import {Team} from "@models/team";
import {KeyValueNoSortPipe} from "@pipes/key-value-no-sort.pipe";
import {PlayerMetadata} from "@models/player-metadata";
import {find, keyBy} from "lodash-es";
import {ImproDataService} from "@services/impro-data.service";
import {RoleNamePipe} from "@pipes/role-name.pipe";
import {TeamMetadata} from "@models/team-metadata";
import {NgIf} from "@angular/common";
import {Player} from "@models/player";

@Component({
  selector: 'app-display-team-manager',
  imports: [
    KeyValueNoSortPipe,
    RoleNamePipe,
    NgIf
  ],
  templateUrl: './display-team-manager.component.html',
  styleUrl: './display-team-manager.component.scss'
})
export class DisplayTeamManagerComponent {

  team = model.required<Team>();

  playersByCode: Signal<{ [name: string]: PlayerMetadata }> = computed(() => {
    const players: PlayerMetadata[] = this.players.value();
    // Crée un objet indexé par player.name, avec la valeur = player
    return keyBy(players, 'code');
  });
  teamMetadata: Signal<TeamMetadata> = computed(() => {
    return find(this._improDataService.teams.value(), (team: TeamMetadata) => {
      return team.name === this.team().name;
    });
  });

  players = this._improDataService.players;
  gameData = this._improDataService.gameData;

  constructor(private _improDataService: ImproDataService) {
  }

  onTogglePlayerDisplay(playerKey: string) {
    this.team.update((team: Team) => {
      const updatedPlayers = {...team.players};
      updatedPlayers[playerKey] = new Player({
        ...updatedPlayers[playerKey]?.toDto(),
        displayed: !updatedPlayers[playerKey]?.displayed
      })

      return team.clone().withPlayers(updatedPlayers);
    });
  }

  toggleAllPlayers(value: boolean) {
    this.team.update((team: Team) => {
      const updatedPlayers = {...team.players};
      Object.keys(updatedPlayers).forEach((key) => {
        updatedPlayers[key] = new Player({
          ...updatedPlayers[key]?.toDto(),
          displayed: value
        })
      })

      return team.clone().withPlayers(updatedPlayers);
    });

  }
}
