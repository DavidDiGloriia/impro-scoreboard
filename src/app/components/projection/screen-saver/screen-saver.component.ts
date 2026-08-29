import {Component, computed, input, InputSignal, Signal} from '@angular/core';
import {NgStyle} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {find} from "lodash-es";
import {Team} from "@models/team";
import {TeamMetadata} from "@models/team-metadata";
import {whiteLogoForColor} from "@constants/logo.constants";

@Component({
  selector: 'app-screen-saver',
  imports: [
    NgStyle
  ],
  templateUrl: './screen-saver.component.html',
  styleUrl: './screen-saver.component.scss'
})
export class ScreenSaverComponent {
  readonly ProjectionMode = ProjectionMode;

  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;
  projectionMode: InputSignal<ProjectionMode> = input<ProjectionMode>(ProjectionMode.NORMAL);

  /**
   * Logo mono tant que le score est à égalité, sinon le logo à la couleur de l'équipe qui mène.
   */
  logoSrc: Signal<string> = computed(() => {
    const gameData = this._improDataService.gameData.value();
    const teamA = gameData.teamA;
    const teamB = gameData.teamB;

    if (teamA.score === teamB.score) {
      return whiteLogoForColor();
    }

    const leader: Team = teamA.score > teamB.score ? teamA : teamB;

    return whiteLogoForColor(this._teamColor(leader));
  });

  constructor(
    private _improDataService: ImproDataService
  ) {
  }

  private _teamColor(team: Team): string | undefined {
    const metadata: TeamMetadata = find(this._improDataService.teams.value(),
      (t: TeamMetadata) => t.name === team.name);

    return metadata?.color;
  }
}
