import {Component, OnInit, ResourceRef} from '@angular/core';
import {TeamMetadata} from "@models/team-metadata";
import {FormsModule} from "@angular/forms";
import {TeamFormComponent} from "@components/video-switcher/team-form/team-form.component";
import {GameData} from "@models/game-data";
import {TeamNumber} from "@enums/team-number.enum";
import {ImproDataService} from "@services/impro-data.service";
import {rxResource} from "@angular/core/rxjs-interop";
import {PlayerMetadata} from "@models/player-metadata";

@Component({
  selector: 'app-teams-parameters',
  imports: [
    FormsModule,
    TeamFormComponent
  ],
  templateUrl: './teams-parameters.component.html',
  styleUrl: './teams-parameters.component.scss'
})
export class TeamsParametersComponent {
  players: ResourceRef<PlayerMetadata[]> = rxResource({
    loader: () => this._improDataService.getPlayers(),
    defaultValue: []
  });

  teams: ResourceRef<Record<string, TeamMetadata>> = rxResource({
    loader: () => this._improDataService.getTeams(),
    defaultValue: {}
  });

  gameData:  ResourceRef<GameData> = rxResource({
    loader: () => this._improDataService.getGameData(),
    defaultValue: new GameData({})
  });




  constructor(
    private _improDataService: ImproDataService
  ) {}

  restoreData() {
  }

  saveData() {
  }
  protected readonly TeamNumber = TeamNumber;
}
