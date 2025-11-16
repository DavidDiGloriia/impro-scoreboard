import { Component, InputSignal, Signal, computed, input } from '@angular/core';
import { KeyValueNoSortPipe } from '@pipes/key-value-no-sort.pipe';
import { RoleNamePipe } from '@pipes/role-name.pipe';
import { Team } from '@models/team';
import { TeamMetadata } from '@models/team-metadata';
import { PlayerMetadata } from '@models/player-metadata';
import { find, omit, keyBy  } from 'lodash-es';
import {NgForOf, NgIf} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";

@Component({
  selector: 'app-team-block-presentation',
  imports: [
    RoleNamePipe,
    KeyValueNoSortPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './team-block-presentation.component.html',
  styleUrl: './team-block-presentation.component.scss'
})
export class TeamBlockPresentationComponent {
  team: InputSignal<Team> = input.required();
  automaticPlayerPresentation: InputSignal<boolean> = input.required();
  players: InputSignal<PlayerMetadata[]> = input.required();

  teamMetadata: Signal<TeamMetadata> = computed(() => {
    return find(this._improDataService.teams.value(), (team: TeamMetadata) => {
      return team.name === this.team().name;
    });
  })


  filteredTeamPlayers = computed(() => omit(this.team().players, ['coach']));


  /** Indexation des joueurs par code */
  playersByCode: Signal<{ [name: string]: PlayerMetadata }> = computed(() => {
    const players: PlayerMetadata[] = this.players();
    // Crée un objet indexé par player.name, avec la valeur = player
    return keyBy(players, 'code');
  });

  playersCount: Signal<number> = computed(() => {
    return Object.values(this.team().players).length;
  });

  constructor(private _improDataService: ImproDataService) {
  }
}
