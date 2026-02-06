import {Component, input, InputSignal} from '@angular/core';
import {NgStyle, UpperCasePipe} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {ProjectionMode} from "@enums/projection-mode.enum";

@Component({
  selector: 'app-screen-saver',
  imports: [
    UpperCasePipe,
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

  constructor(
    private _improDataService: ImproDataService
  ) {
  }
}

