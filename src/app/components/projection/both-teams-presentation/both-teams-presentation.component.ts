import {Component, computed, input, InputSignal, Signal} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {Team} from "@models/team";
import {Player} from "@models/player";
import { find, keyBy } from "lodash-es";
import {TeamMetadata} from "@models/team-metadata";
import {GameData} from "@models/game-data";
import {
  TeamBlockPresentationComponent
} from "@components/projection/both-teams-presentation/team-block-presentation/team-block-presentation.component";
import {ImproDataService} from "@services/impro-data.service";
import {ProjectionMode} from "@enums/projection-mode.enum";

@Component({
  selector: 'app-both-teams-presentation',
  imports: [
    TeamBlockPresentationComponent,
    TeamBlockPresentationComponent,
    NgStyle
  ],
  templateUrl: './both-teams-presentation.component.html',
  styleUrl: './both-teams-presentation.component.scss'
})
export class BothTeamsPresentationComponent {
  gameData: InputSignal<GameData> = input.required();
  projectionMode: InputSignal<ProjectionMode> = input.required();


  players = this._improDataService.players;

  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

  constructor(private _improDataService: ImproDataService) {
  }

  protected readonly ProjectionMode = ProjectionMode;
}
