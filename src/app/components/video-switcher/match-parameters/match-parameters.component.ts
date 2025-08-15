import {Component, DestroyRef, inject} from '@angular/core';
import {
  TeamsParametersComponent
} from "@components/video-switcher/match-parameters/teams-parameters/teams-parameters.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ImproDataService} from "@services/impro-data.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {ProjectionModeLabel} from "@constants/projection-mode.constants";

@Component({
  selector: 'app-match-parameters',
  imports: [
    TeamsParametersComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './match-parameters.component.html',
  styleUrl: './match-parameters.component.scss'
})
export class MatchParametersComponent {
  ProjectionMode = ProjectionMode;

  gameData = this._improDataService.gameData;

  private _destroyRef = inject(DestroyRef);

  constructor(
    private _improDataService: ImproDataService
  ) {
  }

  onProjectionModeChange(value: ProjectionMode) {
    const updatedGameData = this.gameData.value().clone().withProjectionMode(value);
    this._improDataService.saveGameData(updatedGameData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.gameData.set(data.clone());
      });
  }

  protected readonly ProjectionModeLabel = ProjectionModeLabel;
}
