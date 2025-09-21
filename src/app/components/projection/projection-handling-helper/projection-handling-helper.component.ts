import {Component} from '@angular/core';
import {ImproDataService} from "@services/impro-data.service";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-projection-handling-helper',
  imports: [
    NgStyle
  ],
  templateUrl: './projection-handling-helper.component.html',
  styleUrl: './projection-handling-helper.component.scss'
})
export class ProjectionHandlingHelperComponent {

  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

  constructor(private _improDataService: ImproDataService) {
  }
}
