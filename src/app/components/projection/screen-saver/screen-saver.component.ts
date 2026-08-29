import {Component, input, InputSignal, Signal} from '@angular/core';
import {NgStyle} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {ProjectionMode} from "@enums/projection-mode.enum";

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

  /** Logo à la couleur de l'équipe qui mène, mono à égalité. */
  logoSrc: Signal<string> = this._improDataService.leaderLogo;

  constructor(
    private _improDataService: ImproDataService
  ) {
  }
}
