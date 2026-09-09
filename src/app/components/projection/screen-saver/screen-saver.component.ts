import {Component, input, InputSignal, Signal} from '@angular/core';
import {NgStyle} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {TeamLayoutComponent} from "@components/projection/team-layout/team-layout.component";

@Component({
  selector: 'app-screen-saver',
  imports: [
    NgStyle,
    TeamLayoutComponent
  ],
  templateUrl: './screen-saver.component.html',
  styleUrl: './screen-saver.component.scss'
})
export class ScreenSaverComponent {
  readonly ProjectionMode = ProjectionMode;

  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;
  gameData = this._improDataService.gameData;
  projectionMode: InputSignal<ProjectionMode> = input<ProjectionMode>(ProjectionMode.NORMAL);

  /** Logo à la couleur de l'équipe qui mène, mono à égalité. */
  logoSrc: Signal<string> = this._improDataService.leaderLogo;

  constructor(
    private _improDataService: ImproDataService
  ) {
  }
}
