import {Component} from '@angular/core';
import {NgStyle, UpperCasePipe} from "@angular/common";
import {UserFilesService} from "@services/user-files.service";
import {ImproDataService} from "@services/impro-data.service";

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
  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

  constructor(
    private _improDataService: ImproDataService
  ) {
  }
}

