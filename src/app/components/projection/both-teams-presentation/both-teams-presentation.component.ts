import {Component, computed, input, InputSignal, Signal} from '@angular/core';
import {NgIf} from "@angular/common";
import {Team} from "@models/team";
import {Player} from "@models/player";
import { find, keyBy } from "lodash-es";
import {TeamMetadata} from "@models/team-metadata";
import {GameData} from "@models/game-data";
import {
  TeamBlockPresentationComponent
} from "@components/projection/both-teams-presentation/team-block-presentation/team-block-presentation.component";
import {ImproDataService} from "@services/impro-data.service";

@Component({
  selector: 'app-both-teams-presentation',
  imports: [
    NgIf,
    TeamBlockPresentationComponent
  ],
  templateUrl: './both-teams-presentation.component.html',
  styleUrl: './both-teams-presentation.component.scss'
})
export class BothTeamsPresentationComponent {
  gameData: InputSignal<GameData> = input.required();

  /** récupération depuis ton service (probablement ImproDataService) */
  players = this._improDataService.players;
  teamsMetadata: TeamMetadata[] = []; // ← idem

  /** Métadonnées d’équipe */
  teamMetadata = (team: Team): Signal<TeamMetadata | undefined> => computed(() => {
    return find(this.teamsMetadata, (t: TeamMetadata) => t.name === team.name);
  });

  /** Indexation des joueurs par code */
  playersByCode = computed(() => {
    return keyBy(this.players, 'code');
  });

  /** Joueurs visibles (on ne gère pas hidden ici) */
  displayedPlayers = (team: Team): Signal<Record<string, Player>> => computed(() => {
    if (this.gameData().automaticPlayerPresentation) {
      return team.players;
    }
    return Object.fromEntries(
      Object.entries(team.players).filter(([_, p]) => p.displayed)
    );
  });

  playersCount = (team: Team): Signal<number> => computed(() => {
    return Object.values(team.players).length;
  });

  constructor(private _improDataService: ImproDataService) {
  }
}
