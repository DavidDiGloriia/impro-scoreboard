import {Component, effect, input, InputSignal} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import { ProjectionMode } from '@enums/projection-mode.enum';
import {ImproDataService} from "@services/impro-data.service";

@Component({
  selector: 'app-anthem',
  imports: [
    NgClass,
    NgIf,
    NgStyle
  ],
  templateUrl: './anthem.component.html',
  styleUrl: './anthem.component.scss',
})
export class AnthemComponent {
  protected readonly ProjectionMode = ProjectionMode;
  projectionMode: InputSignal<ProjectionMode> = input.required();
  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

  line = '';
  classLine: string;

  constructor(private _improDataService: ImproDataService) {
    effect(() => {
      const lineResource = this._improDataService.anthemLine.value();

      // Reset la classe immédiatement
      this.classLine = '';
      this.line = '';

      // Applique le fade-in après 1s
      setTimeout(() => {
        this.line = lineResource;
        this.classLine = 'fade-in';
      }, 50); // 1000ms = 1 seconde
    });

  }

}
