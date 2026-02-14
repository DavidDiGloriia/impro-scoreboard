import {Component, computed, input, Input, InputSignal, model, ModelSignal, Signal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {PlayerMetadata} from "@models/player-metadata";
import {TeamMetadata} from "@models/team-metadata";
import {Role} from "@enums/role.enum";
import {Team} from "@models/team";
import {TeamNumber} from "@enums/team-number.enum";
import {groupBy} from 'lodash-es';
import {Player} from "@models/player";
import {find} from 'lodash-es';

@Component({
  selector: 'app-team-form',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    KeyValuePipe,
  ],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent {
  protected readonly roles: Role[] = Object.values(Role);
  protected readonly Role = Role;

  team: ModelSignal<Team> = model.required();
  availableTeams: InputSignal<Record<string, TeamMetadata>> = input.required();

  @Input() players: PlayerMetadata[] = [];
  @Input({required: true}) teamNumber: TeamNumber;

  readonly availableLogos: { label: string, path: string }[] = [
    { label: 'Femmes', path: 'assets/equipes/custom/femmes.png' },
    { label: 'Hommes', path: 'assets/equipes/custom/hommes.png' },
  ];

  jerseys: Signal<number[]> = computed(() => {
    const team: TeamMetadata = find(this.availableTeams(), (team: TeamMetadata) => {
      return team.name === this.team().name;
    });

    return team ? team.jerseys : [];
  });

  availableTeamsByGroup: Signal<{ [group: string]: TeamMetadata[] }> = computed(() => {
    const teams = this.availableTeams();
    return groupBy(Object.values(teams), team => team.group);
  });

  isColorTeam: Signal<boolean> = computed(() => {
    const metadata: TeamMetadata = find(this.availableTeams(), (t: TeamMetadata) => {
      return t.name === this.team().name;
    });
    return metadata?.group === 'couleurs';
  });

  protected readonly TeamNumber = TeamNumber;

  onTeamNameChange(value: string) {
    this.team.update((team: Team) => {
      return team.clone().withName(value).withCustomName(undefined).withImg(undefined);
    })
  }

  onCustomNameChange(value: string) {
    this.team.update((team: Team) => {
      return team.clone().withCustomName(value || undefined);
    });
  }

  onImgChange(path: string) {
    this.team.update((team: Team) => {
      const newImg = team.img === path ? undefined : path;
      return team.clone().withImg(newImg);
    });
  }

  onPlayerNameChange(value: string, role: Role) {
    this.team.update((team: Team) => {
      const updatedPlayers = { ...team.players };
      updatedPlayers[role] = new Player({
        ...updatedPlayers[role]?.toDto(),
        code: value,
      })

      return team.clone().withPlayers(updatedPlayers);
    });
  }


  onPlayerNumberChange(value: number, role: Role) {
    this.team.update((team: Team) => {
      const updatedPlayers = {...team.players};
      updatedPlayers[role] = new Player({
        ...updatedPlayers[role]?.toDto(),
        number: value,
      })

      return team.clone().withPlayers(updatedPlayers);
    });
  }


}
