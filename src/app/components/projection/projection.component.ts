import {Component, ResourceRef} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproDataService} from "@services/impro-data.service";
import {ScoreboardComponent} from "@components/projection/scoreboard/scoreboard.component";
import {TeamPresentationComponent} from "@components/projection/team-presentation/team-presentation.component";
import {ScreenSaverComponent} from "@components/projection/screen-saver/screen-saver.component";

@Component({
  selector: 'app-projection',
  imports: [
    ScoreboardComponent,
    TeamPresentationComponent,
    RouterOutlet,
    ScreenSaverComponent
  ],
  templateUrl: './projection.component.html',
  styleUrl: './projection.component.scss',
})
export class ProjectionComponent {
  readonly DisplayedScreen = DisplayedScreen;
  displayedScreen: ResourceRef<DisplayedScreen> = this._improDataService.displayedScreen;
  gameData = this._improDataService.gameData;

  constructor(private _improDataService: ImproDataService) {
  }

}
